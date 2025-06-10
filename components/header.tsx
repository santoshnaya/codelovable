"use client"

import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { 
  Menu, 
  Download, 
  Code2, 
  Sparkles,
  Settings,
  User
} from "lucide-react"
import Link from "next/link"

export function Header() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    currentProject, 
    generatedFiles,
    isGenerating 
  } = useAppStore()

  const handleDownload = async () => {
    if (!generatedFiles.length) return

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: generatedFiles,
          projectName: currentProject?.name || 'codelovable-project',
        }),
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentProject?.name || 'project'}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lovable-gradient rounded-lg flex items-center justify-center">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">
              CodeLovable
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>{currentProject.name}</span>
            </div>
          )}
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-lovable-600">
              <div className="w-2 h-2 bg-lovable-500 rounded-full animate-pulse" />
              <span>Generating...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {generatedFiles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              Download ZIP
            </Button>
          )}
          
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}