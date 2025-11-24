import nodemailer from "nodemailer";
import dotenv from "dotenv";
 
dotenv.config();
 
export const mailer = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "unique.wiegand@ethereal.email",
    pass: "KWzbhZ37UrrvnX4tef",
  },
});