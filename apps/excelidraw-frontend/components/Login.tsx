"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiTwitterXFill } from "react-icons/ri";


export default function Login({setSignUpModal,setLoginModal}:{setSignUpModal:any,setLoginModal:any}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,SetName]=useState("")
  const router=useRouter()
  async function handleLogin() {
    try {
      console.log("login is env",process.env.NEXT_PUBLIC_API_URL!)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password}),
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "SignIN failed");
        return;
       }
       else{
        router.push("/room")
       }
 
    
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white/30 backdrop-blur-sm">
      <div className="relative w-[420px] min-h-[480px] bg-gradient-to-bl from-neutral-100 via-neutral-900 to-neutral-100 rounded-3xl shadow-xl p-8 text-white">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-slate-100 text-sm">Login to your account</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-slate-200 text-sm font-semibold mb-2">Name</label>
          <input 
            onChange={(e) => SetName(e.target.value)} 
            type="text" 
            placeholder="Enter your username" 
            className="w-full p-3 border-2 border-slate-200 text-slate-900 rounded-xl text-base 
                       bg-white/80 focus:border-indigo-500 focus:bg-white transform 
                       transition-all duration-300 focus:translate-y-[-2px] focus:shadow-lg 
                       placeholder:text-slate-400 outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <label className="block text-slate-200 text-sm font-semibold mb-2">Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 border-2 border-slate-200 text-slate-900 rounded-xl text-base 
                       bg-white/80 focus:border-indigo-500 focus:bg-white transform 
                       transition-all duration-300 focus:translate-y-[-2px] focus:shadow-lg 
                       placeholder:text-slate-400 outline-none"
          />
          <button className="absolute right-3 top-2/3 -translate-y-1/2 text-slate-200 hover:text-indigo-500">
            👁️
          </button>
        </div>

        {/* Login Button */}
        <button  
          onClick={handleLogin} 
          className="relative w-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800
                     text-white p-4 rounded-xl font-semibold shadow-md hover:shadow-2xl 
                     transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                     active:translate-y-0 overflow-hidden group"
        >
          {/* Glow Ring Effect */}
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 opacity-50 blur-lg group-hover:opacity-70 transition-opacity duration-300"></span>
          
          {/* Shimmer Effect */}
          <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent 
                           transform skew-x-[-20deg] group-hover:animate-shimmer"></span>

          {/* Button Text */}
          <span className="relative z-10">✨ Login</span>
        </button>

        {/* Divider */}
        <div className="relative text-center my-8 text-slate-200 text-sm">
          <span className="bg-neutral-900 px-4 py-2 relative z-10 rounded-lg">Or login with</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-10"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-xl bg-white/80 text-slate-600 font-medium hover:border-indigo-500 hover:bg-white transform hover:-translate-y-1 hover:shadow-lg transition">
             <FcGoogle className="w-5 h-5" /> Google 
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-xl bg-white/80 text-slate-600 font-medium hover:border-indigo-500 hover:bg-white transform hover:-translate-y-1 hover:shadow-lg transition">
             <RiTwitterXFill className="w-5 h-5"/> X 
          </button>
        </div>

        {/* Signup Redirect */}
        <div className="text-center mt-6">
          <p className="text-slate-100 text-sm">
            Don’t have an account?
            <span onClick={()=>{setSignUpModal(true);setLoginModal(false);}} className="text-slate-100 font-semibold cursor-pointer hover:text-neutral-200 ml-2">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
