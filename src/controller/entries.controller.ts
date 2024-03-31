import { BadRequestError } from '@src/utils/apiError';
import { SuccessResponse } from '@src/utils/apiResponse';
import catchAsync from '@src/utils/catchAsync';
import axios from 'axios';

export const getEntries = catchAsync(async (req, res, next) => {
  const itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const category = req.query.category ?? 'all';

  if (itemsPerPage < 1 || page < 1)
    throw next(new BadRequestError('Invalid query params'));

  const response = await axios.get('https://api.publicapis.org/entries');
  const entries: {
    API: string;
    Description: string;
    Auth: string;
    HTTPS: boolean;
    Cors: string;
    Link: string;
    Category: string;
  }[] = response.data.entries;

  const filteredEntries = entries.filter((entry) => {
    if (category === 'all') return true;
    return entry.Category === category;
  });

  const filteredEntriesCount = filteredEntries.length;
  const limitedFilteredEntries = filteredEntries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return new SuccessResponse('Entries fetched successfully', {
    entries: limitedFilteredEntries,
    total: filteredEntriesCount,
  }).send(res);
});
