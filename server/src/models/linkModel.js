import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    createdUrl: {
      type: String,
      required: true,
      unique: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    maxClicks: {
      type: Number,
      default: 1, // 0 = unlimited clicks
    },
    clicks: {
      type: Number,
      default: 0,
    },
    password: {
      type: String, // hashed if set
      default: null,
    },
    restrictedIp:{
      type: String,
      default: null
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Link = mongoose.model("Link", linkSchema);
