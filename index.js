import express from 'express'
import path from 'path'
import checkConnection from './src/DB/connectionDB.js'
import bootstrap from './src/app.controller.js';
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve("src/config/.env") })
const app = express()
const port = process.env.PORT;

checkConnection();
bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))