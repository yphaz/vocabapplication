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
import { getUsers, saveUsers, saveCurrentUser, hashPassword } from "@/lib/storage-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      // Get existing users
      const users = getUsers()
      console.log(`Found ${users.length} existing users`)

      // Check if username or email already exists
      const userExists = users.some((user) => user.username === formData.username || user.email === formData.email)

      if (userExists) {
        setError("Username or email already exists")
        setLoading(false)
        return
      }

      // Create new user with hashed password
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: hashPassword(formData.password), // Hash the password
        vocabularies: [],
      }

      // Add new user to users array
      users.push(newUser)
      console.log(`Adding new user: ${newUser.username}`)

      // Save updated users array
      saveUsers(users)

      // Save current user info (excluding password)
      saveCurrentUser({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      })

      console.log("User registered and logged in successfully")
      setLoading(false)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error during signup:", error)
      setError("An error occurred during signup. Please try again.")
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
            <CardTitle className="text-2xl text-primary">Sign Up</CardTitle>
            <CardDescription className="text-gray-400">
              Create an account to start building your vocabulary
            </CardDescription>
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
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
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
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
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
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center relative z-10">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

