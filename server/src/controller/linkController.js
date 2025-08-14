import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Link } from "../models/linkModel.js";
//import { ApiResponse } from "../utils/ApiResponse.js";

import validator from "validator"; // For extra validation
// import mime from "mime-types";
// import axios from 'axios';

import { nanoid } from "nanoid";
//import { promisify } from "util";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// getting form data for creating link
const generateLinkText = asyncHandler(async (req, res) => {
  const { text, maxClicks, expiresAt, password, restrictedIp } = req.body;

  if (
    [text, maxClicks, expiresAt].some(
      (field) => String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userId = req.user?._id || null;
  const createdUrl = nanoid(9);

  // changing expire in
  const calculateExpiryDate = (duration) => {
    const now = new Date();
    const durations = {
      "5 Minutes": 5 * 60 * 1000,
      "10 Minutes": 10 * 60 * 1000,
      "30 Minutes": 30 * 60 * 1000,
      "1 Hour": 60 * 60 * 1000,
      "1 Day": 24 * 60 * 60 * 1000,
    };
    return durations[duration] ? new Date(now.getTime() + durations[duration]) : null;
  };

  let originalText;
  console.log("Received file:", req.file);
  if (req.file) {
    const documentLocalFilePath = req.file.path;
   

    const uploadedFile = await uploadOnCloudinary(documentLocalFilePath);
    console.log("Uploaded file:", uploadedFile);
    if (!uploadedFile) {
      throw new ApiError(500, "Something went wrong on uploading file");
    }

    originalText = uploadedFile.url;
  } else if (text){
    originalText = text;
  }else{
    throw new ApiError(400, "Text or file is required");
  }

  const newLink = await Link.create({
    userId,
    createdUrl,
    originalText,
    maxClicks: Number(maxClicks),
    expiresAt: calculateExpiryDate(expiresAt),
    password: password || null,
    restrictedIp: restrictedIp || null,
  });

  if (!newLink) {
    throw new ApiError(500, "Something went wrong while creating the link");
  }

  return res.status(201).json({
    success: true,
    message: "Link Created Successfully",
    data: {
      // link: `${process.env.BASE_URL}/s/${createdUrl}`,
      link: createdUrl,
      id: createdUrl,
    },
  });
});




const viewLink = asyncHandler(async (req, res) => {
  const { createdUrl } = req.params;
  const password = req.body?.password ?? null;

  // Robust client IP (works with proxies/CDNs)
  const fwd = req.headers["x-forwarded-for"];
  const clientIp =
    (typeof fwd === "string" ? fwd.split(",")[0].trim() : null) ||
    req.socket?.remoteAddress ||
    req.ip;

  // 1) Find link (no increments yet)
  const link = await Link.findOne({ createdUrl });
  if (!link) throw new ApiError(404, "Link Not Found");

  // 2) Expiry check
  if (link.expiresAt && Date.now() > new Date(link.expiresAt).getTime()) {
    throw new ApiError(410, "Link Expired");
  }

  // 3) IP restriction check (don’t waste clicks on blocked IPs)
  if (link.restrictedIp && link.restrictedIp !== clientIp) {
    return res.status(403).json({
      success: false,
      message: "Access denied for this IP",
    });
  }

  // 4) Password check BEFORE increment
  if (link.password) {
    if (!password) {
      return res.status(200).json({ success: true, data: "password_required" });
    }
    if (link.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
  }

  // 5) Atomic click increment with maxClicks guard (prevents race conditions)
  const updatedLink = await Link.findOneAndUpdate(
    {
      _id: link._id,
      $or: [
        { maxClicks: 0 }, // unlimited
        { $expr: { $lt: ["$clicks", "$maxClicks"] } }, // still under limit
      ],
    },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!updatedLink) {
    return res.status(429).json({
      success: false,
      message: "Maximum click limit reached",
    });
  }

  // 6) Serve content
  if (updatedLink.isFile) {
    // Stream file via backend (keeps URL out of frontend code paths)
    const cloudinaryUrl = updatedLink.originalText;
    const fileName = (() => {
      try {
        return cloudinaryUrl.split("/").pop().split("?")[0];
      } catch {
        return "file";
      }
    })();
    const fileType = mime.lookup(fileName) || "application/octet-stream";

    try {
      const fileResponse = await axios.get(cloudinaryUrl, { responseType: "stream" });
      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
      res.setHeader("Content-Type", fileType);
      return fileResponse.data.pipe(res);
    } catch (e) {
      throw new ApiError(502, "Failed to fetch file");
    }
  } else {
    // Plain text
    return res.status(200).json({
      success: true,
      message: "Text fetched successfully",
      data: updatedLink.originalText,
    });
  }
});




export {
    generateLinkText,
    viewLink}
