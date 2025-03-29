"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Download, LogOut, Plus, Search, Upload } from "lucide-react"
import VocabularyList from "@/components/vocabulary-list"
import AddVocabularyDialog from "@/components/add-vocabulary-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getCurrentUser,
  getUserVocabularies,
  addVocabularyItem,
  deleteVocabularyItem,
  removeCurrentUser,
  exportUserData,
  importVocabularyItems,
  type VocabularyItem,
} from "@/lib/storage-utils"
import { useToast } from "@/hooks/use-toast"

// Generate A-Z alphabet array
const alphabetCategories = ["all", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))]

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([])
  const [filteredVocabularies, setFilteredVocabularies] = useState<VocabularyItem[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (!currentUser) {
      console.log("No user logged in, redirecting to login page")
      router.push("/login")
      return
    }

    console.log(`User logged in: ${currentUser.username}`)
    setUser(currentUser)

    // Load user's vocabularies
    loadVocabularies()
  }, [router])

  useEffect(() => {
    if (vocabularies.length) {
      filterVocabularies()
    }
  }, [searchQuery, activeCategory, vocabularies])

  const loadVocabularies = () => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      console.log("Cannot load vocabularies: No user logged in")
      return
    }

    const userVocabs = getUserVocabularies(currentUser.id)
    console.log(`Loaded ${userVocabs.length} vocabulary items for user ${currentUser.username}`)
    setVocabularies(userVocabs)
  }

  const filterVocabularies = () => {
    let filtered = [...vocabularies]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (vocab) =>
          vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vocab.definition.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((vocab) => vocab.category === activeCategory)
    }

    setFilteredVocabularies(filtered)
  }

  const handleLogout = () => {
    removeCurrentUser()
    router.push("/login")
  }

  const handleAddVocabulary = (newVocab: Omit<VocabularyItem, "id" | "createdAt">) => {
    if (!user) return

    const success = addVocabularyItem(user.id, newVocab)

    if (success) {
      loadVocabularies()
      setIsAddDialogOpen(false)
      toast({
        title: "Word Added",
        description: `"${newVocab.word}" has been added to your vocabulary.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to add vocabulary word. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVocabulary = (id: string) => {
    if (!user) return

    const success = deleteVocabularyItem(user.id, id)

    if (success) {
      loadVocabularies()
      toast({
        title: "Word Deleted",
        description: "The vocabulary word has been deleted.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete vocabulary word. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = () => {
    if (!user) return

    const jsonData = exportUserData(user.id)

    if (!jsonData) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      })
      return
    }

    // Create a blob and download link
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vocabvault_export_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)

    toast({
      title: "Export Successful",
      description: "Your vocabulary data has been exported successfully.",
    })
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) {
      return
    }

    setIsImporting(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string
        const success = importVocabularyItems(user.id, jsonData)

        if (success) {
          loadVocabularies()
          toast({
            title: "Import Successful",
            description: "Your vocabulary data has been imported successfully.",
          })
        } else {
          toast({
            title: "Import Failed",
            description: "Failed to import your data. Please check the file format.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Import error:", error)
        toast({
          title: "Import Failed",
          description: "Failed to import your data. Please check the file format.",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }

    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      })
      setIsImporting(false)
    }

    reader.readAsText(file)
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <BookOpen className="h-6 w-6" />
          <span>VocabVault</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium text-gray-300">Welcome, {user.username}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 container py-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">My Vocabulary</h1>
            <p className="text-gray-400">
              You have {vocabularies.length} word{vocabularies.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search words..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px] bg-gray-800/50 border-gray-700 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/80 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Word
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                disabled={isImporting}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? "Importing..." : "Import"}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
          </div>
        </div>

        <div className="relative p-0.5 rounded-lg bg-gradient-to-r from-gray-800 via-primary/30 to-gray-800 mb-6">
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full bg-gray-900 rounded-md"
          >
            <div className="overflow-x-auto">
              <TabsList className="mb-0 w-full justify-start bg-transparent h-auto p-1">
                {alphabetCategories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-md"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeCategory} className="mt-6">
              <VocabularyList vocabularies={filteredVocabularies} onDelete={handleDeleteVocabulary} />

              {filteredVocabularies.length === 0 && (
                <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium text-gray-300">No vocabulary words found</h3>
                  <p className="text-gray-500 mt-1">
                    {vocabularies.length === 0
                      ? "Start by adding your first vocabulary word"
                      : "Try adjusting your search or filters"}
                  </p>
                  {vocabularies.length === 0 && (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="mt-4 bg-primary hover:bg-primary/80 text-black font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Word
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddVocabularyDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddVocabulary} />
    </div>
  )
}

