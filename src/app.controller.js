import { globalErrorHandling } from "./middleware/globalErrorHandling.js";
import { mongoSanitizeMiddleware } from "./middleware/inputSanitization.js";
import { bookRouter } from "./modules/books/books.controller.js";
import { transactionRouter } from "./modules/transactions/transactions.controller.js";
import { userRouter } from "./modules/users/users.controller.js";


const bootstrap = (app, express) => {
    app.use(express.json());
    app.use(mongoSanitizeMiddleware);
    app.use('/users', userRouter);
    app.use('/books', bookRouter);
    app.use('/transactions', transactionRouter);
    app.use((req, res, next) => {
        throw new Error(`URL not found ${req.originalUrl}`, { cause: 404 });
    })
    app.use(globalErrorHandling)
}
export default bootstrap;