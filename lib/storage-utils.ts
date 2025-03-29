import CryptoJS from "crypto-js"

// Secret key for encryption (in a real app, this would be an environment variable)
const STORAGE_SECRET_KEY = "vocabvault_secret_key_2024"

// User data structure
export interface User {
  id: string
  username: string
  email: string
  password: string // Hashed password
  vocabularies: VocabularyItem[]
}

export interface VocabularyItem {
  id: string
  word: string
  definition: string
  example?: string
  synonyms?: string
  antonyms?: string
  category: string
  createdAt: string
}

export interface CurrentUser {
  id: string
  username: string
  email: string
}

// Hash password using SHA-256
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString()
}

// Encrypt data before storing
export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), STORAGE_SECRET_KEY).toString()
}

// Decrypt data after retrieving
export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, STORAGE_SECRET_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error("Error decrypting data:", error)
    return null
  }
}

// Initialize the app with default data if none exists
export const initializeApp = (): void => {
  try {
    // Check if users data exists
    const existingUsers = localStorage.getItem("vocabvault_users")
    if (!existingUsers) {
      // Create empty users array and save it
      saveUsers([])
      console.log("Initialized app with empty users array")
    }
  } catch (error) {
    console.error("Error initializing app:", error)
  }
}

// Save users data to localStorage (encrypted)
export const saveUsers = (users: User[]): void => {
  try {
    if (!Array.isArray(users)) {
      console.error("Attempted to save non-array users data")
      return
    }

    const encryptedUsers = encryptData(users)
    localStorage.setItem("vocabvault_users", encryptedUsers)
    console.log(`Saved ${users.length} users to localStorage`)
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

// Get users data from localStorage (decrypted)
export const getUsers = (): User[] => {
  try {
    const encryptedUsers = localStorage.getItem("vocabvault_users")
    if (!encryptedUsers) {
      console.log("No users found in localStorage, initializing empty array")
      return []
    }

    const users = decryptData(encryptedUsers)
    if (!Array.isArray(users)) {
      console.error("Decrypted users data is not an array, resetting")
      saveUsers([])
      return []
    }

    return users
  } catch (error) {
    console.error("Error getting users:", error)
    // If there's an error, return an empty array to prevent crashes
    return []
  }
}

// Save current user to localStorage (encrypted)
export const saveCurrentUser = (user: CurrentUser): void => {
  try {
    const encryptedUser = encryptData(user)
    localStorage.setItem("vocabvault_current_user", encryptedUser)
  } catch (error) {
    console.error("Error saving current user:", error)
  }
}

// Get current user from localStorage (decrypted)
export const getCurrentUser = (): CurrentUser | null => {
  try {
    const encryptedUser = localStorage.getItem("vocabvault_current_user")
    if (!encryptedUser) return null

    return decryptData(encryptedUser)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Remove current user from localStorage
export const removeCurrentUser = (): void => {
  localStorage.removeItem("vocabvault_current_user")
}

// Add a vocabulary item for a user
export const addVocabularyItem = (userId: string, vocabulary: Omit<VocabularyItem, "id" | "createdAt">): boolean => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) return false

    const newVocab = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...vocabulary,
    }

    users[userIndex].vocabularies = [newVocab, ...users[userIndex].vocabularies]
    saveUsers(users)
    return true
  } catch (error) {
    console.error("Error adding vocabulary:", error)
    return false
  }
}

// Update a vocabulary item
export const updateVocabularyItem = (userId: string, vocabulary: VocabularyItem): boolean => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) return false

    const vocabIndex = users[userIndex].vocabularies.findIndex((v) => v.id === vocabulary.id)

    if (vocabIndex === -1) return false

    users[userIndex].vocabularies[vocabIndex] = vocabulary
    saveUsers(users)
    return true
  } catch (error) {
    console.error("Error updating vocabulary:", error)
    return false
  }
}

// Delete a vocabulary item
export const deleteVocabularyItem = (userId: string, vocabularyId: string): boolean => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) return false

    users[userIndex].vocabularies = users[userIndex].vocabularies.filter((v) => v.id !== vocabularyId)
    saveUsers(users)
    return true
  } catch (error) {
    console.error("Error deleting vocabulary:", error)
    return false
  }
}

// Get all vocabulary items for a user
export const getUserVocabularies = (userId: string): VocabularyItem[] => {
  try {
    const users = getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) return []

    return user.vocabularies
  } catch (error) {
    console.error("Error getting vocabularies:", error)
    return []
  }
}

// Export user data as JSON
export const exportUserData = (userId: string): string => {
  try {
    const users = getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) return ""

    // Create a safe export object (without password)
    const exportData = {
      username: user.username,
      email: user.email,
      vocabularies: user.vocabularies,
      exportDate: new Date().toISOString(),
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error("Error exporting user data:", error)
    return ""
  }
}

// Import vocabulary items from JSON
export const importVocabularyItems = (userId: string, jsonData: string): boolean => {
  try {
    const importedData = JSON.parse(jsonData)

    if (!importedData || !Array.isArray(importedData.vocabularies)) {
      return false
    }

    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) return false

    // Add imported vocabularies with new IDs to prevent duplicates
    const importedVocabs = importedData.vocabularies.map((vocab: any) => ({
      ...vocab,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: vocab.createdAt || new Date().toISOString(),
    }))

    users[userIndex].vocabularies = [...importedVocabs, ...users[userIndex].vocabularies]
    saveUsers(users)
    return true
  } catch (error) {
    console.error("Error importing vocabulary items:", error)
    return false
  }
}

