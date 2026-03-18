/**
 * Service Ollama — Interface avec le backend LLM.
 * 
 * Permet de générer du texte via Ollama (Kimi K2.5, GLM-5, DeepSeek, etc.)
 * pour les emails, briefings, enrichissement client, et autres tâches IA.
 */

import { prisma } from './prisma';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:8b';

export interface OllamaGenerateOptions {
  model?: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  context?: string; // Pour le logging (ex: "email-draft", "briefing")
}

export interface OllamaResponse {
  response: string;
  model: string;
  tokensUsed?: number;
  durationMs?: number;
}

/**
 * Génère une réponse via Ollama.
 */
export async function generate(options: OllamaGenerateOptions): Promise<OllamaResponse> {
  const model = options.model || DEFAULT_MODEL;
  const startTime = Date.now();

  const body: Record<string, unknown> = {
    model,
    prompt: options.prompt,
    stream: false,
  };

  if (options.system) {
    body.system = options.system;
  }

  if (options.temperature !== undefined) {
    body.options = { temperature: options.temperature };
  }

  if (options.maxTokens) {
    body.options = { ...(body.options as Record<string, unknown> || {}), num_predict: options.maxTokens };
  }

  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama error (${res.status}): ${errorText}`);
  }

  const data: any = await res.json();
  const durationMs = Date.now() - startTime;

  // Log conversation to database
  try {
    await prisma.aiConversation.create({
      data: {
        model,
        prompt: options.prompt,
        response: data.response || '',
        tokensUsed: data.eval_count || null,
        durationMs,
        context: options.context || null,
      },
    });
  } catch (err) {
    console.warn('⚠️ Failed to log AI conversation:', err);
  }

  return {
    response: data.response || '',
    model,
    tokensUsed: data.eval_count,
    durationMs,
  };
}

/**
 * Chat avec Ollama (format messages).
 */
export async function chat(options: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  context?: string;
}): Promise<OllamaResponse> {
  const model = options.model || DEFAULT_MODEL;
  const startTime = Date.now();

  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: options.messages,
      stream: false,
      options: options.temperature !== undefined ? { temperature: options.temperature } : undefined,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama chat error (${res.status}): ${errorText}`);
  }

  const data: any = await res.json();
  const durationMs = Date.now() - startTime;

  // Log to DB
  const promptForLog = options.messages.map(m => `[${m.role}] ${m.content}`).join('\n');
  try {
    await prisma.aiConversation.create({
      data: {
        model,
        prompt: promptForLog,
        response: data.message?.content || '',
        tokensUsed: data.eval_count || null,
        durationMs,
        context: options.context || null,
      },
    });
  } catch (err) {
    console.warn('⚠️ Failed to log AI chat:', err);
  }

  return {
    response: data.message?.content || '',
    model,
    tokensUsed: data.eval_count,
    durationMs,
  };
}

/**
 * Liste les modèles disponibles sur Ollama.
 */
export async function listModels(): Promise<string[]> {
  const res = await fetch(`${OLLAMA_HOST}/api/tags`);
  if (!res.ok) throw new Error(`Ollama list error: ${res.status}`);
  const data: any = await res.json();
  return (data.models || []).map((m: { name: string }) => m.name);
}

/**
 * Tire (pull) un modèle sur Ollama.
 */
export async function pullModel(modelName: string): Promise<void> {
  const res = await fetch(`${OLLAMA_HOST}/api/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: modelName, stream: false }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama pull error (${res.status}): ${errorText}`);
  }
}

/**
 * Génère un brouillon d'email pour un client.
 */
export async function generateEmailDraft(
  clientName: string,
  subject: string,
  context: string,
  language: string = 'français',
): Promise<string> {
  const result = await generate({
    prompt: `Rédige un email professionnel en ${language} pour ${clientName} au sujet de : ${subject}.
Contexte : ${context}
L'email doit être professionnel, cordial et concis. Signe avec "L'équipe Uprising Studio".`,
    system: `Tu es l'Assistant IA d'Uprising Studio, cofondateur de l'agence. Tu écris des emails professionnels en ${language}.`,
    temperature: 0.7,
    context: 'email-draft',
  });
  return result.response;
}

/**
 * Génère un briefing quotidien à partir des données du pipeline.
 */
export async function generateDailyBriefing(pipelineData: {
  totalClients: number;
  newLeads: number;
  activeProjects: number;
  pendingInvoices: number;
  overdueInvoices: number;
  recentActivities: string[];
}): Promise<string> {
  const result = await generate({
    prompt: `Génère un briefing quotidien pour l'agence Uprising Studio basé sur ces données:
- Clients totaux: ${pipelineData.totalClients}
- Nouveaux leads: ${pipelineData.newLeads}
- Projets actifs: ${pipelineData.activeProjects}
- Factures en attente: ${pipelineData.pendingInvoices}
- Factures en retard: ${pipelineData.overdueInvoices}
- Activités récentes: ${pipelineData.recentActivities.join(', ')}

Format: résumé concis avec priorités et actions recommandées.`,
    system: "Tu es l'Assistant IA d'Uprising Studio, cofondateur de l'agence. Tu fais des briefings quotidiens clairs et actionnables en français.",
    temperature: 0.5,
    context: 'daily-briefing',
  });
  return result.response;
}
