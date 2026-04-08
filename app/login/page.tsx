"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const roles = [
    { id: "student", label: "Student", icon: "🎓" },
    { id: "educator", label: "Educator", icon: "👨‍🏫" },
    { id: "admin", label: "Admin", icon: "🛡️" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief delay for a better UI feel
    setTimeout(() => {
      if (role === "admin") {
        router.push("/admindashboard");
      } else if (role === "educator") {
        router.push("/educatordashboard");
      } else {
        router.push("/student/dashboard");
      }
    }, 800);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <header className={styles.header}>
          <h1>Assessment<span>Tool</span></h1>
          <p className={styles.subtitle}>Welcome back! Please enter your details.</p>
        </header>

       
        

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <br></br>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br>
          </br>
          <div className={styles.roleContainer}>
          <label className={styles.inputLabel}>Sign in as:</label>
          <div className={styles.roleButtons}>
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`${styles.roleBtn} ${role === r.id ? styles.roleBtnActive : ""}`}
                onClick={() => setRole(r.id)}
              >
                <span className={styles.roleIcon}>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
        </div>

          <button type="submit" className={styles.loginBtn} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.registerText}>
          Don't have an account? <Link href="/register">Create one for free</Link>
        </p>

        <footer className={styles.footer}>
          <p>© 2026 Assessment Tool Project</p>
        </footer>
      </div>
    </div>
  );
}