import joi from "joi"
import { generalRules } from "../../utils/general_rules/index.js"

export const borrowBookSchema = {
    body: joi.object({
        bookId: generalRules.id.required(),
        returnDate: joi.date()
    }).required(),
}
export const returnBookSchema = {
    params: joi.object({
        id: generalRules.id.required(),
    }).required(),
}