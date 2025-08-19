import bookModel from "../../DB/models/book.model.js";
import transactionModel, { bookStatus } from "../../DB/models/transaction.model.js";
import { userRoles } from "../../DB/models/user.model.js";


// ======== Borrow Book =======
export const borrowBook = async (req, res, next) => {
    const { bookId } = req.body;
    const book = await bookModel.findById(bookId);
    if (!book)
        throw new Error("Book not found", { cause: 404 });
    if (!book.availableCopies)
        throw new Error("No available copies to borrow", { cause: 409 });

    if (await transactionModel.findOne({ userId: req.user._id, bookId, status: bookStatus.borrowed }))
        throw new Error("Book already borrowed", { cause: 409 });

    book.availableCopies -= 1;
    const [transaction] = await Promise.all([
        transactionModel.create({
            userId: req.user._id,
            bookId,
            borrowDate: new Date(),
            status: bookStatus.borrowed
        }),
        book.save()
    ])

    return res.status(201).json({ message: "Book borrowed", transaction });
}
// ============================

// ======== Return Book =======
export const returnBook = async (req, res, next) => {
    const { id } = req.params;
    let transaction = await transactionModel.findById(id);
    if (!transaction)
        throw new Error("Transaction not found", { cause: 404 });
    if (req.user.role == userRoles.member) {
        if (!req.user._id.equals(transaction.userId))
            throw new Error("Only the user who borrowed the book can return it", { cause: 403 });
    }
    if (transaction.status == bookStatus.returned)
        throw new Error("Book already returned", { cause: 409 });

    const returnDate = new Date();

    if (returnDate < transaction.borrowDate)
        throw new Error("Return date cannot be before borrow date", { cause: 409 });
    let book = await bookModel.findById(transaction.bookId);
    book.availableCopies += 1;
    transaction.returnDate = returnDate;
    transaction.status = bookStatus.returned;
    await book.save();
    await transaction.save();
    return res.status(201).json({ message: "Book returned", transaction });
}
// ============================

// == User Transaction List ==
export const getUserTransactionList = async (req, res, next) => {
    const transactions = await transactionModel.find({ userId: req.user._id }).populate('bookId');
    if (!transactions.length)
        throw new Error("No transactions found", { cause: 404 });
    return res.status(200).json({ message: "Done", transactions });
}
// ============================

// ===== All Transactions =====
export const getAllTransactions = async (req, res, next) => {
    const { sortBy, filterBy } = req.query;
    let sort = { createdAt: 1 }
    let filter = {};
    if (sortBy) {
        const allowedSortFields = ['borrowDate', 'returnDate'];
        if (allowedSortFields.includes(sortBy)) {
            sort = { [sortBy]: 1 };
        }
    }
    if (filterBy) {
        const allowedFilterFields = [bookStatus.borrowed, bookStatus.returned];
        if (allowedFilterFields.includes(filterBy)) {
            filter = { status: filterBy };
        }
    }

    const transactions = await transactionModel.find(filter).populate('bookId').sort(sort);
    return res.status(200).json({ message: "Done", transactions });
}
// ============================

