import { db } from "../../config/db.js";

export const userProfile = async (userId) => {
    const res = await db.query(
        "SELECT id, username, email, user_image FROM users WHERE id=$1",
        [userId]
    );
    return res.rows[0];
};

export const findUserById = async (userId) => {
    const res = await db.query(
        "SELECT id, username, email, user_image, cloudinary_public_id FROM users WHERE id=$1",
        [userId]
    );
    return res.rows[0];
};

export const updateProfileImage = async (userId, userImage, cloudinaryPublicId) => {
    const res = await db.query(
        `UPDATE users SET
            user_image=$1,
            cloudinary_public_id=$2
        WHERE id=$3
        RETURNING id, username, email, user_image`,
        [userImage, cloudinaryPublicId, userId]
    );
    return res.rows[0];
};

export const clearProfileImage = async (userId) => {
    const res = await db.query(
        `UPDATE users SET
            user_image=NULL,
            cloudinary_public_id=NULL
        WHERE id=$1
        RETURNING id, username, email, user_image`,
        [userId]
    );
    return res.rows[0];
};

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

export const updateProfile = async(userId, email, username, password) => {
    const res = await db.query(`
        UPDATE users SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        password = COALESCE($3, password)
        WHERE id = $4
        RETURNING id, username, email, user_image`,
        [username, email, password, userId]
    );
    return res.rows[0];
}

export const findOTP = async (userId) => {
    const res = await db.query("SELECT * FROM otp WHERE user_id=$1 order by created_at desc limit 1", [userId])
    return res.rows[0]
}