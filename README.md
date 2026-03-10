# Quran Researcher 📖

An AI-powered Quranic research assistant built with Next.js, Vercel AI SDK, and Claude.

![Quran Researcher](https://img.shields.io/badge/Quran-Researcher-047857?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)

## Features

### 🔍 Research Capabilities
- **Word Comparison**: Compare similar Arabic words across the Quran
- **Morphological Analysis**: Deep dive into Arabic root patterns and verb forms
- **Semantic Analysis**: Explore word meanings in context
- **Blindspot Analysis**: Discover areas for further research

### 🤖 AI Agent Features
- **Long-term Memory**: Save verses and research context
- **Sub-agent Utilization**: Complex queries handled by specialized sub-agents
- **Detailed Reports**: Comprehensive research output with citations

### 👤 User Features
- **Research History**: Track your research journey
- **Saved Verses**: Bookmark important verses
- **Community Sharing**: Share discoveries with others
- **Report Viewer**: Interactive HTML reports with highlighting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Vercel AI SDK + Anthropic Claude
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL (Prisma)
- **Deployment**: Railway

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quran-researcher.git
cd quran-researcher
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/          # AI chat endpoint
│   ├── community/         # Community page
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # shadcn components
│   ├── chat/              # Chat interface
│   ├── research/          # Research components
│   └── layout/            # Navbar, Sidebar
└── lib/
    ├── ai/                # AI agent & skills
    └── utils.ts           # Utilities
```

## Research Query Types

### Word Comparison
```
Compare "قلب" and "فؤاد" in the Quran
```

### Word Analysis
```
Analyze the root ر-ح-م and its derivatives
```

### Semantic Analysis
```
What is the semantic range of "تقوى"?
```

### Further Analysis
```
Explore the concept of "نور" across different surahs
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Quran data and inspiration from [Quran.com](https://quran.com)
- Built with [Vercel AI SDK](https://sdk.vercel.ai)
- UI components from [shadcn/ui](https://ui.shadcn.com)

---

Made with ❤️ for the Muslim community
