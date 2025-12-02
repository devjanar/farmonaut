"use client";

import { useState, useEffect } from "react";
import Signin from "./Signin";
import Signup from "./Signup";

export default function AuthWrapper() {
  const [showSignin, setShowSignin] = useState(true);

  return showSignin ? (
    <Signin
      onShowSignup={() => setShowSignin(false)}
    />
  ) : (
    <Signup onShowSignin={() => setShowSignin(true)} />
  );
}
