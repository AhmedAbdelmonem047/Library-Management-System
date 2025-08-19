import mongoose from "mongoose";

export const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publishedYear: {
        type: Number,
        required: true
    },
    availableCopies: {
        type: Number,
        required: true
    },
}, {timestamps: { createdAt: true, updatedAt: false }})

const bookModel = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default bookModel;