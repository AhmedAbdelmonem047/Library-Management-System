import mongoose from "mongoose"

const checkConnection = async () => {
    await mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Connect to DB successfully");
    }).catch(() => {
        console.log("ERROR!! can't connect to DB");
    })
}

export default checkConnection;