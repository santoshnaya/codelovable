"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { 
  Code2, 
  Sparkles, 
  Zap, 
  Globe, 
  Database,
  Palette,
  ArrowRight
} from "lucide-react"

const examplePrompts = [
  {
    title: "E-commerce Store",
    description: "Build a modern online store with product catalog and shopping cart",
    prompt: "Create a Next.js e-commerce website with product listings, shopping cart, user authentication, and checkout process. Include a modern design with Tailwind CSS.",
    icon: Globe,
    category: "Full Stack"
  },
  {
    title: "Dashboard App",
    description: "Create an admin dashboard with charts and data visualization",
    prompt: "Build a Next.js admin dashboard with user management, analytics charts, data tables, and a responsive sidebar navigation. Use modern UI components.",
    icon: Database,
    category: "Dashboard"
  },
  {
    title: "Landing Page",
    description: "Design a beautiful landing page for a SaaS product",
    prompt: "Create a modern SaaS landing page with hero section, features, pricing, testimonials, and contact form. Make it responsive and visually appealing.",
    icon: Palette,
    category: "Marketing"
  },
  {
    title: "Blog Platform",
    description: "Build a content management system for blogging",
    prompt: "Create a Next.js blog platform with post creation, editing, categories, tags, comments, and user authentication. Include an admin panel.",
    icon: Code2,
    category: "Content"
  }
]

export function WelcomeScreen() {
  const { addChatMessage, setIsGenerating } = useAppStore()

  const handlePromptClick = (prompt: string) => {
    addChatMessage({
      role: 'user',
      content: prompt
    })
    
    // Trigger code generation
    setIsGenerating(true)
    generateCode(prompt)
  }

  const generateCode = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          framework: 'nextjs',
          mode: 'generate'
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
      useAppStore.getState().setGeneratedFiles(result.files)
      
    } catch (error) {
      console.error('Generation error:', error)
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating your code. Please try again.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-lovable-gradient rounded-2xl flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="gradient-text">CodeLovable</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate complete Next.js applications using natural language. 
            Describe what you want to build, and I'll create the code for you.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-lovable-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-lovable-500" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-lovable-500" />
              <span>Full Stack</span>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examplePrompts.map((example, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-lovable-300 group"
              onClick={() => handlePromptClick(example.prompt)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lovable-100 rounded-lg flex items-center justify-center group-hover:bg-lovable-200 transition-colors">
                      <example.icon className="h-5 w-5 text-lovable-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <div className="text-xs text-lovable-600 font-medium">
                        {example.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-lovable-600 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {example.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Or start with your own idea by typing in the chat
          </p>
          <Button 
            variant="gradient" 
            size="lg"
            onClick={() => {
              // Focus on chat input (we'll implement this later)
              document.querySelector('textarea')?.focus()
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start Building
          </Button>
        </div>
      </div>
    </div>
  )
}