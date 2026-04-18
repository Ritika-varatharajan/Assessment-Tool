"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./student.module.css";
const API = "https://assessment-tool-1-2e4i.onrender.com";

export default function StudentDashboard() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const router = useRouter();

  let student: any = {};
  try {
    student =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : {};
  } catch {
    student = {};
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [a, asg, r] = await Promise.all([
       
        axios.get(`${API}/assessments`),
axios.get(`${API}/assignments`),
axios.get(`${API}/results`),
      ]);

      setAssessments(a.data || []);
      setAssignments(asg.data || []);
      setResults(r.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SAFE FILTER (ID FIX)
  const myAssignments = assignments.filter(
    (asg) =>
      String(asg.studentId) === String(student.id) ||
      String(asg.userId) === String(student.id)
  );

  const myAssessmentIds = myAssignments.map((a) =>
    String(a.assessmentId)
  );

  const myAssessments = assessments.filter((a) =>
    myAssessmentIds.includes(String(a.id))
  );

  // ✅ COMPLETED / PENDING FIX
  const completed = myAssessments.filter((a) =>
    results.some(
      (r) =>
        String(r.assessmentId) === String(a.id) &&
        (String(r.userId) === String(student.id) ||
          String(r.studentId) === String(student.id))
    )
  );

  const pending = myAssessments.filter(
    (a) => !completed.some((c) => c.id === a.id)
  );

  const myResults = results.filter(
    (r) =>
      String(r.userId) === String(student.id) ||
      String(r.studentId) === String(student.id)
  );

  const avgScore = myResults.length
    ? (
        myResults.reduce((acc, r) => acc + Number(r.score || 0), 0) /
        myResults.length
      ).toFixed(2)
    : 0;

  const topScore = myResults.length
    ? Math.max(...myResults.map((r) => Number(r.score || 0)))
    : 0;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>
          Welcome, {student?.fullName || student?.email || "Student"}
        </h1>
        <p>View your assessments and track performance</p>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab("assessments")}>
          My Assessments
        </button>
        <button onClick={() => setActiveTab("results")}>
          Results
        </button>
      </div>

      <div className={styles.main}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Total Assigned</h3>
              <p>{myAssessments.length}</p>
            </div>

            <div className={styles.card}>
              <h3>Completed</h3>
              <p>{completed.length}</p>
            </div>

            <div className={styles.card}>
              <h3>Pending</h3>
              <p>{pending.length}</p>
            </div>

            <div className={styles.card}>
              <h3>Average Score</h3>
              <p>{avgScore}</p>
            </div>

            <div className={styles.card}>
              <h3>Top Score</h3>
              <p>{topScore}</p>
            </div>
          </div>
        )}

        {/* ASSESSMENTS */}
        {activeTab === "assessments" && (
          <>
            <h2>My Assessments</h2>

            <div className={styles.cardGrid}>
              {myAssessments.map((a) => {
                const isCompleted = completed.some(
                  (c) => c.id === a.id
                );

                const totalMarks =
                  a.questions?.reduce(
                    (sum: number, q: any) => sum + (q.marks || 0),
                    0
                  ) || 0;

                return (
                  <div key={a.id} className={styles.assessmentCard}>
                    <h3>{a.title}</h3>
                    <p><strong>Time:</strong> {a.timeLimit} mins</p>
                    <p><strong>Total Marks:</strong> {totalMarks}</p>

                    <p className={styles.instructions}>
                      {a.instructions
                        ? a.instructions.slice(0, 60) + "..."
                        : "No instructions"}
                    </p>

                    <p>
                      Status:{" "}
                      {isCompleted ? "Completed ✅" : "Pending ⏳"}
                    </p>

                    {!isCompleted && (
                      <button
                        className={styles.primaryBtn}
                        onClick={() =>
                          router.push(`/student/test/${a.id}`)
                        }
                      >
                        Start
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* RESULTS */}
        {activeTab === "results" && (
          <>
            <h2>My Results</h2>

            <div className={styles.resultList}>
              {myResults.map((r) => {
                const assessment = assessments.find(
                  (a) => String(a.id) === String(r.assessmentId)
                );

                const totalMarks =
                  assessment?.questions?.reduce(
                    (sum: number, q: any) => sum + (q.marks || 1),
                    0
                  ) || 0;

                
const percentage = totalMarks
  ? (r.score / totalMarks) * 100
  : 0;

let feedback = "";

if (percentage >= 80) feedback = "Excellent 🎉";
else if (percentage >= 60) feedback = "Good 👍";
else if (percentage >= 40) feedback = "Average 🙂";
else feedback = "Needs Improvement ⚠️";
                return (
                  <div key={r.id} className={styles.resultCard}>
                    <h3>{assessment?.title}</h3>

                    <p><strong>Score:</strong> {r.score} / {totalMarks}</p>

                    <p><strong>Percentage:</strong> {percentage}%</p>

                    <p>
                      <strong>Performance:</strong>{" "}
                      <span className={styles.feedback}>
                        {feedback}
                      </span>
                    </p>

                    <p>
                      Status:{" "}
                      {r.score !== undefined
                        ? "Completed ✅"
                        : "Pending ⏳"}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}