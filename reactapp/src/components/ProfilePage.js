import React, { useEffect, useMemo, useState } from "react";
import { getUserById, updateUser, changePassword } from "../utils/ApiService";
import "./ProfilePage.css";

const emptyProfile = {
    name: "", email: "", phoneNumber: "", profileImageUrl: "",
    dateOfBirth: "", gender: "", hometown: "",
    addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "",
    preferredTravelClass: "", preferredSeat: "", preferredHotelCategory: "",
    dietaryPreference: "", preferredCurrency: "INR"
};

const sections = [
    { title: "Personal details", fields: [
        ["name", "Full name", "text"], ["email", "Email address", "email"],
        ["phoneNumber", "Phone number", "tel"], ["dateOfBirth", "Date of birth", "date"],
        ["gender", "Gender", "select", ["", "Female", "Male", "Non-binary", "Prefer not to say"]],
        ["hometown", "Hometown", "text"], ["profileImageUrl", "Profile picture URL", "url"]
    ]},
    { title: "Address", fields: [
        ["addressLine1", "Address line 1", "text"], ["addressLine2", "Address line 2", "text"],
        ["city", "City", "text"], ["state", "State / Province", "text"],
        ["country", "Country", "text"], ["postalCode", "Postal code", "text"]
    ]},
    { title: "Travel preferences", fields: [
        ["preferredTravelClass", "Preferred flight class", "select", ["", "Economy", "Premium Economy", "Business", "First"]],
        ["preferredSeat", "Seat preference", "select", ["", "Window", "Aisle", "Middle", "No preference"]],
        ["preferredHotelCategory", "Preferred hotel category", "select", ["", "Budget", "3 Star", "4 Star", "5 Star", "No preference"]],
        ["dietaryPreference", "Dietary preference", "select", ["", "No preference", "Vegetarian", "Non-vegetarian", "Vegan", "Jain"]],
        ["preferredCurrency", "Display currency", "select", ["INR", "USD", "EUR", "GBP"]]
    ]}
];

const ProfilePage = () => {
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(emptyProfile);
    const [editMode, setEditMode] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!userId) {
            setMessage("Please sign in again to view your profile.");
            return;
        }
        getUserById(userId)
            .then((data) => {
                setUser(data);
                setFormData(Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, data[key] ?? (key === "preferredCurrency" ? "INR" : "")])));
            })
            .catch(() => {
                setMessage("We couldn't load your profile. Please try again.");
                setMessageType("error");
            });
    }, [userId]);

    const initials = useMemo(() => (user?.name || "Traveler").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(), [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            const updated = await updateUser(userId, formData);
            setUser((previous) => ({ ...previous, ...updated, ...formData }));
            setEditMode(false);
            setMessage("Your profile has been updated.");
            setMessageType("success");
        } catch (error) {
            setMessage(error.response?.data || "We couldn't save your profile. Check the details and try again.");
            setMessageType("error");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        try {
            await changePassword(userId, passwords.oldPassword, passwords.newPassword);
            setMessage("Password changed successfully.");
            setMessageType("success");
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (error) {
            setMessage(error.response?.data || "Unable to change password. Check your current password and try again.");
            setMessageType("error");
        }
    };

    if (!user) return <main className="profile-page"><p className="profile-loading">Loading your profile…</p>{message && <p className="profile-message error">{message}</p>}</main>;

    const renderField = ([key, label, type, options]) => (
        <div className="profile-field" key={key}>
            <label htmlFor={key}>{label}</label>
            {editMode ? (
                type === "select" ? (
                    <select id={key} name={key} value={formData[key] ?? ""} onChange={handleChange}>
                        {options.map((option) => <option key={option} value={option}>{option || "Choose an option"}</option>)}
                    </select>
                ) : (
                    <input id={key} name={key} type={type} value={formData[key] ?? ""} onChange={handleChange} />
                )
            ) : (
                <p>{formData[key] || <span className="profile-empty">Not added yet</span>}</p>
            )}
        </div>
    );

    return (
        <main className="profile-page">
            <section className="profile-hero">
                <div className="profile-avatar">
                    {user.profileImageUrl ? <img src={user.profileImageUrl} alt="Profile" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : initials}
                </div>
                <div className="profile-hero-copy">
                    <span className="profile-eyebrow">YOUR ACCOUNT</span>
                    <h1>{user.name || "Your profile"}</h1>
                    <p>{user.email} <span className="profile-role">{user.role}</span></p>
                </div>
                {!editMode && <button className="profile-primary-button" onClick={() => setEditMode(true)}>Edit profile</button>}
            </section>

            {message && <div className={`profile-message ${messageType}`} role="status">{message}</div>}

            <form onSubmit={handleSave}>
                {sections.map((section) => (
                    <section className="profile-section" key={section.title}>
                        <div className="profile-section-heading">
                            <div><span className="profile-eyebrow">PROFILE</span><h2>{section.title}</h2></div>
                        </div>
                        <div className="profile-fields">{section.fields.map(renderField)}</div>
                    </section>
                ))}
                {editMode && (
                    <div className="profile-form-actions">
                        <button type="button" className="profile-secondary-button" onClick={() => {
                            setFormData(Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, user[key] ?? (key === "preferredCurrency" ? "INR" : "")])));
                            setEditMode(false);
                        }}>Discard changes</button>
                        <button type="submit" className="profile-primary-button" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
                    </div>
                )}
            </form>

            <section className="profile-section password-section">
                <div className="profile-section-heading"><div><span className="profile-eyebrow">ACCOUNT SECURITY</span><h2>Change password</h2></div></div>
                <form className="password-form" onSubmit={handlePasswordChange}>
                    <div className="profile-field"><label htmlFor="oldPassword">Current password</label><input id="oldPassword" type="password" autoComplete="current-password" value={passwords.oldPassword} onChange={(e) => setPasswords((p) => ({ ...p, oldPassword: e.target.value }))} required /></div>
                    <div className="profile-field"><label htmlFor="newPassword">New password</label><input id="newPassword" type="password" autoComplete="new-password" minLength="8" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} required /></div>
                    <button type="submit" className="profile-secondary-button">Update password</button>
                </form>
            </section>
        </main>
    );
};

export default ProfilePage;
