import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/ApiService';
import './Register.css'; 

const Register = () => {
    const navigate = useNavigate();

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
            // let response;
            // if (form.role === 'ADMIN') {
           
            //     const { role, ...adminData } = form;
            //     response = await ApiService.registerAdmin(adminData);
            // } else {
                const response = await ApiService.registerUser(form);
            
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
        <>
      
            <div className="app-title">Travel Booking Application</div>

        
            <div className="clouds-container" aria-hidden="true">
                <div className="cloud" style={{ "--size": 140, "--top": 10, "--delay": 0, "--duration": 60 }}></div>
                <div className="cloud" style={{ "--size": 120, "--top": 35, "--delay": 12, "--duration": 55 }}></div>
                <div className="cloud" style={{ "--size": 100, "--top": 20, "--delay": 25, "--duration": 65 }}></div>
                <div className="cloud" style={{ "--size": 130, "--top": 55, "--delay": 5, "--duration": 70 }}></div>
                <div className="cloud" style={{ "--size": 110, "--top": 40, "--delay": 18, "--duration": 50 }}></div>
                <div className="cloud" style={{ "--size": 150, "--top": 15, "--delay": 30, "--duration": 75 }}></div>
                <div className="cloud" style={{ "--size": 90, "--top": 60, "--delay": 8, "--duration": 60 }}></div>
                <div className="cloud" style={{ "--size": 125, "--top": 30, "--delay": 20, "--duration": 55 }}></div>
            </div>

        
            <div className="register-container">
                <h2>Register</h2>
                {message && <p className="message">{message}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />

                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Optional" />

                    {/* <label htmlFor="Role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                    </select> */}

                    <button type="submit" className="btn-register">Register</button>
                </form>
            </div>
        </>
    );
};

export default Register;