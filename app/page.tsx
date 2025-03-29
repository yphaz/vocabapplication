import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <BookOpen className="h-6 w-6" />
          <span>VocabVault</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-400 hover:text-primary hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-gray-400 hover:text-primary hover:underline underline-offset-4"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
          <div className="absolute inset-0 bg-glossy-gradient pointer-events-none"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary">
                  Build Your Vocabulary
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Save, organize, and review your vocabulary words in one place. Enhance your language skills with
                  VocabVault.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/80 text-black font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 relative">
                <div className="absolute inset-0 bg-glossy-gradient rounded-lg pointer-events-none"></div>
                <div className="p-2 bg-primary/10 rounded-full relative z-10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">Save Words</h3>
                <p className="text-center text-gray-400 relative z-10">
                  Add new vocabulary words with definitions, examples, and notes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 relative">
                <div className="absolute inset-0 bg-glossy-gradient rounded-lg pointer-events-none"></div>
                <div className="p-2 bg-primary/10 rounded-full relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M14 4v10.54a4 4 0 1 1-4-3.54" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">Review Anytime</h3>
                <p className="text-center text-gray-400 relative z-10">
                  Access your vocabulary list from any device, anywhere.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 relative">
                <div className="absolute inset-0 bg-glossy-gradient rounded-lg pointer-events-none"></div>
                <div className="p-2 bg-primary/10 rounded-full relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 20V4" />
                    <path d="M5 11l7-7 7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">Track Progress</h3>
                <p className="text-center text-gray-400 relative z-10">
                  Organize words by alphabetical categories and track your learning progress.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-black/40">
        <p className="text-xs text-gray-500">© 2023 VocabVault. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-gray-500 hover:text-gray-300 hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-gray-500 hover:text-gray-300 hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

