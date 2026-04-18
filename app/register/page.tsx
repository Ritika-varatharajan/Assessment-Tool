"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./register.module.css";
const API = "https://assessment-tool-1-2e4i.onrender.com";

type UserRole = "Student" | "Educator" | "Administrator";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    role: "Student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ internal only

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? (value as UserRole) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent double click

    setError("");
    setLoading(true);

    try {
      const email = formData.email.trim();
      const fullName = formData.fullName.trim();

      // 🔍 Check existing user
      const res = await axios.get(
  `${API}/users?email=${email}`
);

      if (res.data.length > 0) {
        setError("Email already registered");
        setLoading(false); // ✅ fix
        return;
      }

      // ➕ Create user
     
        await axios.post(`${API}/users`, {
        ...formData,
        fullName,
        email,
        status: "active",
        createdAt: new Date().toISOString(),
      });

      alert("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      console.error("SIGNUP ERROR:", err);

      if (err.code === "ERR_NETWORK") {
        setError("⚠️ Server not running (start JSON Server)");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    }

    setLoading(false); // ✅ always reset
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Educator">Educator</option>
            <option value="Administrator">Administrator</option>
          </select>

          {error && <p className={styles.error}>{error}</p>}

          {/* ✅ Disabled silently (no loading text) */}
          <button type="submit" disabled={loading}>
            Sign Up
          </button>
        </form>

        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}