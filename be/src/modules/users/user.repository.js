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
