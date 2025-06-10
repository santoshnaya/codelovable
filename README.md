# CodeLovable

An AI-powered Next.js web platform that allows users to generate code files, scaffold projects, and deploy full-stack Next.js apps using natural-language prompts with the Claude Sonnet model—mirroring the Lovable.dev experience.

## Features

### 🤖 AI-Powered Code Generation
- Generate complete Next.js applications using natural language prompts
- Powered by Claude Sonnet for intelligent code generation
- Support for TypeScript, React components, and modern web technologies

### 💬 Chat Interface
- Intuitive chat-based interaction with the AI
- Real-time code generation feedback
- Message history and conversation management
- Markdown support for rich text responses

### 📁 Project Management
- Create and manage multiple projects
- Project search and filtering
- File organization and structure
- Project status tracking (draft, generating, completed, deployed)

### 🔍 Code Preview
- Syntax-highlighted code viewer
- File tree navigation
- Copy and download individual files
- Support for multiple programming languages

### 📦 Export & Download
- Download complete projects as ZIP files
- Individual file downloads
- Ready-to-run Next.js applications

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Dark/light theme support
- Gradient accents inspired by Lovable.dev
- Smooth animations and transitions
- Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand
- **AI Integration**: Anthropic Claude API
- **Code Highlighting**: Prism.js
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/santoshnaya/codelovable.git
cd codelovable
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting an Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Usage

### Basic Code Generation

1. **Start a New Project**: Click "New Project" in the sidebar or use one of the example prompts
2. **Describe Your App**: Type a natural language description of what you want to build
3. **Review Generated Code**: Browse the generated files in the code preview panel
4. **Download**: Click "Download ZIP" to get your complete project

### Example Prompts

- "Create a Next.js e-commerce website with product listings, shopping cart, and checkout"
- "Build a dashboard with user management, analytics charts, and data tables"
- "Generate a blog platform with post creation, categories, and comments"
- "Create a landing page for a SaaS product with pricing and testimonials"

### Project Management

- **Create Projects**: Use the sidebar to create and organize multiple projects
- **Search**: Find projects quickly using the search functionality
- **Switch Projects**: Click on any project to switch context and view its files
- **Delete Projects**: Remove projects you no longer need

## API Endpoints

### POST /api/generate
Generate code based on natural language prompts.

**Request Body:**
```json
{
  "prompt": "Create a Next.js blog with authentication",
  "framework": "nextjs",
  "mode": "generate",
  "features": ["auth", "blog", "responsive"]
}
```

**Response:**
```json
{
  "files": [
    {
      "path": "app/page.tsx",
      "content": "...",
      "language": "typescript",
      "description": "Main page component"
    }
  ],
  "explanation": "Generated a complete blog application...",
  "suggestions": ["Add SEO optimization", "Implement search"],
  "packageJson": {
    "dependencies": {...},
    "devDependencies": {...}
  }
}
```

### POST /api/download
Download generated projects as ZIP files.

**Request Body:**
```json
{
  "files": [...],
  "projectName": "my-project"
}
```

## Architecture

### Component Structure
```
components/
├── ui/                 # Reusable UI components
├── chat-interface.tsx  # Chat functionality
├── code-preview.tsx    # Code viewer and file tree
├── project-sidebar.tsx # Project management
├── header.tsx          # Navigation and actions
└── welcome-screen.tsx  # Getting started screen
```

### State Management
The application uses Zustand for state management with the following stores:
- **Projects**: Project creation, updates, and deletion
- **Chat**: Message history and conversation state
- **Files**: Generated code files and file selection
- **UI**: Sidebar state, loading states, and preferences

### AI Integration
Code generation is handled through the Anthropic Claude API with:
- Structured prompts for consistent output
- Error handling and retry logic
- Response parsing and validation
- File structure generation

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
4. Deploy!

The application includes a `vercel.json` configuration file for optimal deployment.

## Customization

### Adding New Prompt Templates
Edit `components/welcome-screen.tsx` to add new example prompts:

```typescript
const examplePrompts = [
  {
    title: "Your Template",
    description: "Description of what it builds",
    prompt: "Detailed prompt for Claude",
    icon: YourIcon,
    category: "Category"
  }
]
```

### Styling
The application uses Tailwind CSS with custom color schemes. Modify `tailwind.config.js` to customize:
- Color palette
- Animations
- Component styles
- Responsive breakpoints

### Theme Configuration
Colors and themes are defined in `app/globals.css` with CSS custom properties for easy customization.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [Lovable.dev](https://lovable.dev)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

## Support

For support, please open an issue on GitHub or contact the development team.

---

**CodeLovable** - Generate beautiful Next.js applications with AI ✨ 