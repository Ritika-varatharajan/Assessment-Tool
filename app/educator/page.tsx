"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./educator.module.css";
import AssessmentForm from "../components/AssessmentForm";
type FormData = {
  title: string;
  questions: any[];
};

export default function EducatorDashboard() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [showModal, setShowModal] = useState(false);
  const [editAssessment, setEditAssessment] = useState<any>(null);

  const [assignData, setAssignData] = useState({
    assessmentId: "",
    studentIds: [] as string[],
  });

  let educator: any = {};
  try {
    educator =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : {};
  } catch {
    educator = {};
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [a, r, u, asg] = await Promise.all([
        axios.get("http://localhost:5000/assessments"),
        axios.get("http://localhost:5000/results"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/assignments"),
      ]);

      setAssessments(a.data);
      setResults(r.data);
      setAssignments(asg.data);

      const studentUsers = u.data.filter(
        (user: any) => user.role === "Student"
      );
      setStudents(studentUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAssessment = async (id: string) => {
    if (!confirm("Delete assessment?")) return;
    await axios.delete(`http://localhost:5000/assessments/${id}`);
    fetchData();
  };

  // ✅ ASSIGN FUNCTION (UNCHANGED LOGIC)
  const assignAssessment = async () => {
    if (!assignData.assessmentId || assignData.studentIds.length === 0) {
      alert("Select assessment and at least one student");
      return;
    }

    try {
      const existing = await axios.get("http://localhost:5000/assignments");

      const newAssignments = assignData.studentIds.filter(
        (studentId) =>
          !existing.data.some(
            (a: any) =>
              a.studentId === studentId &&
              a.assessmentId === assignData.assessmentId
          )
      );

      await Promise.all(
        newAssignments.map((studentId) =>
          axios.post("http://localhost:5000/assignments", {
            assessmentId: assignData.assessmentId,
            studentId,
          })
        )
      );

      alert("Assigned successfully ✅");

      setAssignData({ assessmentId: "", studentIds: [] });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FILTER DATA
  const myAssessments = assessments.filter(
    (a) => a.educatorId === educator.id || a.createdBy === educator.id
  );

  const myResults = results.filter((r) =>
    myAssessments.some((a) => a.id === r.assessmentId)
  );

  const myAssignments = assignments.filter((asg) =>
    myAssessments.some((a) => a.id === asg.assessmentId)
  );

  const completedAssignments = myAssignments.filter((asg) =>
    myResults.some(
      (r) =>
        r.assessmentId === asg.assessmentId &&
        (r.userId === asg.studentId || r.studentId === asg.studentId)
    )
  );

  const completedCount = completedAssignments.length;
  const totalAssigned = myAssignments.length;

  const completionRate = totalAssigned
    ? ((completedCount / totalAssigned) * 100).toFixed(1)
    : 0;

  const pendingCount = totalAssigned - completedCount;

  const avgScore = myResults.length
    ? (
        myResults.reduce((acc, r) => acc + Number(r.score), 0) /
        myResults.length
      ).toFixed(2)
    : 0;

  const topScore = myResults.length
    ? Math.max(...myResults.map((r) => Number(r.score)))
    : 0;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>
          Welcome, {educator?.fullName || educator?.email || "Educator"}
        </h1>
        <p>Manage Assessments, Assign, and Analyze Results</p>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("assessments")}>Assessments</button>
        <button onClick={() => setActiveTab("assign")}>Assign</button>
        <button onClick={() => setActiveTab("results")}>Results</button>
      </div>

      <div className={styles.main}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Total Assessments</h3>
              <p>{myAssessments.length}</p>
            </div>
            <div className={styles.card}>
              <h3>Total Attempts</h3>
              <p>{completedCount}</p>
            </div>
            <div className={styles.card}>
              <h3>Average Score</h3>
              <p>{avgScore}</p>
            </div>
            <div className={styles.card}>
              <h3>Total Students</h3>
              <p>{students.length}</p>
            </div>
            <div className={styles.card}>
              <h3>Completion Rate</h3>
              <p>{completionRate}%</p>
            </div>
            <div className={styles.card}>
              <h3>Pending</h3>
              <p>{pendingCount}</p>
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
            <div className={styles.topRow}>
              <h2>My Assessments</h2>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  setEditAssessment(null);
                  setShowModal(true);
                }}
              >
                + Create
              </button>
            </div>

            <div className={styles.cardGrid}>
              {myAssessments.map((a) => {
                const totalMarks =
                  a.questions?.reduce(
                    (sum: number, q: any) => sum + (q.marks || 0),
                    0
                  ) || 0;

                return (
                  <div key={a.id} className={styles.assessmentCard}>
                    <h3>{a.title}</h3>
                    <p><strong>Time:</strong> {a.timeLimit} mins</p>
                    <p><strong>Category:</strong> {a.category || "N/A"}</p>
                    <p><strong>Total Marks:</strong> {totalMarks}</p>

                    <p className={styles.instructions}>
                      {a.instructions
                        ? a.instructions.slice(0, 50) + "..."
                        : "No instructions"}
                    </p>

                    <div className={styles.actions}>
                      <button
                        onClick={() => {
                          setEditAssessment(a);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteAssessment(a.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ✅ PROFESSIONAL ASSIGN UI */}
        {activeTab === "assign" && (
          <div className={styles.assignContainer}>
            <h2 className={styles.assignTitle}>Assign Assessment</h2>

            <div className={styles.assignBox}>
              <label>Select Assessment</label>
              <select
                value={assignData.assessmentId}
                onChange={(e) =>
                  setAssignData({ ...assignData, assessmentId: e.target.value })
                }
              >
                <option value="">Choose assessment</option>
                {myAssessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.studentSection}>
              <div className={styles.studentHeader}>
                <h3>Select Students</h3>

                <label className={styles.selectAll}>
                  <input
                    type="checkbox"
                    checked={
                      students.length > 0 &&
                      assignData.studentIds.length === students.length
                    }
                    onChange={(e) =>
                      setAssignData({
                        ...assignData,
                        studentIds: e.target.checked
                          ? students.map((s) => s.id)
                          : [],
                      })
                    }
                  />
                  Select All
                </label>
              </div>

              <div className={styles.studentList}>
                {students.map((s) => (
                  <label key={s.id} className={styles.studentItem}>
                    <input
                      type="checkbox"
                      checked={assignData.studentIds.includes(s.id)}
                      onChange={(e) =>
                        setAssignData({
                          ...assignData,
                          studentIds: e.target.checked
                            ? [...assignData.studentIds, s.id]
                            : assignData.studentIds.filter((id) => id !== s.id),
                        })
                      }
                    />
                    <span>{s.fullName}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className={styles.assignBtn} onClick={assignAssessment}>
              Assign Assessment 🚀
            </button>
          </div>
        )}

        {/* RESULTS */}
        {activeTab === "results" && (
          <div className={styles.resultList}>
            {myResults.map((r) => {
              const assessment = myAssessments.find(
                (a) => a.id === r.assessmentId
              );

              const student =
                students.find((s) => s.id === r.userId) ||
                students.find((s) => s.id === r.studentId);

              return (
                <div key={r.id} className={styles.resultCard}>
                  <h3>{assessment?.title}</h3>
                  <p>Student: {student?.fullName || "Unknown"}</p>
                  <p>Score: {r.score}</p>
                  <p>
                    Status:{" "}
                    {r.score !== undefined ? "Completed ✅" : "Pending ⏳"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {(showModal || editAssessment) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <AssessmentForm
  initialData={editAssessment}
  onSubmit={async (data: FormData) => {
    const payload = {
      ...data,
      educatorId: educator.id,
      totalMarks: data.questions.reduce(
        (sum: number, q: any) => sum + (q.marks || 0),
        0
      ),
    };

    if (editAssessment) {
      await axios.put(
        `http://localhost:5000/assessments/${editAssessment.id}`,
        payload
      );
      setEditAssessment(null);
    } else {
      await axios.post(
        "http://localhost:5000/assessments",
        payload
      );
      setShowModal(false);
    }

    fetchData();
  }}
/>

            <button
              className={styles.closeBtn}
              onClick={() => {
                setShowModal(false);
                setEditAssessment(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}  