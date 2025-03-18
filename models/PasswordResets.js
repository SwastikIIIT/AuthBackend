import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
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

const PasswordReset=mongoose.models?.PasswordReset ||  mongoose.model("PasswordReset", passwordResetSchema);
export default PasswordReset;