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

export const sendOTPForEmailVerification = async(email, otp) => {
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

export const sendOTPForResetPassword = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>

        <p>
          We received a request to reset your password. Use the OTP below to continue:
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <h1 style="letter-spacing: 6px;">${otp}</h1>
        </div>

        <p>
          This OTP will expire in <strong>3 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          Thanks,<br />
          Todo App Team
        </p>
      </div>
    `,
  });
};
