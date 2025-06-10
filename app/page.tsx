"use client"

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { ChatInterface } from '@/components/chat-interface'
import { CodePreview } from '@/components/code-preview'
import { ProjectSidebar } from '@/components/project-sidebar'
import { Header } from '@/components/header'
import { WelcomeScreen } from '@/components/welcome-screen'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { currentProject, projects, generatedFiles } = useAppStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingSpinner />
  }

  const hasAnyContent = projects.length > 0 || generatedFiles.length > 0

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ProjectSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        {hasAnyContent ? (
          <div className="flex-1 flex">
            {/* Chat Interface */}
            <div className="w-1/2 border-r border-border">
              <ChatInterface />
            </div>
            
            {/* Code Preview */}
            <div className="w-1/2">
              <CodePreview />
            </div>
          </div>
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  )
}