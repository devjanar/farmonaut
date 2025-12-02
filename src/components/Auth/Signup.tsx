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

interface SignupProps {
  onShowSignin?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onShowSignin }) => {
  const router = useRouter();
  const [state, setState] = useState({
    _name: "",
    _email: "",
    _password: "",
    _conform_password: "",
    error: "",
    success: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { _name, _email, _password, _conform_password } = state;

    if (!_name || !_email || !_password || !_conform_password) {
      setState(prev => ({ ...prev, error: "All fields are required" }));
      return;
    }

    if (_password !== _conform_password) {
      setState(prev => ({ ...prev, error: "Passwords do not match" }));
      return;
    }

    try {
      setLoading(true);
      setState(prev => ({ ...prev, error: "" }));

      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _name, _email, _password, _conform_password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Signup failed");

      setState(prev => ({ ...prev, success: true }));
      onShowSignin?.();
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Signup failed" }));
    } finally {
      setLoading(false);
    }
  };

  const { _name, _email, _password, _conform_password, error, success } = state;

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200 text-center">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Signup Successful</CardTitle>
            <CardDescription>
              Please check your email for instructions to verify your account.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/admin/login">
              <Button variant="default" className="w-full">
                Go to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold text-center">
            Sign Up
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
              <Label htmlFor="_name">Name</Label>
              <Input
                className="p-4 min-h-[50px]"
                id="_name"
                name="_name"
                type="text"
                placeholder="Enter your name"
                value={_name}
                onChange={handleChange}
              />
            </div>

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
                placeholder="Enter password"
                value={_password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="_conform_password">Confirm Password</Label>
              <Input
                className="p-4 min-h-[50px]"
                id="_conform_password"
                name="_conform_password"
                type="password"
                placeholder="Re-enter password"
                value={_conform_password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-4">
            <Button type="submit" className="w-full p-4 min-h-[50px]" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onShowSignin?.();
              }}
              className="text-sm text-blue-600 hover:underline text-center"
            >
              Already have an account? Log in
            </a>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
