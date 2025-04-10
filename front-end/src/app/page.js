"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent , CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !role) return alert("Please enter username and select a role");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        // Save user info to localStorage (or cookie, or global context)

        // Redirect based on role
        switch (role) {
          case "flightManager":
            router.push("/flight-manager/dashboard");
            break;
          case "resourceManager":
            router.push("/resource-manager/dashboard");
            break;
          case "passenger":
            router.push("/passenger/dashboard");
            break;
          default:
            alert("Invalid role selected");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
<main className="min-h-screen flex flex-col items-center justify-center gap-20 bg-gradient-to-br from-blue-100 to-blue-100 p-4">
{/* <Card className="w-full max-w-xl p-4 shadow-md rounded-xl  backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-4xl font-extrabold text-center text-blue-400">
         SkyFleet Aviation Control
      </CardTitle>
    </CardHeader>
  </Card> */}
  <h1 className="text-4xl font-extrabold text-center text-black-500">SkyFleet Aviation Control</h1>

      <Card className="w-full max-w-xl p-15 shadow-2xl rounded-2xl">
        <CardContent>
          <h1 className="text-4xl font-bold text-center mb-6">Login</h1>

          <div className="space-y-6">
          <select
              className="w-full p-2 rounded-xl border border-gray-300 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="flightManager">Flight Manager</option>
              <option value="resourceManager">Resource Manager</option>
              <option value="passenger">Passenger</option>
            </select>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            

            <Button onClick={handleLogin} className="w-full ">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
