import { Router, Request, Response } from 'express';
import * as ollama from '../lib/ollama';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/ollama/generate — Génération de texte libre
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, model, system, temperature, maxTokens, context } = req.body;
    if (!prompt) { res.status(400).json({ error: 'Le champ "prompt" est requis' }); return; }

    const result = await ollama.generate({ prompt, model, system, temperature, maxTokens, context });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Ollama', details: (err as Error).message });
  }
});

// POST /api/ollama/chat — Chat avec historique
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model, temperature, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Le champ "messages" (array) est requis' }); return;
    }

    const result = await ollama.chat({ messages, model, temperature, context });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Ollama chat', details: (err as Error).message });
  }
});

// GET /api/ollama/models — Liste des modèles disponibles
router.get('/models', async (_req: Request, res: Response) => {
  try {
    const models = await ollama.listModels();
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de lister les modèles', details: (err as Error).message });
  }
});

// POST /api/ollama/pull — Télécharger un modèle
router.post('/pull', async (req: Request, res: Response) => {
  try {
    const { model } = req.body;
    if (!model) { res.status(400).json({ error: 'Le champ "model" est requis' }); return; }
    await ollama.pullModel(model);
    res.json({ message: `Modèle ${model} téléchargé avec succès` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur de téléchargement', details: (err as Error).message });
  }
});

// POST /api/ollama/email-draft — Générer un brouillon d'email
router.post('/email-draft', async (req: Request, res: Response) => {
  try {
    const { clientId, subject, context, language } = req.body;
    if (!clientId || !subject) {
      res.status(400).json({ error: 'Les champs "clientId" et "subject" sont requis' }); return;
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) { res.status(404).json({ error: 'Client non trouvé' }); return; }

    const draft = await ollama.generateEmailDraft(client.name, subject, context || '', language);

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'EMAIL',
        title: `Brouillon d'email: ${subject}`,
        description: draft,
        clientId,
      },
    });

    res.json({ draft, client: client.name, subject });
  } catch (err) {
    res.status(500).json({ error: 'Erreur génération email', details: (err as Error).message });
  }
});

// GET /api/ollama/history — Historique des conversations IA
router.get('/history', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const conversations = await prisma.aiConversation.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

export default router;
