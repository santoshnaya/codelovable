"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { 
  Plus, 
  Search, 
  Folder, 
  Trash2, 
  Calendar,
  Code2,
  FileText,
  Settings,
  X
} from "lucide-react"
import { formatDate, generateId } from '@/lib/utils'
import toast from 'react-hot-toast'

export function ProjectSidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  const { 
    projects, 
    currentProject, 
    setCurrentProject, 
    addProject, 
    deleteProject,
    sidebarOpen,
    setSidebarOpen
  } = useAppStore()

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required')
      return
    }

    const project = addProject({
      name: newProjectName.trim(),
      description: newProjectDescription.trim(),
      files: [],
      chatHistory: [],
      status: 'draft',
      framework: 'nextjs',
      features: []
    })

    setNewProjectName('')
    setNewProjectDescription('')
    setShowNewProjectForm(false)
    toast.success('Project created successfully!')
  }

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
      toast.success('Project deleted successfully!')
    }
  }

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project)
    // Load project files and chat history
    useAppStore.getState().setGeneratedFiles(project.files)
    useAppStore.getState().chatMessages = project.chatHistory
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500'
      case 'generating':
        return 'text-yellow-500'
      case 'completed':
        return 'text-green-500'
      case 'deployed':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-3 w-3" />
      case 'generating':
        return <Code2 className="h-3 w-3 animate-pulse" />
      case 'completed':
        return <Folder className="h-3 w-3" />
      case 'deployed':
        return <Settings className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-background border-r border-border
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Projects</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* New Project Button */}
          <div className="p-4 border-b border-border">
            {!showNewProjectForm ? (
              <Button
                onClick={() => setShowNewProjectForm(true)}
                className="w-full"
                variant="gradient"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Create New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreateProject}
                      disabled={!newProjectName.trim()}
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowNewProjectForm(false)
                        setNewProjectName('')
                        setNewProjectDescription('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      currentProject?.id === project.id 
                        ? 'ring-2 ring-lovable-500 bg-lovable-50' 
                        : 'hover:border-lovable-300'
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">
                            {project.name}
                          </CardTitle>
                          <div className={`flex items-center gap-1 text-xs mt-1 ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span className="capitalize">{project.status}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteProject(project.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {project.description && (
                      <CardContent className="pt-0 pb-2">
                        <CardDescription className="text-xs line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardContent>
                    )}
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(project.updatedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{project.files.length} files</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}