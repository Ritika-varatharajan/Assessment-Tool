"use client";

import { useState, useEffect } from "react";
import styles from "./AssessmentForm.module.css";

// ✅ TYPES
type Question = {
  type: "mcq" | "truefalse" | "short" | "essay";
  question: string;
  options: string[];
  correctAnswer: string;
  marks: number;
};

type Assessment = {
  title: string;
  category: string;
  instructions: string;
  timeLimit: number;
  questions: Question[];
  educatorId?: string;
};

type Props = {
  onSubmit: (data: Assessment) => void;
  initialData?: Partial<Assessment>;
};

export default function AssessmentForm({ onSubmit, initialData }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);

  // ✅ FIX: typed user
  let user: { id?: string } = {};
  try {
    user =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : {};
  } catch {
    user = {};
  }

  // ✅ FIX: safe useEffect (no ESLint warning)
  useEffect(() => {
    if (!initialData) return;

    const safeQuestions: Question[] = (initialData.questions || []).map(
      (q: Partial<Question> & { answer?: string }) => ({
        type: q.type || "mcq",
        question: q.question || "",
        correctAnswer: q.correctAnswer || q.answer || "",
        options:
          q.type === "mcq"
            ? q.options || ["", "", "", ""]
            : q.type === "truefalse"
            ? ["True", "False"]
            : [],
        marks: q.marks && q.marks >= 0 ? q.marks : 0,
      })
    );

    // 🔥 batching all updates together
    setTitle(initialData.title || "");
    setCategory(initialData.category || "");
    setInstructions(initialData.instructions || "");
    setTimeLimit(initialData.timeLimit || 30);
    setQuestions(safeQuestions);
  }, [initialData]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
      },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number
  ) => {
    const updated = [...questions];

    if (field === "marks") {
      let num = Number(value);
      if (isNaN(num) || num < 0) num = 0;
      value = num;
    }

    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {initialData ? "Edit Assessment" : "Create Assessment"}
      </h3>

      <label className={styles.label}>Assessment Title</label>
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className={styles.label}>Category</label>
      <input
        className={styles.input}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <label className={styles.label}>Instructions</label>
      <textarea
        className={styles.textarea}
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <label className={styles.label}>Time Limit (Minutes)</label>
      <input
        className={styles.input}
        type="number"
        value={timeLimit}
        onChange={(e) => setTimeLimit(Number(e.target.value) || 0)}
      />

      {questions.map((q, i) => (
        <div key={i} className={styles.questionBox}>
          <h4>Question {i + 1}</h4>

          <select
            className={styles.input}
            value={q.type}
            onChange={(e) => {
              const type = e.target.value as Question["type"];
              const updated = [...questions];

              updated[i] = {
                ...updated[i],
                type,
                correctAnswer: "",
                options:
                  type === "mcq"
                    ? ["", "", "", ""]
                    : type === "truefalse"
                    ? ["True", "False"]
                    : [],
              };

              setQuestions(updated);
            }}
          >
            <option value="mcq">MCQ</option>
            <option value="truefalse">True/False</option>
            <option value="short">Short</option>
            <option value="essay">Essay</option>
          </select>

          <input
            className={styles.input}
            value={q.question}
            onChange={(e) => updateQuestion(i, "question", e.target.value)}
          />

          {/* MCQ */}
          {q.type === "mcq" &&
            q.options.map((opt, j) => (
              <div key={j}>
                <input
                  className={styles.optionInput}
                  value={opt}
                  onChange={(e) => {
                    const updated = questions.map((item, idx) => {
                      if (idx === i) {
                        const opts = [...item.options];
                        opts[j] = e.target.value;
                        return { ...item, options: opts };
                      }
                      return item;
                    });
                    setQuestions(updated);
                  }}
                />

                <input
                  type="radio"
                  checked={q.correctAnswer === opt}
                  onChange={() =>
                    updateQuestion(i, "correctAnswer", opt)
                  }
                />
              </div>
            ))}

          {/* TRUE/FALSE */}
          {q.type === "truefalse" && (
            <>
              <label>
                <input
                  type="radio"
                  checked={q.correctAnswer === "True"}
                  onChange={() =>
                    updateQuestion(i, "correctAnswer", "True")
                  }
                />
                True
              </label>

              <label>
                <input
                  type="radio"
                  checked={q.correctAnswer === "False"}
                  onChange={() =>
                    updateQuestion(i, "correctAnswer", "False")
                  }
                />
                False
              </label>
            </>
          )}

          {/* SHORT */}
          {q.type === "short" && (
            <input
              className={styles.input}
              value={q.correctAnswer}
              onChange={(e) =>
                updateQuestion(i, "correctAnswer", e.target.value)
              }
            />
          )}

          {/* ESSAY */}
          {q.type === "essay" && (
            <textarea
              className={styles.textarea}
              value={q.correctAnswer}
              onChange={(e) =>
                updateQuestion(i, "correctAnswer", e.target.value)
              }
            />
          )}

          {/* MARKS */}
          <input
            type="number"
            min="0"
            value={q.marks}
            onChange={(e) =>
              updateQuestion(i, "marks", e.target.value)
            }
          />

          <button
            className={styles.removeBtn}
            onClick={() => deleteQuestion(i)}
          >
            Remove
          </button>
        </div>
      ))}

      <button className={styles.addBtn} onClick={addQuestion}>
        + Add Question
      </button>

      <button
        className={styles.saveBtn}
        onClick={() => {
          if (!title.trim()) return alert("Title required");
          if (questions.length === 0) return alert("Add questions");

          const hasNegative = questions.some((q) => q.marks < 0);
          if (hasNegative) {
            alert("Marks cannot be negative");
            return;
          }

          onSubmit({
            ...initialData,
            title,
            category,
            instructions,
            timeLimit,
            questions,
            ...(initialData ? {} : { educatorId: user?.id }),
          } as Assessment);
        }}
      >
        Save
      </button>
    </div>
  );
}