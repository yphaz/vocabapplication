"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import EditVocabularyDialog from "./edit-vocabulary-dialog"
import { getCurrentUser, updateVocabularyItem, type VocabularyItem } from "@/lib/storage-utils"
import { useToast } from "@/hooks/use-toast"

interface VocabularyListProps {
  vocabularies: VocabularyItem[]
  onDelete: (id: string) => void
}

export default function VocabularyList({ vocabularies, onDelete }: VocabularyListProps) {
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<VocabularyItem | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (updatedVocab: VocabularyItem) => {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    const success = updateVocabularyItem(currentUser.id, updatedVocab)

    if (success) {
      // Force a reload of the parent component
      onDelete("") // This is a hack to trigger a reload without actually deleting
      toast({
        title: "Word Updated",
        description: `"${updatedVocab.word}" has been updated successfully.`,
      })
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update the vocabulary word. Please try again.",
        variant: "destructive",
      })
    }

    setEditItem(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Function to render comma-separated items with proper styling
  const renderList = (items: string | undefined) => {
    if (!items) return null

    return items.split(",").map((item, index) => (
      <span key={index} className="inline-block bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs mr-1 mb-1">
        {item.trim()}
      </span>
    ))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vocabularies.map((vocab) => (
        <Card
          key={vocab.id}
          className="overflow-hidden relative bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 shadow-lg"
        >
          <div className="absolute inset-0 bg-glossy-gradient pointer-events-none"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-white">{vocab.word}</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {vocab.category}
              </Badge>
            </div>
            <CardDescription className="text-xs text-gray-400">Added on {formatDate(vocab.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2 relative z-10">
            <p className="text-sm text-gray-300">{vocab.definition}</p>

            {vocab.example && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 italic">&ldquo;{vocab.example}&rdquo;</p>
              </div>
            )}

            {vocab.synonyms && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Synonyms:</p>
                <div className="flex flex-wrap">{renderList(vocab.synonyms)}</div>
              </div>
            )}

            {vocab.antonyms && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Antonyms:</p>
                <div className="flex flex-wrap">{renderList(vocab.antonyms)}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditItem(vocab)}
              className="hover:bg-gray-700 text-gray-400 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(vocab.id)}
              className="hover:bg-gray-700 text-gray-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl">
          <div className="absolute inset-0 bg-glossy-gradient rounded-lg pointer-events-none"></div>
          <AlertDialogHeader className="relative z-10">
            <AlertDialogTitle className="text-primary">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete this vocabulary word from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="relative z-10">
            <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-900 hover:bg-red-800 text-white border-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editItem && (
        <EditVocabularyDialog
          vocabulary={editItem}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  )
}

