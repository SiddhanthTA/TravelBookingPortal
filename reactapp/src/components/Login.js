import React, { useState } from 'react';
import ApiService from '../utils/ApiService';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css';  

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await ApiService.loginUser(form.email, form.password);
            if (data.status === 'success') {
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userEmail', form.email);
                localStorage.setItem('userId', data.userId || data.id);
                navigate('/'); // redirect to home/dashboard
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed: ' + (err.response?.data || err.message));
        }
    };

    return (
        <>
            {/* Title top-left */}
            <div className="app-title">Travel Booking Application</div>

            {/* Moving clouds in background */}
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

            {/* Login box */}
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="username"
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
                        autoComplete="current-password"
                        placeholder="Enter your password"
                    />

                    <button type="submit" className="btn-login">Login</button>
                </form>
                <p className="register-text">
                    Don't have an account? <Link to="/register">Click here to Register</Link>
                </p>
            </div>
        </>
    );
};

export default Login;
