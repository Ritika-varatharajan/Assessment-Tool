"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "./test.module.css";
const API = "https://assessment-tool-1-2e4i.onrender.com";

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

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
    fetchAssessment();
    checkIfAlreadySubmitted();
  }, []);

  useEffect(() => {
    if (assessment?.timeLimit) {
      setTimeLeft(assessment.timeLimit * 60);
    }
  }, [assessment]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft <= 0 && assessment && !submitted) {
      handleSubmit(true);
    }
  }, [timeLeft]);

  const fetchAssessment = async () => {
    
    const res = await axios.get(
  `${API}/assessments/${id}`
);
    setAssessment(res.data);
  };
  

  const checkIfAlreadySubmitted = async () => {
    const res = await axios.get(`${API}/results`);

    const already = res.data.find(
      (r: any) =>
        String(r.assessmentId) === String(id) &&
        (String(r.userId) === String(student.id) ||
          String(r.studentId) === String(student.id))
    );

    if (already) {
      router.push("/student");
    }
  };

  const handleChange = (qIndex: number, value: string) => {
    setAnswers({
      ...answers,
      [qIndex]: value,
    });
  };

  const handleSubmit = async (auto = false) => {
    if (!assessment || submitted) return;

    setSubmitted(true);

    let totalScore = 0;

    assessment.questions.forEach((q: any, index: number) => {
      const userAns = String(answers[index] || "")
        .trim()
        .toLowerCase();

      const correctAns = String(q.correctAnswer || "")
        .trim()
        .toLowerCase();

      if (userAns === correctAns) {
        totalScore += q.marks || 1;
      }
    });

    try {
      
      await axios.post(`${API}/results`, {
  assessmentId: String(id),
  studentId: String(student.id),
  score: totalScore,
});

      setScore(totalScore);
      setShowResult(true);

      setTimeout(() => {
        router.push("/student");
      }, 5000);
    } catch (err) {
      console.error(err);
      setSubmitted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!assessment) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>{assessment.title}</h1>

        <p><strong>Time:</strong> {assessment.timeLimit} mins</p>

        <p className={styles.timer}>
          ⏳ Time Left: {formatTime(timeLeft)}
        </p>

        <div className={styles.questions}>
          {assessment.questions?.map((q: any, index: number) => (
            <div key={index} className={styles.questionBox}>
              <p className={styles.question}>
                {index + 1}. {q.question}
              </p>

              <div className={styles.options}>
                {q.options?.map((opt: string, i: number) => (
                  <label key={i} className={styles.option}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      value={opt}
                      checked={answers[index] === opt}
                      onChange={() => handleChange(index, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!submitted && (
          <button
            className={styles.submitBtn}
            onClick={() => handleSubmit(false)}
          >
            Submit Test 🚀
          </button>
        )}
      </div>

      {showResult && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>🎉 Test Completed</h2>

            <p>Your Score:</p>
            <h1>{score}</h1>

            <button
              onClick={() => router.push("/student")}
              className={styles.viewBtn}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}