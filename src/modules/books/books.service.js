import bookModel from "../../DB/models/book.model.js";

// ========= Add Book =========
export const addBook = async (req, res, next) => {
    const { title, author, publishedYear, availableCopies } = req.body;

    let message = ''
    let book = await bookModel.findOne({ title, author, publishedYear });
    if (book) {
        book.availableCopies += Number(availableCopies);
        await book.save();
        message = "Book updated successfully"
    }
    else {
        book = await bookModel.create({
            title,
            author,
            publishedYear,
            availableCopies
        })
        message = "Book added successfully"
    }
    return res.status(201).json({ message, book });
}
// ============================

// ======== Get Books =========
export const getBooks = async (req, res, next) => {
    let books = {};
    if (req.query.sortBy)
        books = await bookModel.find({}).sort(req.query.sortBy);

    else
        books = await bookModel.find({});

    return res.status(200).json({ message: "Done", books });
}
// ============================

// ======= Update Book ========
export const updateBook = async (req, res, next) => {
    const { id } = req.params;
    let book = await bookModel.findById(id);
    if (!book)
        throw new Error("Book not found", { cause: 404 });

    if (req?.body?.title)
        book.title = req.body.title
    if (req?.body?.author)
        book.author = req.body.author
    if (req?.body?.publishedYear)
        book.publishedYear = req.body.publishedYear
    if (req?.body?.availableCopies)
        book.availableCopies = req.body.availableCopies

    await book.save()
    return res.status(200).json({ message: "Book updated successfully", book });
}
// ============================

// ======= Delete Book ========
export const deleteBook = async (req, res, next) => {
    const { id } = req.params;
    let book = await bookModel.findByIdAndDelete(id);
    if (!book)
        throw new Error("Book not found", { cause: 404 });
    return res.status(200).json({ message: "Book deleted successfully", book });
}
// ============================

// ===== Advanced Search ======
export const searchBooks = async (req, res, next) => {
    const { title, author, page: pageString, limit: limitString } = req.query;
    const page = parseInt(pageString, 10) || 1;
    const limit = parseInt(limitString, 10) || 10;
    const skip = (page - 1) * limit;
    let filter = {};

    if (title)
        filter.title = { $regex: title, $options: "i" };

    if (author)
        filter.author = { $regex: author, $options: "i" };

    const [books, allDocs] = await Promise.all([
        bookModel.find(filter).skip(skip).limit(limit),
        bookModel.countDocuments(filter)
    ]);
    const totalPages = Math.max(Math.ceil(allDocs / limit), 1);

    return res.status(200).json({
        message: "Done", books,
        meta: {
            page,
            limit,
            allDocs,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
        },
    });
}
// ============================