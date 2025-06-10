export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    generatedFiles?: GeneratedFile[]
    isCodeGeneration?: boolean
    isDebugging?: boolean
  }
}

export interface GeneratedFile {
  path: string
  content: string
  language: string
  description?: string
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  files: GeneratedFile[]
  chatHistory: ChatMessage[]
  deploymentUrl?: string
  githubUrl?: string
  status: 'draft' | 'generating' | 'completed' | 'deployed'
  framework: 'nextjs' | 'react' | 'vue' | 'svelte'
  features: string[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  tier: 'free' | 'pro' | 'team'
  projectsCount: number
  maxProjects: number
  apiUsage: {
    current: number
    limit: number
    resetDate: Date
  }
}

export interface CodeGenerationRequest {
  prompt: string
  projectId?: string
  framework: string
  features?: string[]
  existingFiles?: GeneratedFile[]
  mode: 'generate' | 'debug' | 'modify'
}

export interface CodeGenerationResponse {
  files: GeneratedFile[]
  explanation: string
  suggestions: string[]
  packageJson?: {
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    scripts: Record<string, string>
  }
}

export interface Integration {
  id: string
  name: string
  type: 'github' | 'vercel' | 'netlify'
  connected: boolean
  config: Record<string, any>
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'github-pages'
  domain?: string
  envVars?: Record<string, string>
  buildCommand?: string
  outputDir?: string
}

export interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileTreeNode[]
  content?: string
  language?: string
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  category: 'web-app' | 'api' | 'component' | 'landing-page' | 'dashboard'
  prompt: string
  framework: string[]
  tags: string[]
}