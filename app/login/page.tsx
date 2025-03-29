"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, saveCurrentUser, hashPassword } from "@/lib/storage-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Modify the handleSubmit function to add better error handling and logging
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username || !formData.password) {
      setError("All fields are required")
      return
    }

    setLoading(true)

    try {
      // Get users from storage
      const users = getUsers()
      console.log(`Found ${users.length} users in storage`)

      // Hash the input password for comparison
      const hashedPassword = hashPassword(formData.password)

      // Find user by username/email and password
      const user = users.find(
        (user) =>
          (user.username === formData.username || user.email === formData.username) && user.password === hashedPassword,
      )

      if (!user) {
        console.log("Login failed: Invalid credentials")
        setError("Invalid username or password")
        setLoading(false)
        return
      }

      console.log(`User found, logging in: ${user.username}`)

      // Store current user info (excluding password)
      saveCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
      })

      setLoading(false)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error during login:", error)
      setError("An error occurred during login. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <BookOpen className="h-6 w-6" />
          <span>VocabVault</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl relative">
          <div className="absolute inset-0 bg-glossy-gradient rounded-lg pointer-events-none"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl text-primary">Login</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 text-red-300 border border-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username or Email
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe or john@example.com"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center relative z-10">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

