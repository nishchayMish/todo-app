import { getOTP, sendOTPForEmailVerification } from "../../utils/helpers.js";
import { findUser, findLatestOTP, insertOTP, registerUser, setUserVerified, deleteOTPsByUserId, saveRefreshToken, fetchRefreshToken, updateRefreshToken } from "./auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserService = async (username, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUser(normalizedEmail);
    const purpose = "email_verification";

    // Verified user already exists
    if (user?.is_verified) {
        throw {
            statusCode: 400,
            message: "user already exists"
        }
    }

    // User exists but not verified
    if (user && !user?.is_verified) {
        const otp = getOTP()
        await insertOTP(user.id, otp, purpose);
        await sendOTPForEmailVerification(user.email, otp);
        return user;
    }
    
    // Brand new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await registerUser(username.trim(), normalizedEmail, hashedPassword);
    const otp = getOTP();
    await insertOTP(newUser.id, otp, purpose);
    await sendOTPForEmailVerification(newUser.email, otp);

    return newUser;
}

export const verifyUserService = async (email, otp) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = String(otp).trim();

    const user = await findUser(normalizedEmail);
    if (!user) {
        throw {
            statusCode: 404,
            message: "user not found"
        }
    }

    if (user.is_verified) {
        throw {
            statusCode: 400,
            message: "user already verified"
        }
    }

    const otpRecord = await findLatestOTP(user.id);
    if (!otpRecord) {
        throw {
            statusCode: 401,
            message: "otp expired"
        }
    }

    if (String(otpRecord.otp).trim() !== normalizedOtp) {
        throw {
            statusCode: 401,
            message: "invalid otp"
        }
    }

    const verifiedUser = await setUserVerified(user.id);
    await deleteOTPsByUserId(user.id);
    return verifiedUser;
}

export const resendOtpService = async(email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUser(normalizedEmail);
    const purpose = "email_verification";
    if (!user) {
        throw {
            statusCode: 404,
            message: "User not found",
        };
    }

  if (user.is_verified) {
    throw {
      statusCode: 400,
      message: "User already verified",
    };
  }

  const otp = getOTP();
  await insertOTP(user.id, otp, purpose);
  await sendOTPForEmailVerification(user.email, otp);

  return {
    message: "OTP sent successfully",
  };

}

export const loginUserService = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUser(normalizedEmail);
    const purpose = "email_verification";
    if(!user){
        throw {
            statusCode: 401,
            message: "user not found"
        }
    }

    const doesPasswordMatched = await bcrypt.compare(password, user.password);

    if(!doesPasswordMatched){
        throw{
            statusCode: 401,
            message: "Invalid credentials"
        }
    }

    // unverified user agar login kare to uske email pe otp bej do
    if (user && !user?.is_verified) {
        const otp = getOTP()
        await insertOTP(user.id, otp, purpose);
        await sendOTPForEmailVerification(user.email, otp);
        return user;
    }

    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET,
        { expiresIn: "3m" }
    )

    const refreshToken = jwt.sign(
        {userId: user.id},
        process.env.REFRESH_SECRET,
        {expiresIn: "1h"}
    )

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await saveRefreshToken(user.id, hashedRefreshToken)

    return{
        token,
        refreshToken,
        userData:{
            id: user.id,
            username: user.username,
            email: user.email
        }
    }
}

export const refreshTokenService = async(refreshToken) => {
    if(!refreshToken){
        throw{
            statusCode: 400,
            message: "refresh token is missing"
        }
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const data = await fetchRefreshToken(decoded.userId);

    if (!data) {
        throw {
            statusCode: 401,
            message: "Refresh token not found"
        }
    }

    const isRefreshTokenMatched = await bcrypt.compare(refreshToken, data.hashed_refresh_token);

    if(!isRefreshTokenMatched){
        throw{
            statusCode: 400,
            message: "Invalid token"
        }
    }

    const newToken = jwt.sign(
        {userId: decoded.userId},
        process.env.JWT_SECRET,
        {expiresIn: "3m"}
    )

    const newRefreshToken = jwt.sign(
        {userId: decoded.userId},
        process.env.REFRESH_SECRET,
        {expiresIn: "1h"}
    )

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10)

    await updateRefreshToken(hashedNewRefreshToken, decoded.userId)

    return {
        newToken, newRefreshToken
    }
}   

export const forgotPasswordService = async(email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const purpose = "forgot-password";

    if(!normalizedEmail){
        throw{
            statusCode: 400,
            message: "email is required"
        }
    }

    const user = await findUser(normalizedEmail);

    if(!user){
        throw{
            statusCode: 401,
            message: "user not found"
        }
    }

    const otp = getOTP();
    await insertOTP(user.id, otp, purpose)
    await sendOTPForResetPassword(user.email, otp);
}