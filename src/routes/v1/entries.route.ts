import { getEntries } from '@src/controller/entries.controller';
import authMiddleware from '@src/middleware/auth.middleware';
import validate from '@src/middleware/validate.middleware';
import { filterEntriesSchema } from '@src/validation/entries.validation';

import { Router } from 'express';

const entriesRouter: Router = Router();

//*GET ROUTE

entriesRouter.get(
  '/',
  authMiddleware,
  validate({ query: filterEntriesSchema }),
  getEntries,
); // Pass itemsPerPage, page, and category as query parameters

export default entriesRouter;
