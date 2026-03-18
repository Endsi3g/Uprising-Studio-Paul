import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/clients — Liste tous les clients
router.get('/', async (_req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      include: { _count: { select: { projects: true, invoices: true, activities: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des clients', details: (err as Error).message });
  }
});

// GET /api/clients/:id — Détail d'un client
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: { projects: true, invoices: true, activities: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!client) { res.status(404).json({ error: 'Client non trouvé' }); return; }
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

// POST /api/clients — Créer un client
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, website, source, status, notes, tags } = req.body;
    const client = await prisma.client.create({
      data: { name, email, phone, company, website, source, status, notes, tags: tags || [] },
    });

    // Log activity
    await prisma.activity.create({
      data: { type: 'NOTE', title: `Nouveau client: ${name}`, clientId: client.id },
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création', details: (err as Error).message });
  }
});

// PATCH /api/clients/:id — Mettre à jour un client
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body,
    });

    // Log status change if applicable
    if (req.body.status) {
      await prisma.activity.create({
        data: {
          type: 'STATUS_CHANGE',
          title: `Statut changé à ${req.body.status}`,
          clientId: client.id,
        },
      });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour', details: (err as Error).message });
  }
});

// DELETE /api/clients/:id — Supprimer un client
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.client.delete({ where: { id: req.params.id } });
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression', details: (err as Error).message });
  }
});

// GET /api/clients/stats/pipeline — Stats du pipeline
router.get('/stats/pipeline', async (_req: Request, res: Response) => {
  try {
    const stats = await prisma.client.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

export default router;
