"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  
  
  return (
    <center>
    
      
      <header>
        <h1>Assessment Tool - Login</h1>
      </header>
      <main>
        <form>
       
           Email: <input  type="email" id="email" required  placeholder="Enter your email"/>
          <br>
          </br>
       Password:<input  type="password"  id="password" required  placeholder="Enter your password"   />
       
          <br />
          <button type="submit">Login</button>
          
        </form>
       
        <p>New User? <Link href="/register">Register</Link>
        </p>
      </main>
      <footer>
        <p>© 2026 Assessment Tool Project</p>
      </footer>
  
     </center>
  );
}