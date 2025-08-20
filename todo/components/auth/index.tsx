"use client";

import Image from "next/image";
import userImage from "@/public/user.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password || (!isLogin && !username)) {
      setMessage("Please fill in all fields.");
      return;
    }

    const endpoint = isLogin ? "/api/auth/signup/login" : "/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email, password } : { email, username, password }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      const userData = data.user;
      const token = data.token;

      if (!userData || !token) {
        setMessage("Login/Signup failed. No token returned.");
        return;
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      // Redirect to Todo page
      router.push("/todo");
    } catch (err) {
      setMessage("Server error. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="w-[500px] min-h-[500px] p-8 bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 rounded-3xl mx-auto mt-12 flex flex-col items-center gap-5">
      {/* User Icon */}
      <div
        className="flex justify-center items-center w-[120px] h-[120px] rounded-full 
                bg-gradient-to-br from-pink-300 via-blue-400 to-green-300 shadow-md"
      >
        <Image
          src={userImage}
          alt="User icon"
          width={100}
          height={100}
          className="object-contain rounded-full"
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold bg-gradient-to-bl from-black to-pink-500 bg-clip-text text-transparent">
        {isLogin ? "Login" : "SignUp"}
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="border border-black rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border border-black rounded px-3 py-2"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="border border-black rounded px-3 py-2"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full font-bold cursor-pointer border border-black rounded p-2 bg-blue-800 text-white"
        >
          {isLogin ? "Login" : "SignUp"}
        </button>
      </form>

      {message && <p className="text-red-500">{message}</p>}

      <p className="mt-3">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          className="text-blue-600 underline bg-none border-none cursor-pointer"
        >
          {isLogin ? "SignUp" : "Login"}
        </button>
      </p>
    </div>
  );
}
