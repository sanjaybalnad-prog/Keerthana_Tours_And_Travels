import { ApiError } from '../utils/ApiError.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

// Used with router.param('id', validateObjectId)
export const validateObjectId = (req, res, next, id) => {
  if (!OBJECT_ID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid lead ID');
  }
  next();
};
