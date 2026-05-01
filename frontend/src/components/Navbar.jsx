import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 24px",
            backgroundColor: "#1a1a2e",
            color: "white"
        }}>
            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
                    Dashboard
                </Link>
                <Link to="/projects" style={{ color: "white", textDecoration: "none" }}>
                    Projects
                </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "14px" }}>
                    👤 {user?.name} ({user?.role})
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "6px 14px",
                        backgroundColor: "#e94560",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;