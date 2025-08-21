import React, { useEffect, useState } from "react";
import { getUserById, updateUser, changePassword } from "../utils/ApiService";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [message, setMessage] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            getUserById(userId)
                .then((data) => {
                    setUser(data);
                    setFormData({ name: data.name, email: data.email, role: data.role });
                })
                .catch(() => setMessage("Error fetching user data"));
        }
    }, [userId]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        try {
            await updateUser(userId, formData);
            setUser((prev) => ({ ...prev, ...formData }));
            setEditMode(false);
            setMessage("Profile updated successfully ✅");
        } catch {
            setMessage("Error updating profile ❌");
        }
    };

    const handlePasswordChange = async () => {
        try {
            await changePassword(userId, passwords.oldPassword, passwords.newPassword);
            setMessage("Password changed successfully 🔑");
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch {
            setMessage("Error changing password ❌");
        }
    };

    if (!user) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>

            {message && <div className="message">{message}</div>}

            <div className="profile-card">
                <label>Name:</label>
                {editMode ? (
                    <input name="name" value={formData.name} onChange={handleChange} />
                ) : (
                    <p>{user.name}</p>
                )}

                <label>Email:</label>
                {editMode ? (
                    <input name="email" value={formData.email} onChange={handleChange} />
                ) : (
                    <p>{user.email}</p>
                )}

                <label>Role:</label>
                <p>{user.role}</p>

                {editMode ? (
                    <button onClick={handleUpdate} className="btn save-btn">Save</button>
                ) : (
                    <button onClick={() => setEditMode(true)} className="btn edit-btn">Edit</button>
                )}
            </div>

            <div className="password-card">
                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={passwords.oldPassword}
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button onClick={handlePasswordChange} className="btn change-btn">Change Password</button>
            </div>
        </div>
    );
};

export default ProfilePage;
