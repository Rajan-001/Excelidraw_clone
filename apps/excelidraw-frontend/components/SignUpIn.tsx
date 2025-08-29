"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react";

import Login from "./Login";
import SignUp from "./SignUp";

export default function SignUpIn() {
     const { data: session, status } =  useSession()

  const [showSignUpModal,setSignUpModal]=useState(true)
  const [loginModal,setLoginModal]=useState(false)
          
  return (
   <div className="min-h-screen flex items-center justify-center p-5 " >
   { showSignUpModal && <SignUp setSignUpModal={setSignUpModal} setLoginModal={setLoginModal}/> }
  {
    loginModal && <Login setSignUpModal={setSignUpModal} setLoginModal={setLoginModal} />
  }
</div>

  )
}
