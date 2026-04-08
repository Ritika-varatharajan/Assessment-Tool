"use client";
import Link from "next/link";
import styles from "./home.module.css";

export default function Home() {
  return (
    <section className={styles.container}>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>Assess<span>Me</span></h1>
        
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="#about">About</Link>
          <Link href="#features">Features</Link>
          <Link href="#roles">Roles</Link>
          
          <Link href="/login" className={styles.btnPrimary}>Login</Link>
          <Link href="/register" className={styles.btnSecondary}>Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Smart Assessment Platform</h2>
          <p>
            Create, manage, and evaluate assessments with ease. Built for
            educators, administrators, and students.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/register" className={styles.btnPrimary}>Get Started</Link>
            <Link href="#features" className={styles.btnOutline}>Explore Features</Link>
          </div>
        </div>

        <img src="/home.jpg" alt="Assessment" className={styles.heroImage} />
      </section>

      {/* About */}
      <section id="about" className={styles.section}>
        <h2>About the Project</h2>
        <p>
          The Assessment Tool is a modern platform designed to simplify
          evaluation processes in educational and professional environments.
          It ensures secure, scalable, and efficient assessment management.
        </p>
      </section>

      {/* Features */}
      <section id="features" className={styles.section}>
        <h2>Key Features</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Assessment Creation</h3>
            <p>Create quizzes, exams, and surveys with multiple formats.</p>
          </div>

          <div className={styles.card}>
            <h3>Auto Grading</h3>
            <p>Automatically evaluate MCQs, True/False, and more.</p>
          </div>

          <div className={styles.card}>
            <h3>Analytics</h3>
            <p>Track performance with detailed reports and insights.</p>
          </div>

          <div className={styles.card}>
            <h3>Secure Access</h3>
            <p>Role-based authentication for Admin, Educators, and Students.</p>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className={styles.section}>
        <h2>User Roles</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Administrator</h3>
            <p>Manage users, roles, and system analytics.</p>
          </div>
          <div className={styles.card}>
            <h3>Educator</h3>
            <p>Create and manage assessments, monitor student progress.</p>
          </div>
          <div className={styles.card}>
            <h3>Student</h3>
            <p>Take assessments and view feedback instantly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 AssessMe | Capstone Project</p>
      </footer>
    </section>
  );
}

