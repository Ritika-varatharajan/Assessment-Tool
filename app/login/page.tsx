"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import styles from "./login.module.css";
const API = "https://assessment-tool-1-2e4i.onrender.com";

export default function LoginPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    // ✅ FIRST: API CALL
    const res = await axios.get(
      `${API}/users?email=${email}`
    );

    // ✅ THEN: GET USER
    const user = res.data?.[0];

    // ✅ THEN: CHECK PASSWORD
    if (user && user.password === password) {
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "Administrator":
          router.push("/admin");
          break;
        case "Educator":
          router.push("/educator");
          break;
        default:
          router.push("/student");
      }
    } else {
      alert("❌ Invalid email or password");
    }

  } catch (err: any) {
    console.error("LOGIN ERROR:", err);

    if (err.code === "ERR_NETWORK") {
      alert("⚠️ Unable to connect server");
    } else {
      alert("⚠️ Something went wrong");
    }
  }
};

  return (
    <main className={styles.container}>
      <div className={styles.authCard}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password || ""}
            onChange={handleChange}
            required
          />

          <button type="submit">Login
           
          </button>
        </form>

        <p>
          New User? <Link href="/register">Signup</Link>
        </p>
      </div>
    </main>
  );
}