"use client";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  

  return (
    <center>
    <main>
      <h1>Create Account</h1>
      <form >
         Full Name:
          <input  type="text"  name="username"  required />
        <br>
      </br>
       Email:
          <input   type="email"   name="email"  required   />
       <br>
      </br> 
      Password:
          <input   type="password"  name="password"  required  />
      <br>
      </br> Confirm Password:
          <input  type="password"   name="password"  required    />
          <br>
        </br>
        <button type="submit">Register</button>
      </form>
      <br>
      </br>
      
      

      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </main>
    </center>
  );
}