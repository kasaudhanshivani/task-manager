import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "todo",
    });

    useEffect(() => {
        fetchProject();
        fetchTasks();
        fetchMembers();
    }, []);

    const fetchProject = async () => {
        try {
            const { data } = await API.get(`/projects/${id}`);
            setProject(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTasks = async () => {
        try {
            const { data } = await API.get(`/tasks/project/${id}`);
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMembers = async () => {
        try {
            const { data } = await API.get("/users");
            setMembers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await API.post("/tasks", { ...form, project: id });
            setForm({
                title: "",
                description: "",
                assignedTo: "",
                dueDate: "",
                status: "todo",
            });
            setShowForm(false);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await API.put(`/tasks/${taskId}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await API.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: "24px" }}>

                {/* Project Header */}
                <h2>{project?.name}</h2>
                <p style={{ color: "#666" }}>{project?.description}</p>

                {/* Add Task Button - Admin Only */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>Tasks</h3>
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
                            {showForm ? "Cancel" : "+ Add Task"}
                        </button>
                    )}
                </div>

                {/* Create Task Form - Admin Only */}
                {showForm && (
                    <form
                        onSubmit={handleCreateTask}
                        style={{
                            margin: "16px 0",
                            padding: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                        }}
                    >
                        <input
                            type="text"
                            name="title"
                            placeholder="Task Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        />
                        <textarea
                            name="description"
                            placeholder="Task Description"
                            value={form.description}
                            onChange={handleChange}
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        />
                        <select
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            required
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        >
                            <option value="">Assign to...</option>
                            {members.map((m) => (
                                <option key={m._id} value={m._id}>
                                    {m.name} ({m.role})
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            required
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        />
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
                        >
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
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
                            Create Task
                        </button>
                    </form>
                )}

                {/* Tasks List */}
                {tasks.length === 0 ? (
                    <p>No tasks yet.</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            style={{
                                padding: "14px",
                                marginBottom: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <h4 style={{ margin: 0 }}>{task.title}</h4>
                                <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>
                                    {task.description}
                                </p>
                                <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                                    Assigned to: {task.assignedTo?.name} | Due:{" "}
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                {/* Status Dropdown */}
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                    style={{ padding: "4px 8px", borderRadius: "4px" }}
                                >
                                    <option value="todo">Todo</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>

                                {/* Delete - Admin Only */}
                                {user?.role === "admin" && (
                                    <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        style={{
                                            padding: "4px 10px",
                                            backgroundColor: "#e94560",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;