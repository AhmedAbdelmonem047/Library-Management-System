import mongoose from "mongoose";

export const bookStatus = {
    borrowed: "borrowed",
    returned: "returned"
}

export const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrowDate: {
        type: Date,
        default: new Date(),
        required: true,
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: Object.values(bookStatus)
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

const transactionModel = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default transactionModel;