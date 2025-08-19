import { Router } from "express";
import * as BC from "./books.service.js";
import { authentication } from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as BV from "./books.validation.js";
import { authorization } from "../../middleware/authorization.js";
import { userRoles } from "../../DB/models/user.model.js";

export const bookRouter = Router();

// ========= Add Book =========
bookRouter.post('/', authentication, authorization(userRoles.admin), validation(BV.addBookSchema), BC.addBook);
// ============================

// ======== Get Books =========
bookRouter.get('/', authentication, BC.getBooks);
// ============================

// ======= Update Book ========
bookRouter.put('/:id', authentication, authorization(userRoles.admin), validation(BV.updateBookSchema), BC.updateBook);
// ============================

// ======= Delete Book ========
bookRouter.delete('/:id', authentication, authorization(userRoles.admin), BC.deleteBook);
// ============================

// ===== Advanced Search ======
bookRouter.get('/search', authentication, BC.searchBooks);
// ============================

