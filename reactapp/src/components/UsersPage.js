import React, { useEffect, useState } from "react";
import { deleteUser, getAllUsers } from "../utils/ApiService";
import "./UsersPage.css";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try { setUsers(await getAllUsers()); }
        catch (err) { setError("Unable to load users. Check the backend connection."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user account? This action cannot be undone.")) return;
        try {
            await deleteUser(id);
            setUsers((previous) => previous.filter((user) => user.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete this user.");
        }
    };

    return (
        <main className="users-container">
            <div className="users-page-heading"><div><span className="travel-eyebrow">ADMINISTRATION</span><h1>Manage users</h1><p>{users.length} registered account(s)</p></div><button onClick={fetchUsers} disabled={loading}>Refresh</button></div>
            {error && <p className="users-error">{error}</p>}
            {loading ? <p>Loading users…</p> : users.length === 0 ? <p>No user accounts found.</p> : (
                <div className="users-grid">
                    {users.map((user) => (
                        <article key={user.id} className="user-card">
                            <div className="user-avatar">{(user.name || "U").trim().charAt(0).toUpperCase()}</div>
                            <div><h3>{user.name || "Unnamed user"}</h3><p>{user.email}</p><p>{user.phoneNumber || "No phone number"}</p><span className="user-role">{user.role}</span></div>
                            <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete account</button>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default UsersPage;
