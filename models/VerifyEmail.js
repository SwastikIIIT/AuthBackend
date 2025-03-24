import mongoose from "mongoose";

const verifyEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "1h", // expiresIn changed to 1 hour
  },
});

const VerifyEmail=mongoose.models?.VerifyEmail ||  mongoose.model("VerifyEmail", verifyEmailSchema);
export default VerifyEmail;