import React, { useEffect, useMemo, useState } from "react";
import { getUserById, updateUser, changePassword, uploadProfileImage } from "../utils/ApiService";
import { BASE_URL } from "../utils/constants";
import "./ProfilePage.css";
import { stateCities, states } from "../utils/indianLocations";

const emptyProfile = {
    name: "", email: "", phoneNumber: "", dateOfBirth: "", gender: "",
    addressLine1: "", addressLine2: "", state: "", city: "", postalCode: "",
    preferredTravelClass: "", preferredSeat: "", dietaryPreference: ""
};


const states = Object.keys(stateCities);
const today = new Date();
const maxDob = today.toISOString().slice(0, 10);
const minDobDate = new Date(today);
minDobDate.setFullYear(today.getFullYear() - 100);
const minDob = minDobDate.toISOString().slice(0, 10);

const validate = (data) => {
    const errors = {};
    const name = data.name.trim();
    if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L} .'-]*$/u.test(name)) errors.name = "Enter a valid name (2–80 letters; spaces, apostrophes and hyphens are allowed).";
    const email = data.email.trim().toLowerCase();
    if (email.length < 6 || email.length > 254 || !/^[A-Z0-9._%+-]+@(gmail|yahoo)\.com$/i.test(email)) errors.email = "Use a valid Gmail or Yahoo address (for example, name@gmail.com).";
    if (!/^[6-9]\d{9}$/.test(data.phoneNumber)) errors.phoneNumber = "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
    if (data.dateOfBirth && (data.dateOfBirth < minDob || data.dateOfBirth > maxDob)) errors.dateOfBirth = "Date of birth must be within the last 100 years and cannot be in the future.";
    if (data.state && !states.includes(data.state)) errors.state = "Choose a state or union territory from the suggestions.";
    if (data.city && (!data.state || !(stateCities[data.state] || []).includes(data.city))) errors.city = "Choose a city listed for the selected state.";
    if (data.postalCode && !/^\d{6}$/.test(data.postalCode)) errors.postalCode = "Postal code must contain exactly 6 digits.";
    if (data.addressLine1.length > 255 || data.addressLine2.length > 255) errors.addressLine1 = "Each address line must be 255 characters or fewer.";
    return errors;
};

const imageUrl = (path) => !path ? "" : path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

const ProfilePage = () => {
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(emptyProfile);
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorPopup, setErrorPopup] = useState([]);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [saving, setSaving] = useState(false);

    const applyUser = (data) => {
        setUser(data);
        setFormData(Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, data[key] ?? ""])));
    };

    useEffect(() => {
        if (!userId) { setMessage("Please sign in again to view your profile."); return; }
        getUserById(userId).then(applyUser).catch(() => { setMessage("We couldn't load your profile. Please try again."); setMessageType("error"); });
    }, [userId]);

    useEffect(() => () => { if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

    const initials = useMemo(() => (user?.name || "Traveler").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(), [user]);
    const handleChange = (event) => {
        const { name, value } = event.target;
        const normalizedValue = name === "phoneNumber" ? value.replace(/\D/g, "").slice(0, 10)
            : name === "postalCode" ? value.replace(/\D/g, "").slice(0, 6) : value;
        setFormData((previous) => ({ ...previous, [name]: normalizedValue, ...(name === "state" ? { city: "" } : {}) }));
        setFieldErrors((previous) => ({ ...previous, [name]: "", ...(name === "state" ? { city: "" } : {}) }));
    };
    const handleImage = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setErrorPopup(["Profile picture must be JPG, PNG or WEBP."]); event.target.value = ""; return; }
        if (file.size > 5 * 1024 * 1024) { setErrorPopup(["Profile picture must be 5 MB or smaller."]); event.target.value = ""; return; }
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        const errors = validate(formData);
        setFieldErrors(errors);
        if (Object.keys(errors).length) { setErrorPopup(Object.values(errors)); return; }
        setSaving(true); setMessage(""); setErrorPopup([]);
        try {
            let profileImageUrl = user.profileImageUrl || "";
            if (selectedImage) profileImageUrl = await uploadProfileImage(userId, selectedImage);
            const payload = { ...formData, email: formData.email.trim().toLowerCase(), name: formData.name.trim(), dateOfBirth: formData.dateOfBirth || null, profileImageUrl };
            const updated = await updateUser(userId, payload);
            applyUser({ ...user, ...updated, ...payload });
            setSelectedImage(null); setImagePreview(""); setEditMode(false);
            setMessage("Your profile has been updated."); setMessageType("success");
            window.dispatchEvent(new Event("profile-updated"));
        } catch (error) {
            const text = typeof error.response?.data === "string" ? error.response.data : "We couldn't save your profile. Check the details and try again.";
            setMessage(text); setMessageType("error"); setErrorPopup([text]);
        } finally { setSaving(false); }
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        try {
            await changePassword(userId, passwords.oldPassword, passwords.newPassword);
            setMessage("Password changed successfully."); setMessageType("success");
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (error) { setMessage(error.response?.data || "Unable to change password. Check your current password and try again."); setMessageType("error"); }
    };

    if (!user) return <main className="profile-page"><p className="profile-loading">Loading your profile…</p>{message && <p className="profile-message error">{message}</p>}</main>;

    const field = (key, label, type = "text", options = null) => (
        <div className="profile-field" key={key}>
            <label htmlFor={key}>{label}</label>
            {editMode ? (options ? <select id={key} name={key} value={formData[key] ?? ""} onChange={handleChange}><option value="">Choose an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                : <input id={key} name={key} type={type} value={formData[key] ?? ""} onChange={handleChange} min={key === "dateOfBirth" ? minDob : undefined} max={key === "dateOfBirth" ? maxDob : undefined} inputMode={["phoneNumber", "postalCode"].includes(key) ? "numeric" : undefined} className={fieldErrors[key] ? "invalid" : ""} />)
                : <p>{formData[key] || <span className="profile-empty">Not added yet</span>}</p>}
            {editMode && fieldErrors[key] && <small className="field-error">{fieldErrors[key]}</small>}
        </div>
    );

    const selectField = (key, label, options) => field(key, label, "text", options);

    return (
        <main className="profile-page">
            <section className="profile-hero">
                <div className="profile-avatar">{(imagePreview || imageUrl(user.profileImageUrl)) ? <img src={imagePreview || imageUrl(user.profileImageUrl)} alt="Profile" /> : initials}</div>
                <div className="profile-hero-copy"><span className="profile-eyebrow">YOUR ACCOUNT</span><h1>{user.name || "Your profile"}</h1><p>{user.email} <span className="profile-role">{user.role}</span></p></div>
                {!editMode && <button className="profile-primary-button" onClick={() => setEditMode(true)}>Edit profile</button>}
            </section>
            {message && <div className={`profile-message ${messageType}`} role="status">{message}</div>}
            <form onSubmit={handleSave}>
                <section className="profile-section">
                    <div className="profile-section-heading"><div><span className="profile-eyebrow">PROFILE</span><h2>Personal details</h2></div></div>
                    <div className="profile-fields">
                        {field("name", "Full name")}{field("email", "Email address", "email")}{field("phoneNumber", "Indian mobile number", "tel")}{field("dateOfBirth", "Date of birth", "date")}
                        {field("gender", "Gender", "text", ["Female", "Male", "Non-binary", "Prefer not to say"])}
                        <div className="profile-field"><label htmlFor="profileImage">Profile picture (JPG, PNG or WEBP; max 5 MB)</label>{editMode ? <input id="profileImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} /> : <p>{user.profileImageUrl ? "Uploaded" : <span className="profile-empty">Not added yet</span>}</p>}</div>
                    </div>
                </section>
                <section className="profile-section">
                    <div className="profile-section-heading"><div><span className="profile-eyebrow">LOCATION</span><h2>Address</h2></div></div>
                    <div className="profile-fields">
                        {field("addressLine1", "Address line 1")}{field("addressLine2", "Address line 2")}
                        <div className="profile-field"><label htmlFor="state">State / Union territory</label>{editMode ? <><input id="state" name="state" list="indian-states" value={formData.state} onChange={handleChange} className={fieldErrors.state ? "invalid" : ""} placeholder="Type or select a state" /><datalist id="indian-states">{states.map((state) => <option key={state} value={state} />)}</datalist>{fieldErrors.state && <small className="field-error">{fieldErrors.state}</small>}</> : <p>{formData.state || <span className="profile-empty">Not added yet</span>}</p>}</div>
                        <div className="profile-field"><label htmlFor="city">City</label>{editMode ? <><input id="city" name="city" list="state-cities" value={formData.city} onChange={handleChange} disabled={!stateCities[formData.state]} className={fieldErrors.city ? "invalid" : ""} placeholder={formData.state ? "Type or select a city" : "Select a state first"} /><datalist id="state-cities">{(stateCities[formData.state] || []).map((city) => <option key={city} value={city} />)}</datalist>{fieldErrors.city && <small className="field-error">{fieldErrors.city}</small>}</> : <p>{formData.city || <span className="profile-empty">Not added yet</span>}</p>}</div>
                        {field("postalCode", "Postal code")}
                    </div>
                </section>
                <section className="profile-section">
                    <div className="profile-section-heading"><div><span className="profile-eyebrow">PREFERENCES</span><h2>Flight preferences</h2></div></div>
                    <div className="profile-fields">
                        {selectField("preferredTravelClass", "Preferred flight class", ["Economy", "Premium Economy", "Business", "First"])}
                        {selectField("preferredSeat", "Preferred seat type", ["Window", "Aisle", "Middle", "No preference"])}
                        {selectField("dietaryPreference", "Dietary preference", ["No preference", "Vegetarian", "Non-vegetarian", "Vegan", "Jain"])}
                    </div>
                </section>
                {editMode && <div className="profile-form-actions"><button type="button" className="profile-secondary-button" onClick={() => { applyUser(user); setSelectedImage(null); setImagePreview(""); setFieldErrors({}); setEditMode(false); }}>Discard changes</button><button type="submit" className="profile-primary-button" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></div>}
            </form>
            <section className="profile-section password-section"><div className="profile-section-heading"><div><span className="profile-eyebrow">ACCOUNT SECURITY</span><h2>Change password</h2></div></div>
                <form className="password-form" onSubmit={handlePasswordChange}>
                    <div className="profile-field"><label htmlFor="oldPassword">Current password</label><input id="oldPassword" type="password" autoComplete="current-password" value={passwords.oldPassword} onChange={(e) => setPasswords((p) => ({ ...p, oldPassword: e.target.value }))} required /></div>
                    <div className="profile-field"><label htmlFor="newPassword">New password</label><input id="newPassword" type="password" autoComplete="new-password" minLength="8" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} required /></div>
                    <button type="submit" className="profile-secondary-button">Update password</button>
                </form>
            </section>
            {errorPopup.length > 0 && <div className="profile-modal-backdrop" role="presentation"><div className="profile-error-modal" role="alertdialog" aria-modal="true" aria-labelledby="profile-error-title"><h2 id="profile-error-title">Please correct these details</h2><ul>{errorPopup.map((error, index) => <li key={index}>{error}</li>)}</ul><button className="profile-primary-button" onClick={() => setErrorPopup([])}>Review fields</button></div></div>}
        </main>
    );
};

export default ProfilePage;
