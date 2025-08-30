import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={` flex items-center justify-center bg-gradient-to-r from-blue-200 to-pink-100 min-h-screen relative`}>
      <div className="text-center max-w-lg bg-white/70 background-blur-md p-10 rounded-2x1 shadow-x1">
        <h1 className=" flex items-center justify-center mb-4 text-5xl text-indigo-600 ">
          EduLearn <span className="text-pink-500">AI</span>
        </h1>
        <p className="mt-6 text-lg text-black-300">Your Personal Teacher Assistant at Home</p>
        <p className="mt-6 text-black-300"> For quiz, exams, homework and simple explinations of any assignment.</p>


         <button className="mt-2 px-6 py-3 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition"
           onClick={() => navigate("/class")}>Enter Your Personal Classroom</button>
        
        <p className="mt-8 text-sm text-gray-600">PeteraMajor © 2025</p>
    </div>
    </div>
  );
}
