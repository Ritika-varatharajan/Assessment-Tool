"use client";
import { useState } from "react";
import styles from "./admin.module.css";

interface User {
  fullName: string;
  email: string;
  role: "Student" | "Educator" | "Administrator";
}

export default function AdminDashboard() {
  const currentUser = {
    email: "admin@test.com",
    role: "Administrator",
  };

  const [users, setUsers] = useState<User[]>([
    {
      fullName: "John",
      email: "john@example.com",
      role: "Student",
    },
    {
      fullName: "Alice",
      email: "alice@example.com",
      role: "Educator",
    },
    {
      fullName: "Bob",
      email: "admin@test.com",
      role: "Administrator",
    },
  ]);

  const deleteUser = (email: string) => {
    const updated = users.filter((u) => u.email !== email);
    setUsers(updated);
  };
  const updateuser = 

  const changeRole = (email: string, role: User["role"]) => {
    const updated = users.map((u) =>
      u.email === email ? { ...u, role } : u
    );
    setUsers(updated);
  };

  const handleLogout = () => {
    alert("Logged out!");
    location.reload();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <p className={styles.welcome}>
        Welcome, {currentUser.email}
      </p>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>

      <hr className={styles.divider} />

      <h2 className={styles.sectionTitle}>Analytics</h2>
      <p>Total Users: {users.length}</p>
      <p>
        Students: {users.filter((u) => u.role === "Student").length}
      </p>
      <p>
        Educators: {users.filter((u) => u.role === "Educator").length}
      </p>
      <p>
        Admins: {users.filter((u) => u.role === "Administrator").length}
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.sectionTitle}>Manage Users</h2>

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
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>

              <td>
                <select
                  className={styles.select}
                  value={user.role}
                  onChange={(e) =>
                    changeRole(
                      user.email,
                      e.target.value as User["role"]
                    )
                  }
                >
                  <option>Student</option>
                  <option>Educator</option>
                  <option>Administrator</option>
                </select>
              </td>

              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteUser(user.email)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className={styles.updateBtn}
                  onClick={() => updateuser(user.email)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}