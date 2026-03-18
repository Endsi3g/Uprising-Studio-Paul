import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/invoices
router.get('/', async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { client: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

// POST /api/invoices
router.post('/', async (req: Request, res: Response) => {
  try {
    const { number, amount, currency, tax, description, clientId, projectId, dueDate } = req.body;
    const total = amount + (tax || 0);
    const invoice = await prisma.invoice.create({
      data: {
        number, amount, currency, tax: tax || 0, total, description, clientId,
        projectId: projectId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    await prisma.activity.create({
      data: { type: 'NOTE', title: `Facture ${number} créée (${total} ${currency || 'CAD'})`, clientId },
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

// PATCH /api/invoices/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data: Record<string, unknown> = { ...req.body };
    if (req.body.status === 'PAID') {
      data.paidAt = new Date();
    }
    const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ message: 'Facture supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur', details: (err as Error).message });
  }
});

export default router;
