"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VocabularyItem } from "@/lib/storage-utils"

interface EditVocabularyDialogProps {
  vocabulary: VocabularyItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (vocabulary: VocabularyItem) => void
}

// Generate A-Z alphabet array
const alphabetCategories = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

export default function EditVocabularyDialog({ vocabulary, open, onOpenChange, onSave }: EditVocabularyDialogProps) {
  const [formData, setFormData] = useState<VocabularyItem>({
    id: "",
    word: "",
    definition: "",
    example: "",
    synonyms: "",
    antonyms: "",
    category: "",
    createdAt: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (vocabulary) {
      setFormData(vocabulary)
    }
  }, [vocabulary])

  // Auto-select category based on first letter of word
  useEffect(() => {
    if (formData.word) {
      const firstLetter = formData.word.trim().charAt(0).toUpperCase()
      if (firstLetter && /[A-Z]/.test(firstLetter)) {
        setFormData((prev) => ({ ...prev, category: firstLetter }))
      }
    }
  }, [formData.word])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.word.trim()) {
      newErrors.word = "Word is required"
    }

    if (!formData.definition.trim()) {
      newErrors.definition = "Definition is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl">
        <div className="absolute inset-0 bg-glossy-gradient rounded-lg pointer-events-none"></div>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Vocabulary</DialogTitle>
            <DialogDescription className="text-gray-400">Make changes to your vocabulary word.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 relative z-10">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="word" className="text-right text-gray-300">
                Word
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="word"
                  name="word"
                  value={formData.word}
                  onChange={handleChange}
                  className={`bg-gray-800/50 border-gray-700 ${errors.word ? "border-red-500" : ""}`}
                  required
                />
                {errors.word && <p className="text-xs text-red-500">{errors.word}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="definition" className="text-right text-gray-300">
                Definition
              </Label>
              <div className="col-span-3 space-y-1">
                <Textarea
                  id="definition"
                  name="definition"
                  value={formData.definition}
                  onChange={handleChange}
                  className={`bg-gray-800/50 border-gray-700 ${errors.definition ? "border-red-500" : ""}`}
                  required
                />
                {errors.definition && <p className="text-xs text-red-500">{errors.definition}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="example" className="text-right text-gray-300">
                Example
              </Label>
              <Textarea
                id="example"
                name="example"
                value={formData.example}
                onChange={handleChange}
                className="col-span-3 bg-gray-800/50 border-gray-700"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="synonyms" className="text-right text-gray-300">
                Synonyms
              </Label>
              <Textarea
                id="synonyms"
                name="synonyms"
                value={formData.synonyms}
                onChange={handleChange}
                className="col-span-3 bg-gray-800/50 border-gray-700"
                placeholder="Optional - separate with commas"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="antonyms" className="text-right text-gray-300">
                Antonyms
              </Label>
              <Textarea
                id="antonyms"
                name="antonyms"
                value={formData.antonyms}
                onChange={handleChange}
                className="col-span-3 bg-gray-800/50 border-gray-700"
                placeholder="Optional - separate with commas"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-gray-300">
                Category
              </Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="col-span-3 bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {alphabetCategories.map((letter) => (
                    <SelectItem key={letter} value={letter}>
                      {letter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="col-span-4 text-xs text-gray-500 text-right">
                Category is automatically set based on the first letter of the word
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-primary hover:bg-primary/80 text-black font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

