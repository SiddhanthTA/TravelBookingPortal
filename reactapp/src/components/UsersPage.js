import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UsersPage.css";

const API_URL = "https://8080-cfeefabccfdbebfdbafbbdbaebaacbbb.premiumproject.examly.io"; // adjust if needed

function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/Auth/show`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/admin/users/${id}`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="users-container">
            <h2>Manage Users</h2>
            <div className="users-grid">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <h3>{user.username}</h3>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UsersPage;
