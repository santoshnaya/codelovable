"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { 
  File, 
  Folder, 
  FolderOpen, 
  Copy, 
  Download,
  Code2,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { downloadFile } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileTreeNode[]
  content?: string
  language?: string
}

function buildFileTree(files: any[]): FileTreeNode[] {
  const tree: FileTreeNode[] = []
  const folderMap = new Map<string, FileTreeNode>()

  files.forEach(file => {
    const parts = file.path.split('/')
    let currentPath = ''
    
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}` : part
      
      if (isLast) {
        // It's a file
        const fileNode: FileTreeNode = {
          name: part,
          path: file.path,
          type: 'file',
          content: file.content,
          language: file.language
        }
        
        if (parentPath) {
          const parent = folderMap.get(parentPath)
          if (parent) {
            parent.children = parent.children || []
            parent.children.push(fileNode)
          }
        } else {
          tree.push(fileNode)
        }
      } else {
        // It's a folder
        if (!folderMap.has(currentPath)) {
          const folderNode: FileTreeNode = {
            name: part,
            path: currentPath,
            type: 'folder',
            children: []
          }
          
          folderMap.set(currentPath, folderNode)
          
          if (parentPath) {
            const parent = folderMap.get(parentPath)
            if (parent) {
              parent.children = parent.children || []
              parent.children.push(folderNode)
            }
          } else {
            tree.push(folderNode)
          }
        }
      }
    })
  })

  return tree
}

function FileTreeItem({ 
  node, 
  selectedFile, 
  onFileSelect,
  expandedFolders,
  onToggleFolder 
}: {
  node: FileTreeNode
  selectedFile: string | null
  onFileSelect: (path: string) => void
  expandedFolders: Set<string>
  onToggleFolder: (path: string) => void
}) {
  const isExpanded = expandedFolders.has(node.path)
  
  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="flex items-center gap-1 py-1 px-2 hover:bg-muted rounded cursor-pointer"
          onClick={() => onToggleFolder(node.path)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 text-blue-500" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {isExpanded && node.children && (
          <div className="ml-4">
            {node.children.map((child) => (
              <FileTreeItem
                key={child.path}
                node={child}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 py-1 px-2 hover:bg-muted rounded cursor-pointer ${
        selectedFile === node.path ? 'bg-lovable-100 text-lovable-800' : ''
      }`}
      onClick={() => onFileSelect(node.path)}
    >
      <File className="h-4 w-4 text-gray-500" />
      <span className="text-sm">{node.name}</span>
    </div>
  )
}

export function CodePreview() {
  const { generatedFiles, selectedFile, setSelectedFile } = useAppStore()
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (generatedFiles.length > 0) {
      const tree = buildFileTree(generatedFiles)
      setFileTree(tree)
      
      // Auto-expand all folders initially
      const allFolders = new Set<string>()
      const collectFolders = (nodes: FileTreeNode[]) => {
        nodes.forEach(node => {
          if (node.type === 'folder') {
            allFolders.add(node.path)
            if (node.children) {
              collectFolders(node.children)
            }
          }
        })
      }
      collectFolders(tree)
      setExpandedFolders(allFolders)
      
      // Select first file if none selected
      if (!selectedFile && generatedFiles.length > 0) {
        setSelectedFile(generatedFiles[0].path)
      }
    }
  }, [generatedFiles, selectedFile, setSelectedFile])

  const selectedFileData = generatedFiles.find(f => f.path === selectedFile)

  const handleCopyCode = () => {
    if (selectedFileData?.content) {
      navigator.clipboard.writeText(selectedFileData.content)
      toast.success('Code copied to clipboard!')
    }
  }

  const handleDownloadFile = () => {
    if (selectedFileData) {
      downloadFile(
        selectedFileData.content,
        selectedFileData.path.split('/').pop() || 'file.txt',
        'text/plain'
      )
      toast.success('File downloaded!')
    }
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const getLanguageFromPath = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript'
      case 'jsx':
      case 'js':
        return 'javascript'
      case 'css':
        return 'css'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      case 'html':
        return 'html'
      case 'py':
        return 'python'
      default:
        return 'text'
    }
  }

  if (generatedFiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No code generated yet</p>
          <p className="text-sm">
            Start a conversation to generate your first project
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* File Tree */}
      <div className="w-64 border-r border-border bg-muted/30">
        <div className="p-3 border-b border-border">
          <h3 className="font-medium text-sm">Project Files</h3>
        </div>
        <div className="p-2 overflow-y-auto">
          {fileTree.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
            />
          ))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 flex flex-col">
        {selectedFileData ? (
          <>
            {/* File Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="font-medium text-sm">{selectedFileData.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadFile}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto">
              <SyntaxHighlighter
                language={getLanguageFromPath(selectedFileData.path)}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
                showLineNumbers
                wrapLines
              >
                {selectedFileData.content}
              </SyntaxHighlighter>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Select a file to view</p>
              <p className="text-sm">
                Choose a file from the tree to see its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}