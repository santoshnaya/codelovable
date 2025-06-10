"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { Send, Bot, User, Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { formatDate } from '@/lib/utils'

export function ChatInterface() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { 
    chatMessages, 
    addChatMessage, 
    isGenerating, 
    setIsGenerating,
    setGeneratedFiles,
    currentProject,
    updateProject
  } = useAppStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage
    })

    // Start generating
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          framework: 'nextjs',
          mode: 'generate',
          projectId: currentProject?.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      const result = await response.json()
      
      // Add assistant response
      addChatMessage({
        role: 'assistant',
        content: result.explanation,
        metadata: {
          generatedFiles: result.files,
          isCodeGeneration: true
        }
      })

      // Update generated files
      setGeneratedFiles(result.files)

      // Update current project if exists
      if (currentProject) {
        updateProject(currentProject.id, {
          files: result.files,
          status: 'completed'
        })
      }
      
    } catch (error) {
      console.error('Generation error:', error)
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating your code. Please make sure you have set up your Anthropic API key and try again.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-lovable-600" />
          <h2 className="font-semibold">AI Assistant</h2>
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-lovable-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-lovable-400" />
            <p className="text-lg font-medium mb-2">Ready to build something amazing?</p>
            <p className="text-sm">
              Describe what you want to create and I'll generate the code for you.
            </p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-lovable-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-lovable-600" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-lovable-600 text-white'
                    : 'bg-muted'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {message.role === 'user' ? (
                    <p className="text-white m-0">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      className="text-foreground [&>*]:m-0 [&>*:not(:last-child)]:mb-2"
                      components={{
                        code: ({ children, className }) => (
                          <code className={`${className} bg-background px-1 py-0.5 rounded text-sm`}>
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-background p-2 rounded text-sm overflow-x-auto">
                            {children}
                          </pre>
                        )
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                
                <div className="text-xs opacity-70 mt-2">
                  {formatDate(message.timestamp)}
                </div>
                
                {message.metadata?.generatedFiles && (
                  <div className="mt-2 text-xs opacity-70">
                    Generated {message.metadata.generatedFiles.length} files
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-lovable-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-lovable-600" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Generating your code...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="min-h-[60px] resize-none"
            disabled={isGenerating}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isGenerating}
            className="h-[60px] w-[60px]"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}