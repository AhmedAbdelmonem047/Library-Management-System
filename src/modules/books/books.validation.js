import joi from "joi"

export const addBookSchema = {
    body: joi.object({
        title: joi.string().alphanum().required(),
        author: joi.string().alphanum().required(),
        publishedYear: joi.number().positive().required(),
        availableCopies: joi.number().positive().required(),
    }).required(),
}

export const updateBookSchema = {
    body: joi.object({
        title: joi.string().alphanum(),
        author: joi.string().alphanum(),
        publishedYear: joi.number().positive(),
        availableCopies: joi.number().positive(),
    }),
}
