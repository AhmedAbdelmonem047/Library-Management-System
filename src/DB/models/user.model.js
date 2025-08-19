import mongoose from "mongoose";

export const userRoles = {
    member: "member",
    admin: "admin"
}

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.member
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;