import { Router } from 'express';
import {
  deleteLead,
  getLeadById,
  getLeads,
  toggleLeadStatus,
} from '../controllers/leadController.js';
import { requireAdmin } from '../middleware/auth.js';


const router = Router();

// Every lead route requires an authenticated admin.
router.use(requireAdmin);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.patch('/:id/toggle-status', toggleLeadStatus);
router.delete('/:id', deleteLead);

export default router;
