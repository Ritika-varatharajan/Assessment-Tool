"use client";
import Link from "next/link";
import styles from "./home.module.css";

export default function Home() {
  return (
    <section className={styles.container}>

      <header className={styles.header}>
        <h1 className={styles.logo}>Assessment<span>Tool</span></h1>
        
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="#about">About</Link>
          <Link href="#features">Features</Link>
          
          <Link href="/login" className={styles.btnPrimary}>Login</Link>
          <Link href="/register" className={styles.btnSecondary}>Register</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Smart Assessment Tool </h2>
          <p>
            Create, manage, and evaluate assessments with ease. Built for
            educators, administrators, and students.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/register" className={styles.btnPrimary}>Get Started</Link>

          </div>
        </div>

        <img src="/home.jpg" alt="Assessment" className={styles.heroImage} />
      </section>


      
      <section id="about" className={styles.section}>
  <h2>About</h2>

  <div className={styles.card}>
    <p>
      The Assessment Tool is a smart and easy-to-use platform for creating and managing tests 📝. 
      Educators can design assessments, assign them to students, and track performance effortlessly 📊. 
      Students can take tests with a timer ⏳ and get instant results, making learning more interactive and effective 🚀.
    </p>
  </div>
</section>

    
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
            <p>Role-based authentication for  Educators, and Students.</p>
          </div>
        </div>
      </section>

     

      <footer className={styles.footer}>
        <p>© 2026 Assessment Tool | All Rights Reserved.</p>
      </footer>
    </section>
  );
}

