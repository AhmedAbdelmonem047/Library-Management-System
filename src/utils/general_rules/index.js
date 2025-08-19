import joi from "joi";
import { Types } from "mongoose"

export const customId = (value, helper) => {
    const data = Types.ObjectId.isValid(value);
    return data ? value : helper.message("Invalid Id");
}

export const generalRules = {
    id: joi.string().custom(customId),
    email: joi.string().email(),
    password: joi.string(),
    headers: joi.object({
        authorization: joi.string(),
        host: joi.string(),
        "accept-encoding": joi.string(),
        "content-type": joi.string(),
        "content-length": joi.string(),
        "connection": joi.string(),
        "user-agent": joi.string(),
        "accept": joi.string(),
        "cache-control": joi.string(),
        "postman-token": joi.string(),
    })
}