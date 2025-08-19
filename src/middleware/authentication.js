import userModel from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/index.js";

export const authentication = async (req, res, next) => {
    const { authorization } = req.headers;

    const [prefix, token] = authorization.split(" ") || []

    if (!prefix || !token)
        throw new Error("Token not found", { cause: 404 });
    let signature = "";
    if (prefix == "bearer")
        signature = process.env.ACCESS_TOKEN_USER
    else if (prefix == "admin")
        signature = process.env.ACCESS_TOKEN_ADMIN
    else
        throw new Error("Invalid prefix token", { cause: 404 });

    const decodedToken = await verifyToken({ payload: token, signature });
    if (!decodedToken?.id)
        throw new Error("Invalid token", { cause: 400 });

    const user = await userModel.findById(decodedToken.id);
    if (!user)
        throw new Error("User not found", { cause: 404 });
    req.decodedToken = decodedToken;
    req.user = user;

    return next()
}