"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import { register } from 'module';

// Define roles
type UserRole = 'Student' | 'Educator' | 'Administrator';

// Form data type
interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

const Signup: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'Student',
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? (value as UserRole) : value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Basic validation
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // ✅ Save to localStorage (for demo)
    localStorage.setItem("user", JSON.stringify(formData));

    console.log('Registered User:', formData);

    // ✅ Redirect to login page
    router.push('/login');
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        
        <header className={styles.formHeader}>
          <h2>Create Account</h2>
          <p>Join the Assessment Tool platform</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.signupForm}>

          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input 
              id="fullName"
              type="text" 
              name="fullName" 
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="role">User Role</label>
            <select 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Student">Student / Participant</option>
              <option value="Educator">Educator / Instructor</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>

        <footer className={styles.formFooter}>
          <p>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default register;