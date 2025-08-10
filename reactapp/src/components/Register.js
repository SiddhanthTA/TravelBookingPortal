import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/ApiService';

const Register = () => {

    const navigate=useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'CUSTOMER',
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => { 
    e.preventDefault();
    setMessage(null);
    try {
        let response;
        if (form.role === 'ADMIN') {
            // Remove role field because backend sets it automatically
            const { role, ...adminData } = form;
            response = await ApiService.registerAdmin(adminData);
        } else {
            response = await ApiService.registerUser(form);
        }
        setMessage(response);
        if (response === 'User Registered') {
            setForm({
                name: '',
                email: '',
                password: '',
                phoneNumber: '',
                role: 'CUSTOMER',
            });
            navigate('/login');
        }
    } catch (err) {
        setMessage('Registration failed: ' + (err.response?.data || err.message));
    }
};


return (
    <div>
        <h2>Register</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label><br />
                <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div>
                <label>Email:</label><br />
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
                <label>Password:</label><br />
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            <div>
                <label>Phone Number:</label><br />
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </div>

            <div>
                <label>Role:</label><br />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>

            <button type="submit">Register</button>
        </form>
    </div>
);
};

export default Register;
