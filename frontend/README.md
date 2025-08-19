# Lost & Found Frontend

A modern React.js frontend for the Lost & Found application with a clean, minimalistic design.

## Features

- **Modern React.js** with TypeScript and Vite
- **Responsive Design** with Tailwind CSS
- **Soothing Color Palette** with cyan and teal tones
- **Clean Typography** using Space Grotesk and DM Sans fonts
- **Authentication** with JWT token management
- **Real-time Updates** for item management
- **Search and Filter** functionality

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on port 5000

### Installation

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

## Configuration

The frontend is configured to proxy API requests to `http://localhost:5000`. If your backend runs on a different port, update the `vite.config.ts` file.

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/          # React components
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   └── App.css             # Component styles
├── public/                 # Static assets
├── index.html              # HTML template
└── package.json            # Dependencies
\`\`\`

## Design System

- **Primary Color**: Deep cyan (#164e63)
- **Secondary Color**: Light teal (#5eead4)
- **Background**: Clean white with subtle card backgrounds
- **Typography**: Space Grotesk for headings, DM Sans for body text
- **Layout**: Mobile-first responsive design with flexbox
