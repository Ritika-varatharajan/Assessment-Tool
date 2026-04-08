"use client";
import Link from "next/link";

export default function Home() {
  return (
    <section>
      <header>
        <h1>Assessment Tool</h1>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link> |{" "}
          <Link href="#about">About</Link> |{" "}
          <Link href="/login">Login</Link> |{" "}
          <Link href="/register">Register</Link>
        </nav>
        <hr />
      </header>
      <br>
      </br><br>
      </br>
      <main>
        <h2>Welcome to the Assessment Tool</h2>
        <p>
          This platform helps educators create exams and students take them
          online easily.
        </p>
<br>
      </br><br>
      </br><div>
        <h2 id="about">About</h2>
        <h3>Our Objective</h3>
        <p>
          To simplify the assessment process with an easy-to-use and efficient
          system.
        </p>
        <br>
      </br>
      </div><br>
      </br><br>
      </br>
        <div>
        <h3>Features</h3>
        <ul>
          <li>Create quizzes, tests, and exams</li>
          <li>Multiple question formats (MCQ, True/False, Essay)</li>
          <li>Automatic grading system</li>
          <li>Instant feedback</li>
          <li>Performance analytics</li>
        </ul>
        </div>
      </main>
      <br>
      </br>

      <footer>
        <p>© 2026 Assessment Tool Project</p>
      </footer>
  </section>
  );
}