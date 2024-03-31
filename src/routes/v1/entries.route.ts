import { getEntries } from '@src/controller/entries.controller';
import authMiddleware from '@src/middleware/auth.middleware';
import validate from '@src/middleware/validate.middleware';
import { filterEntriesSchema } from '@src/validation/entries.validation';

import { Router } from 'express';

const entriesRouter: Router = Router();

//*GET ROUTE

/**
 * @swagger
 * /v1/entries:
 *   get:
 *     summary: Get entries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *         description: The number of entries to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to return.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of entries to return.
 *     responses:
 *       200:
 *         description: A list of entries.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to get entries
 */
entriesRouter.get(
  '/',
  authMiddleware,
  validate({ query: filterEntriesSchema }),
  getEntries,
); // Pass itemsPerPage, page, and category as query parameters

export default entriesRouter;
