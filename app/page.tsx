"use client";
import Link from "next/link";
import styles from "./home.module.css";

export default function Home() {
  return (
    <section className={styles.container}>
  
      <header className={styles.header}>
        <h1 className={styles.logo}>Assessment Tool</h1>
        
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="#about">About</Link>
          <Link href="#features">Features</Link>
          <Link href="#roles">Roles</Link>
         <button className={styles.buton}><a href="/login" className={styles.btnPrimary}>Login</a></button> 
          <button className={styles.buton}><a href="/register" className={styles.btnSecondary}>Register</a></button>
        </nav>
      </header>
      <hr></hr><center>
      <img src="/home.jpg" height="400px" width="400px"></img></center>
      <section className={styles.hero}>
        <h2>Assessment Tool</h2>
        <p>
          Create, manage, and evaluate assessments efficiently with powerful analytics.
        </p>
        
      </section>
      <section id="about" className={styles.section}>
        <h2>About the Project</h2>
        <p>
          The Assessment Tool is designed to simplify evaluation processes in
          educational and professional environments by providing a secure,
          scalable, and user-friendly platform.
        </p>
      </section>

      <section id="features" className={styles.section}>
        <h2>Key Features</h2>
        <div className={styles.grid}>
            <h3>Assessment Creation</h3>
            <p>Create quizzes, exams, and surveys with multiple formats.</p>
            <h3>Auto Grading</h3>
            <p>Automatically evaluate MCQs, True/False and more.</p>
            <h3>Analytics</h3>
            <p>Track performance with detailed reports and insights.</p>
            <h3>Secure Access</h3>
            <p>Role-based authentication for Admin, Educators, and Students.</p>
        </div>
      </section>
      <footer className={styles.footer}>
        <p>© 2026 Assessment Tool | Project</p>
      </footer>
    </section>
  );
}