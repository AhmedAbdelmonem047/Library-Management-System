import { Router } from "express";
import * as UC from "./users.service.js";
import { authentication } from "../../middleware/authentication.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./users.validation.js";
import {  loginLimiter } from "../../middleware/rateLimiter.js";

export const userRouter = Router();
const loginLimiterMiddleware = loginLimiter();

// ========== Signup ==========
userRouter.post('/register', validation(UV.signupSchema), UC.signup)
// ============================

// ========== Signin ==========
userRouter.post('/login', loginLimiterMiddleware, validation(UV.signinSchema), UC.signin)
// ============================

// ======= Get Profile ========
userRouter.get('/profile', authentication, UC.getProfile)
// ============================
