import Lead, { LEAD_STATUSES } from '../models/Lead.js';
import { ApiError } from '../utils/ApiError.js';

const findLeadOr404 = async (id) => {
  const lead = await Lead.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }
  return lead;
};

export const getLeads = async (req, res) => {
  const { status } = req.query;
  const filter = {
    isDeleted:false
  };

  if (status !== undefined) {
    if (typeof status !== 'string' || !LEAD_STATUSES.includes(status)) {
      throw new ApiError(400, `Invalid status. Allowed values: ${LEAD_STATUSES.join(', ')}`);
    }
    filter.leadStatus = status;
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: leads.length, data: leads });
};

export const getLeadById = async (req, res) => {
  const lead = await findLeadOr404(req.params.id);
  res.status(200).json({ success: true, data: lead });
};

export const toggleLeadStatus = async (req, res) => {
  const lead = await findLeadOr404(req.params.id);
  lead.leadStatus = lead.leadStatus === 'unread' ? 'read' : 'unread';
  await lead.save();
  res.status(200).json({ success: true, message: `Lead marked as ${lead.leadStatus}`, data: lead });
};

export const deleteLead = async (req, res) => {
  const lead = await findLeadOr404(req.params.id); // real deletion, not soft delete
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }
  lead.isDeleted = true
  await lead.save()
  res.status(200).json({ success: true, message: 'Lead deleted' });
};
