import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        sparse: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    predefined: {
        type: Boolean
    }
},  {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;
