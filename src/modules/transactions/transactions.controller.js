import { Router } from "express";
import * as TC from "./transactions.service.js";
import { authentication } from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as TV from "./transactions.validation.js";
import { authorization } from "../../middleware/authorization.js";
import { userRoles } from "../../DB/models/user.model.js";

export const transactionRouter = Router();

// ======= Borrow Book ========
transactionRouter.post('/borrow', authentication, validation(TV.borrowBookSchema), TC.borrowBook);
// ============================

// ======= Return Book ========
transactionRouter.put('/return/:id', authentication, validation(TV.returnBookSchema), TC.returnBook);
// ============================

// == User Transaction List ==
transactionRouter.get('/user', authentication, TC.getUserTransactionList);
// ============================

// ===== All Transactions =====
transactionRouter.get('/all', authentication, authorization(userRoles.admin), TC.getAllTransactions);
// ============================
