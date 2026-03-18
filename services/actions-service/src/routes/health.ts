import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'actions-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;
