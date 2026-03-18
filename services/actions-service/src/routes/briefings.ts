import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import * as ollama from '../lib/ollama';

const router = Router();

// GET /api/briefings — Liste les briefings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const briefings = await prisma.briefing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json(briefings);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

// POST /api/briefings/generate — Générer un briefing quotidien via Ollama
router.post('/generate', async (_req: Request, res: Response) => {
  try {
    // Collecter les stats du pipeline
    const [totalClients, newLeads, activeProjects, pendingInvoices, overdueInvoices, recentActivities] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: 'LEAD', createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.invoice.count({ where: { status: 'SENT' } }),
      prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { title: true } }),
    ]);

    const content = await ollama.generateDailyBriefing({
      totalClients,
      newLeads,
      activeProjects,
      pendingInvoices,
      overdueInvoices,
      recentActivities: recentActivities.map(a => a.title),
    });

    const briefing = await prisma.briefing.create({
      data: {
        type: 'DAILY',
        title: `Briefing du ${new Date().toLocaleDateString('fr-CA')}`,
        content,
        sentVia: ['api'],
      },
    });

    res.status(201).json(briefing);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la génération du briefing', details: (err as Error).message });
  }
});

export default router;
