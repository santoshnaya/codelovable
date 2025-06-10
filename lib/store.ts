import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, ChatMessage, GeneratedFile, UserProfile, Integration } from './types'
import { generateId } from './utils'

interface AppState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  
  projects: Project[]
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  chatMessages: ChatMessage[]
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChatHistory: () => void
  
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  generatedFiles: GeneratedFile[]
  setGeneratedFiles: (files: GeneratedFile[]) => void
  addGeneratedFile: (file: GeneratedFile) => void
  
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  selectedFile: string | null
  setSelectedFile: (path: string | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      projects: [],
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (projectData) => {
        const project: Project = {
          ...projectData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set(state => ({ 
          projects: [...state.projects, project],
          currentProject: project
        }))
        return project
      },
      updateProject: (id, updates) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates, updatedAt: new Date() }
            : state.currentProject
        }))
      },
      deleteProject: (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject
        }))
      },
      
      chatMessages: [],
      addChatMessage: (messageData) => {
        const message: ChatMessage = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        }
        set(state => ({ 
          chatMessages: [...state.chatMessages, message] 
        }))
      },
      clearChatHistory: () => set({ chatMessages: [] }),
      
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      generatedFiles: [],
      setGeneratedFiles: (files) => set({ generatedFiles: files }),
      addGeneratedFile: (file) => {
        set(state => ({ 
          generatedFiles: [...state.generatedFiles.filter(f => f.path !== file.path), file] 
        }))
      },
      
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      selectedFile: null,
      setSelectedFile: (path) => set({ selectedFile: path }),
    }),
    {
      name: 'codelovable-storage',
      partialize: (state) => ({
        projects: state.projects,
        user: state.user,
      }),
    }
  )
)