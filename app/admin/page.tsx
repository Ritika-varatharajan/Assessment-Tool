"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

interface Stats {
  users: number;
  assessments: number;
  students: number;
  reports: number;
}

const AdminDashboard = () => {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    users: 0,
    assessments: 0,
    students: 0,
    reports: 0,
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    // 🔐 Protect admin route
    if (!storedUser || storedUser.role !== "Administrator") {
      router.push("/login");
      return;
    }

    setUser(storedUser);

    // 📊 Dynamic stats (demo purpose)
    setStats({
      users: 1,
      assessments: Math.floor(Math.random() * 10) + 1,
      students: Math.floor(Math.random() * 20) + 1,
      reports: Math.floor(Math.random() * 5) + 1,
    });
  }, [router]);

  // 🚪 Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Admin Panel</h2>
        <ul>
          <li onClick={() => router.push("/admin")}>Dashboard</li>
          <li>Manage Users</li>
          <li>Assessments</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <h1>
            Welcome, {user?.email || "Admin"}
          </h1>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </header>

        {/* Cards */}
        <section className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>

          <div className={styles.card}>
            <h3>Assessments</h3>
            <p>{stats.assessments}</p>
          </div>

          <div className={styles.card}>
            <h3>Active Students</h3>
            <p>{stats.students}</p>
          </div>

          <div className={styles.card}>
            <h3>Reports Generated</h3>
            <p>{stats.reports}</p>
          </div>
        </section>

        {/* Activity */}
        <section className={styles.section}>
          <h2>Recent Activity</h2>
          <ul
            <li>User registered</li>
            <li>New assessment created</li>
            <li>Report generated</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;