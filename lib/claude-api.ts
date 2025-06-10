import Anthropic from '@anthropic-ai/sdk'
import { CodeGenerationRequest, CodeGenerationResponse, GeneratedFile } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
  try {
    const systemPrompt = `You are an expert Next.js developer. Generate complete, production-ready code based on user requirements.

IMPORTANT RULES:
1. Always generate complete, functional files
2. Include all necessary imports and dependencies
3. Use TypeScript for all files
4. Follow Next.js 14 App Router conventions
4. Use Tailwind CSS for styling
5. Include proper error handling
6. Generate a package.json with all required dependencies
7. Provide clear file structure

When generating files, format your response as JSON with this exact structure:
{
  "files": [
    {
      "path": "relative/path/to/file.tsx",
      "content": "file content here",
      "language": "typescript",
      "description": "Brief description of the file"
    }
  ],
  "explanation": "Clear explanation of what was generated",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "packageJson": {
    "dependencies": {"package": "version"},
    "devDependencies": {"package": "version"},
    "scripts": {"script": "command"}
  }
}`

    const userPrompt = `Generate a ${request.framework} application with the following requirements:

${request.prompt}

${request.features?.length ? `Required features: ${request.features.join(', ')}` : ''}

${request.existingFiles?.length ? 
  `Existing files to consider:\n${request.existingFiles.map(f => `- ${f.path}: ${f.description}`).join('\n')}` 
  : ''}

Mode: ${request.mode}
Framework: ${request.framework}

Please generate all necessary files with complete, working code.`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from the response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Claude response')
    }

    const parsedResponse = JSON.parse(jsonMatch[0]) as CodeGenerationResponse
    
    // Validate the response structure
    if (!parsedResponse.files || !Array.isArray(parsedResponse.files)) {
      throw new Error('Invalid response structure from Claude')
    }

    return parsedResponse
  } catch (error) {
    console.error('Error generating code with Claude:', error)
    throw new Error('Failed to generate code. Please try again.')
  }
}

export async function debugCode(code: string, errorMessage: string, context?: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert developer helping debug code issues. Provide clear, actionable solutions.`

    const userPrompt = `I'm having an issue with this code:

\`\`\`
${code}
\`\`\`

Error: ${errorMessage}

${context ? `Additional context: ${context}` : ''}

Please help me fix this issue and explain what went wrong.`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return content.text
  } catch (error) {
    console.error('Error debugging code with Claude:', error)
    throw new Error('Failed to debug code. Please try again.')
  }
}

export async function modifyCode(
  existingCode: string,
  modification: string,
  filePath: string
): Promise<{ content: string; explanation: string }> {
  try {
    const systemPrompt = `You are an expert developer helping modify existing code. Make precise changes while maintaining code quality and functionality.`

    const userPrompt = `Please modify this existing code:

File: ${filePath}
\`\`\`
${existingCode}
\`\`\`

Requested modification: ${modification}

Please provide the updated code and explain what changes were made.`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract code from response (assuming it's wrapped in code blocks)
    const codeMatch = content.text.match(/```[\s\S]*?\n([\s\S]*?)```/)
    const updatedCode = codeMatch ? codeMatch[1] : existingCode

    return {
      content: updatedCode,
      explanation: content.text,
    }
  } catch (error) {
    console.error('Error modifying code with Claude:', error)
    throw new Error('Failed to modify code. Please try again.')
  }
}