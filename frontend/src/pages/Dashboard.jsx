import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await API.get("/tasks/my");
                setTasks(data);

                const now = new Date();
                const total = data.length;
                const completed = data.filter((t) => t.status === "completed").length;
                const inProgress = data.filter((t) => t.status === "in-progress").length;
                const overdue = data.filter(
                    (t) => t.status !== "completed" && new Date(t.dueDate) < now
                ).length;

                setStats({ total, completed, inProgress, overdue });
            } catch (err) {
                console.error(err);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ padding: "24px" }}>
                <h2>Dashboard</h2>

                {/* Stats Cards */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                    {[
                        { label: "Total Tasks", value: stats.total, color: "#1a1a2e" },
                        { label: "Completed", value: stats.completed, color: "#2ecc71" },
                        { label: "In Progress", value: stats.inProgress, color: "#f39c12" },
                        { label: "Overdue", value: stats.overdue, color: "#e94560" },
                    ].map((card) => (
                        <div
                            key={card.label}
                            style={{
                                flex: 1,
                                padding: "20px",
                                backgroundColor: card.color,
                                color: "white",
                                borderRadius: "8px",
                                textAlign: "center",
                            }}
                        >
                            <h3>{card.value}</h3>
                            <p>{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Task List */}
                <h3>My Tasks</h3>
                {tasks.length === 0 ? (
                    <p>No tasks assigned to you yet.</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            onClick={() => navigate(`/projects/${task.project}`)}
                            style={{
                                padding: "14px",
                                marginBottom: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>{task.title}</span>
                            <span
                                style={{
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    backgroundColor:
                                        task.status === "completed"
                                            ? "#2ecc71"
                                            : task.status === "in-progress"
                                                ? "#f39c12"
                                                : "#e94560",
                                    color: "white",
                                }}
                            >
                                {task.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;