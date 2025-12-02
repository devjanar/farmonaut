"use client";
import { API } from "@/apiEnv"; 
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SigninProps {
  onShowSignup?: () => void;
}

const Signin: React.FC<SigninProps> = ({ onShowSignup }) => {
  const router = useRouter();
  const [state, setState] = useState({ _email: "", _password: "", error: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { _email, _password } = state;

    if (!_email || !_password) {
      setState(prev => ({ ...prev, error: "Email and password are required" }));
      return;
    }

    try {
      setLoading(true);
      setState(prev => ({ ...prev, error: "" }));

      const res = await fetch(`${API}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _email, _password }),
      });

      const data = await res.json();

      if (res.ok && data?.token) {
        window.location.reload()
      } else {
        setState(prev => ({ ...prev, error: data?.message || "Invalid credentials" }));
      }
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, error: "Login failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const { _email, _password, error } = state;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold text-center">
            Welcome to Innovationghar
          </CardTitle>
          <CardDescription className="text-center m-auto">
            <Image
                src="/innovationghar.png"
                width={100}
                height={100}
                alt="Logo"
                className=""
              />
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="_email">Email</Label>
              <Input
                className="p-4 min-h-[50px]"
                id="_email"
                name="_email"
                type="email"
                placeholder="Enter your email"
                value={_email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="_password">Password</Label>
              <Input
                className="p-4 min-h-[50px]"
                id="_password"
                name="_password"
                type="password"
                placeholder="Enter your password"
                value={_password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
          </CardContent>

          <CardFooter className="flex flex-col mt-4 gap-4">
            <Button type="submit" className="w-full p-4 min-h-[50px] text-lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log in
            </Button>

            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onShowSignup?.();
              }}
              className="text-sm text-blue-600 hover:underline text-center"
            >
              Don’t have an account? Create one
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signin;
