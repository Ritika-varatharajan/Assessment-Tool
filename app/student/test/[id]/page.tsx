"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "./test.module.css";

const API = "https://assessment-tool-1-2e4i.onrender.com";

// ✅ TYPES
type Question = {
  question: string;
  type: "mcq" | "truefalse" | "short" | "essay";
  options?: string[];
  correctAnswer: string;
  marks?: number;
};

type Assessment = {
  id: string;
  title: string;
  timeLimit: number;
  educatorId?: string;
  questions: Question[];
};

type Result = {
  assessmentId: string;
  studentId: string;
};

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  let student: { id?: string } = {};
  try {
    student =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : {};
  } catch {
    student = {};
  }

  // ✅ FIX 1: useCallback (prevents ESLint dependency warning)
  const fetchAssessment = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/assessments/${id}`);

      const fixedQuestions: Question[] = (res.data.questions || []).map(
        (q: Partial<Question> & { answer?: string }) => ({
          ...q,
          correctAnswer: q.correctAnswer || q.answer || "",
          options:
            q.type === "mcq"
              ? q.options || []
              : q.type === "truefalse"
              ? ["True", "False"]
              : [],
        })
      );

      setAssessment({ ...res.data, questions: fixedQuestions });
    } catch (err) {
      console.error(err);
      alert("Failed to load test");
    }
  }, [id]);

  const checkIfAlreadySubmitted = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/results`);

      const already = res.data.find(
        (r: Result) =>
          String(r.assessmentId) === String(id) &&
          String(r.studentId) === String(student?.id)
      );

      if (already) router.push("/student");
    } catch (err) {
      console.error(err);
    }
  }, [id, router, student?.id]);

  const handleChange = (qIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (!assessment || submitted) return;

      if (!auto && Object.keys(answers).length === 0) {
        alert("Please answer at least one question");
        return;
      }

      setSubmitted(true);

      let totalScore = 0;

      assessment.questions.forEach((q, index) => {
        const userAns = String(answers[index] || "").trim().toLowerCase();
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
          studentId: String(student?.id),
          educatorId: assessment.educatorId,
          score: totalScore,
          completed: true,
          submittedAt: new Date().toISOString(),
        });

        setScore(totalScore);
        setShowResult(true);

        setTimeout(() => {
          router.push("/student");
        }, 5000);
      } catch (err) {
        console.error(err);
        alert("Submission failed");
        setSubmitted(false);
      }
    },
    [assessment, submitted, answers, id, student?.id, router]
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ✅ EFFECTS

  useEffect(() => {
    fetchAssessment();
    checkIfAlreadySubmitted();
  }, [fetchAssessment, checkIfAlreadySubmitted]);

  // ✅ FIX 2: avoid direct setState warning
  useEffect(() => {
    if (assessment?.timeLimit) {
      const time = assessment.timeLimit * 60;
      setTimeLeft(time);
    }
  }, [assessment]);

  useEffect(() => {
    if (!assessment || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, submitted, handleSubmit]);

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
          {assessment.questions.map((q, index) => (
            <div key={index} className={styles.questionBox}>
              <p className={styles.question}>
                {index + 1}. {q.question}
              </p>

              {/* MCQ */}
              {q.type === "mcq" &&
                q.options?.map((opt, i) => (
                  <label key={i} className={styles.option}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      checked={answers[index] === opt}
                      onChange={() => handleChange(index, opt)}
                    />
                    {opt}
                  </label>
                ))}

              {/* TRUE/FALSE */}
              {q.type === "truefalse" &&
                ["True", "False"].map((opt) => (
                  <label key={opt} className={styles.option}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      checked={answers[index] === opt}
                      onChange={() => handleChange(index, opt)}
                    />
                    {opt}
                  </label>
                ))}

              {/* SHORT */}
              {q.type === "short" && (
                <input
                  className={styles.input}
                  placeholder="Your answer"
                  value={answers[index] || ""}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                />
              )}

              {/* ESSAY */}
              {q.type === "essay" && (
                <textarea
                  className={styles.textarea}
                  placeholder="Write your answer"
                  value={answers[index] || ""}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                />
              )}
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