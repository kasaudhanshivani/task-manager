import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/signup", form);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
            <h2>Signup</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" style={{ width: "100%", padding: "10px" }}>
                    Signup
                </button>
            </form>
            <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
    );
};

export default Signup;