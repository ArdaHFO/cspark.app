# Creator Transformer Frontend

Next.js frontend for the Creator Transformer application. Provides a clean, responsive interface for text extraction and AI-powered content generation.

## Features

- **URL Text Extraction**: Extract clean text from any web page
- **AI Content Generation**: Create summaries, YouTube scripts, and Shorts scripts
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Loading states, error handling, and success notifications
- **Download & Copy**: Easy content export options

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Modern state management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

For production, set this to your deployed backend URL.

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page component
│   └── favicon.ico      # App icon
└── lib/
    └── api.ts           # API client functions
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_BASE=https://your-backend-url`
4. Deploy automatically on git push

### Other Platforms

1. Build the project: `npm run build`
2. Deploy the `.next` folder and `package.json`
3. Set the environment variable for your backend URL

## Configuration

The app connects to the backend API using the `NEXT_PUBLIC_API_BASE` environment variable. Make sure this points to your deployed backend or local development server.

## Development

### Adding New Features

1. API functions go in `src/lib/api.ts`
2. UI components can be added to `src/components/` (create this directory as needed)
3. Global styles are in `src/app/globals.css`
4. Page-specific styles use Tailwind CSS classes

### Customization

- Modify colors and themes in `tailwind.config.js`
- Add custom fonts in `src/app/layout.tsx`
- Extend the API client in `src/lib/api.ts`

## Troubleshooting

### Common Issues

1. **API Connection Error**: Check that `NEXT_PUBLIC_API_BASE` is set correctly
2. **Build Errors**: Ensure all TypeScript types are correct
3. **Styling Issues**: Verify Tailwind CSS classes are properly applied

### Support

For issues and questions, please check:
1. The main project README
2. Next.js documentation
3. GitHub issues
