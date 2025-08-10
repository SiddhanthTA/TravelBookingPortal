import React, { useState } from 'react';
import ApiService from '../utils/ApiService';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
            console.log('Login Response:',data);
            if (data.status === 'success') {
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userEmail', form.email);
                localStorage.setItem('userId',data.userId||data.id);
                navigate('/'); // redirect to home/dashboard
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br />
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>

                <div>
                    <label>Password:</label><br />
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>

                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Click here to Register</Link>
            </p>
        </div>
    );
};

export default Login;
