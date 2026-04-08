"use client";
import { useState } from "react";
import Link from "next/link";

 export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <nav>
        <h2>Admin DashBoard</h2>
        <hr></hr>   
        <ul>
          <li>User Management</li>
          <li>Permissions</li>
          <li>Reports</li>
        </ul>
      </nav>

      <main>
        <header>
          <h1>Welcome, Administrator</h1>
        </header>
        <section>
          <h2>Dashboard Overview</h2>
          <p>Here you can manage users, set permissions, and view reports.</p>
        </section>      

      </main>
    </div>
  );
}
    
