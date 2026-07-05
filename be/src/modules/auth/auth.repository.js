import { db } from "../../config/db.js"

export const findUser = async (email) => {
    const res = await db.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",[email.trim()]
    )
    return res.rows[0]
}

export const findLatestOTP = async (userId) => {
    const res = await db.query(
        "SELECT * FROM otp WHERE user_id=$1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
        [userId]
    )
    return res.rows[0]
}

export const setUserVerified = async (userId) => {
    const res = await db.query(
        "UPDATE users SET is_verified = true WHERE id=$1 RETURNING id, username, email, is_verified, created_at",
        [userId]
    )
    return res.rows[0]
}

export const deleteOTPsByUserId = async (userId) => {
    await db.query("DELETE FROM otp WHERE user_id=$1", [userId])
}

export const insertOTP = async (userId, otp, purpose) => {
    await deleteOTPsByUserId(userId)
    const res = await db.query(
        "INSERT INTO otp(user_id, otp, purpose, expires_at) VALUES($1, $2, $3, NOW() + INTERVAL '3 minutes') RETURNING *",
        [userId, otp, purpose]
    )
    return res.rows[0]
}

export const registerUser = async (username, email, password) => {
    const res = await db.query(
        "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email, is_verified, created_at",
        [username, email, password]
    )
    return res.rows[0]
}

export const saveRefreshToken = async(userId, hashedRefreshToken) => {
    await db.query(
  `
    INSERT INTO refresh_tokens (user_id, hashed_refresh_token, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '1 hour')
    ON CONFLICT (user_id)
    DO UPDATE SET
        hashed_refresh_token = EXCLUDED.hashed_refresh_token,
        expires_at = EXCLUDED.expires_at,
        created_at = CURRENT_TIMESTAMP
    `,
    [userId, hashedRefreshToken]
    );
}

export const fetchRefreshToken = async(userId) => {
    const res = await db.query("SELECT * FROM refresh_tokens WHERE user_id = $1", [userId]);
    return res.rows[0];
}

export const updateRefreshToken = async(hashedNewRefreshToken, userId) => {
    await db.query("UPDATE refresh_tokens SET hashed_refresh_token = $1 WHERE user_id = $2",
        [hashedNewRefreshToken, userId]
    );
}

export const updateUserPassword = async(newPassword, userId) => {
    await db.query("UPDATE users SET password = $1 WHERE id = $2", 
        [newPassword, userId]
    );
}