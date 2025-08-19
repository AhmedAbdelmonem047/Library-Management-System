import joi from "joi"
import { generalRules } from "../../utils/general_rules/index.js"

export const signupSchema = {
    body: joi.object({
        name: joi.string().alphanum().required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
    }).required(),
}

export const signinSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).required(),
}
