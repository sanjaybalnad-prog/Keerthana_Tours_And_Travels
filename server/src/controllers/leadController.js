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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new ApiError(400, "Invalid pagination parameters");
  }

  const filter = {
    isDeleted: false,
  };

  if (status !== undefined) {
    if (
      typeof status !== "string" ||
      !LEAD_STATUSES.includes(status)
    ) {
      throw new ApiError(
        400,
        `Invalid status. Allowed values: ${LEAD_STATUSES.join(", ")}`
      );
    }

    filter.leadStatus = status;
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: leads.length,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: leads,
  });
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
