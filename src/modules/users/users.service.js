import userModel, { userRoles } from "../../DB/models/user.model.js";
import { generateToken, hash, compareHash } from "../../utils/index.js";

// ========== Signup ==========
export const signup = async (req, res, next) => {
    const { name, email, password, cPassword } = req.body;

    if (password !== cPassword)
        throw new Error("Passwords don't match", { cause: 409 });

    if (await userModel.findOne({ email }))
        throw new Error("Email already exists", { cause: 409 });

    const hashedPassword = await hash({ plaintext: password, SALT_ROUNDS: process.env.SALT_ROUNDS });
    const user = await userModel.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: "user created successfully", user });
}
// ============================

// ========== Signin ==========
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !await compareHash({ plaintext: password, cipherText: user.password }))
        throw new Error("Invalid email or password ", { cause: 409 });

    const signature = user.role == userRoles.member ? process.env.ACCESS_TOKEN_USER : process.env.ACCESS_TOKEN_ADMIN;

    const accessToken = await generateToken({ payload: { id: user._id }, signature, options: { expiresIn: "1h" } });
    const refreshToken = await generateToken({ payload: { id: user._id }, signature, options: { expiresIn: "1y" } });

    return res.status(200).json({ message: "Login successful", accessToken, refreshToken });
}
// ============================

// ======= Get Profile ========
export const getProfile = async (req, res, next) => {
    const user = await userModel.findById(req?.decodedToken?.id).select("-password -createdAt -updatedAt");
    return res.status(200).json(user);
}
// ============================