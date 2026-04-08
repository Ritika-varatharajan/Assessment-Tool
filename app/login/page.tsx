"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student", // ✅ must match register roles
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const { role } = formData;

      console.log("ROLE:", role); // ✅ Debug check

      // ✅ Save user data (important for dashboard)
      localStorage.setItem("user", JSON.stringify(formData));

      // ✅ Correct routing based on folder names
      if (role === "Administrator") {
        router.push("/admin"); // ✅ FIXED (was /admindashboard ❌)
      } else if (role === "Educator") {
        router.push("/educator");
      } else {
        router.push("/student");
      }

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.brand}>
          <h1>
            Assess<span>Me</span>
          </h1>
          <p>The professional way to evaluate talent.</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="e.g. alex@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Sign in as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Student">Student / Candidate</option>
              <option value="Educator">Educator / Instructor</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}