import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/activities — Liste les activités récentes
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const clientId = req.query.clientId as string | undefined;

    const where: Record<string, unknown> = {};
    if (clientId) where.clientId = clientId;

    const activities = await prisma.activity.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

// POST /api/activities — Créer une activité
router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, title, description, metadata, clientId, projectId } = req.body;
    const activity = await prisma.activity.create({
      data: { type, title, description, metadata, clientId, projectId },
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

export default router;
