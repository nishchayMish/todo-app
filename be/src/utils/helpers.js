import nodemailer from "nodemailer";

export const getOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000)
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

export const sendOTPEmail = async(email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Account",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is: </p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 3 minutes.</p>
    `
  })
}