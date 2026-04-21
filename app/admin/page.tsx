"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./admin.module.css";
import AssessmentForm from "../components/AssessmentForm";

const API = "https://assessment-tool-1-2e4i.onrender.com";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [showUserModal, setShowUserModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const [filterRole, setFilterRole] = useState("All");

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Student",
  });

  const [editUser, setEditUser] = useState<any>(null);
  const [editAssessment, setEditAssessment] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [u, a, r] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/assessments`),
        axios.get(`${API}/results`),
      ]);

      setUsers(u.data);
      setAssessments(a.data);
      setResults(r.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete user?")) return;
    try {
      await axios.delete(`${API}/users/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const deleteAssessment = async (id: string) => {
    if (!confirm("Delete assessment?")) return;
    try {
      await axios.delete(`${API}/assessments/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete assessment");
    }
  };

  const filteredUsers =
    filterRole === "All" ? users : users.filter((u) => u.role === filterRole);

  const getUserDetails = (userId: string | undefined) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.fullName} (${user.role})` : "Unknown";
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <h2>Admin Panel</h2>

        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("assessments")}>
          Assessments
        </button>
        <button onClick={() => setActiveTab("reports")}>Reports</button>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className={styles.main}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h1>Dashboard Overview</h1>

            <div className={styles.cardContainer}>
              <div className={styles.card}>
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>

              <div className={styles.card}>
                <h3>Students</h3>
                <p>{users.filter((u) => u.role === "Student").length}</p>
              </div>

              <div className={styles.card}>
                <h3>Educators</h3>
                <p>{users.filter((u) => u.role === "Educator").length}</p>
              </div>

              <div className={styles.card}>
                <h3>Assessments</h3>
                <p>{assessments.length}</p>
              </div>
            </div>

            <div className={styles.box}>
              <h2>Recent Assessments</h2>
              <ul>
                {assessments.slice(0, 5).map((a) => (
                  <li key={a.id}>{a.title}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h1>User Management</h1>

            <div className={styles.topBar}>
              <button
                className={styles.button}
                onClick={() => {
                  setEditUser(null);
                  setNewUser({
                    fullName: "",
                    email: "",
                    password: "",
                    role: "Student",
                  });
                  setShowUserModal(true);
                }}
              >
                + Add User
              </button>

              <select onChange={(e) => setFilterRole(e.target.value)}>
                <option>All</option>
                <option>Student</option>
                <option>Educator</option>
                <option>Admin</option>
              </select>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditUser(u);
                          setShowUserModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ASSESSMENTS */}
        {activeTab === "assessments" && (
          <>
            <h1>Assessments</h1>

            <button
              className={styles.button}
              onClick={() => setShowAssessmentModal(true)}
            >
              + Create Assessment
            </button>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Time</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>{a.timeLimit} mins</td>
                    <td>{getUserDetails(a.educatorId || "")}</td>

                    <td className={styles.actionCell}>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditAssessment(a);
                          setShowAssessmentModal(true); // ✅ FIX
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteAssessment(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <>
            <h1>Reports & Analytics</h1>

            <div className={styles.cardContainer}>
              <div className={styles.card}>
                <h3>Total Attempts</h3>
                <p>{results.length}</p>
              </div>

              <div className={styles.card}>
                <h3>Average Score</h3>
                <p>
                  {results.length > 0
                    ? (
                        results.reduce((sum, r) => sum + r.score, 0) /
                        results.length
                      ).toFixed(2)
                    : 0}
                </p>
              </div>
            </div>

            <h2>Student Performance</h2>
            <table className={styles.table}>
              <tbody>
                {results.map((r) => {
                  const user = users.find(
                    (u) =>
                      String(u.id) ===
                      String(r.studentId || r.userId) // ✅ FIX
                  );

                  const assessment = assessments.find(
                    (a) => a.id === r.assessmentId
                  );

                  return (
                    <tr key={r.id}>
                      <td>{user?.fullName || "Unknown"}</td>
                      <td>{assessment?.title || "Unknown"}</td>
                      <td>{r.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* USER MODAL & ASSESSMENT MODAL unchanged */}
      {showAssessmentModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <button
        className={styles.closeBtn}
        onClick={() => {
          setShowAssessmentModal(false);
          setEditAssessment(null);
        }}
      >
        ✖
      </button>

      <AssessmentForm
        initialData={editAssessment}
        onSubmit={async (data: any) => {
          try {
            if (editAssessment) {
              await axios.put(
                `${API}/assessments/${editAssessment.id}`,
                data
              );
            } else {
              await axios.post(`${API}/assessments`, data);
            }

            setShowAssessmentModal(false);
            setEditAssessment(null);
            fetchData();
          } catch (err) {
            console.error(err);
            alert("Failed to save assessment");
          }
        }}
      />
    </div>
  </div>
)}
    </div>
  );
}