import { forgotPasswordService, loginUserService, refreshTokenService, registerUserService, resendOtpService, resetPasswordService, verifyUserService } from "./auth.service.js";

export const registerUserController = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await registerUserService(username, email, password);
        res.status(201).json({
            message: "user created successfully",
            data: result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const verifyUserController = async(req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await verifyUserService(email, otp);
        res.status(200).json({
            message: "user verified successfully",
            data: result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const resendOtpController = async(req, res) => {
    try {
        const { email } = req.body;
        const result = await resendOtpService(email);
        res.status(200).json({
            message: result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const loginUserController = async(req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUserService(email, password);
        res.status(200).json({
            message: "user logged in successfully",
            result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const refreshTokenController = async(req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshTokenService(refreshToken)
        res.status(200).json({
            result
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const forgotPasswordController = async(req, res) =>{
    try {
        const { email } = req.body;
        const result = await forgotPasswordService(email)
        res.status(200).json({
            message: "email has been sent please check your inbox",
            userId: result
        })  
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}

export const resetPasswordController = async(req, res) => {
    try {
        const { otp, userId, password } = req.body;
        await resetPasswordService(otp, userId, password);
        res.status(200).json({
            message: "password updated successfully"
        })  
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        })
    }
}