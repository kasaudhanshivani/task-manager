import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await API.get("/projects");
            setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post("/projects", { name, description });
            setName("");
            setDescription("");
            setShowForm(false);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Projects</h2>
                    {user?.role === "admin" && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#1a1a2e",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            {showForm ? "Cancel" : "+ New Project"}
                        </button>
                    )}
                </div>

                {/* Create Project Form - Admin Only */}
                {showForm && (
                    <form
                        onSubmit={handleCreate}
                        style={{
                            margin: "16px 0",
                            padding: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#2ecc71",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Create Project
                        </button>
                    </form>
                )}

                {/* Projects List */}
                {projects.length === 0 ? (
                    <p>No projects found.</p>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/projects/${project._id}`)}
                            style={{
                                padding: "16px",
                                marginBottom: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <h4 style={{ margin: 0 }}>{project.name}</h4>
                                <p style={{ margin: "4px 0 0", color: "#666", fontSize: "14px" }}>
                                    {project.description}
                                </p>
                            </div>
                            <span style={{ fontSize: "12px", color: "#999" }}>
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Projects;