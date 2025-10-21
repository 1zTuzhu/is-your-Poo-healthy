# AI Copilot Instructions

## Project Overview
This is a health analysis mobile web app built with React + TypeScript + Vite, using a screen-based navigation pattern. The app analyzes uploaded images using simulated AI and provides health recommendations with guest/authenticated modes.

## Architecture Patterns

### Screen-Based Navigation
- Single `App.tsx` orchestrates 5 main screens via `currentScreen` state
- No router - screens are conditionally rendered components
- State flows down through props, callbacks flow up to `App.tsx`
- Key screens: `LoginScreen`, `CameraScreen`, `AnalysisScreen`, `HistoryScreen`, `ProfileScreen`

### State Management Pattern
```tsx
// Central state in App.tsx - lift state for cross-screen data
const [currentScreen, setCurrentScreen] = useState<'camera' | 'analysis' | 'history' | 'profile'>('camera');
const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
const [isGuest, setIsGuest] = useState(false);
```

### Guest vs Authenticated Mode
- Guest mode: no data persistence, limited features
- Authenticated: full history, profile access
- State clearing logic in `handleLogout()` differentiates modes

## UI Component System

### shadcn/ui Structure
- `components/ui/` contains reusable Radix UI components with Tailwind variants
- Use `cn()` utility from `components/ui/utils.ts` for conditional classes
- Button variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Consistent focus states with ring utilities

### Styling Conventions
- Tailwind v4 with CSS custom properties in `styles/globals.css`
- Dark mode support via `next-themes` with `attribute="class"`
- Color scheme: CSS custom properties (--primary, --secondary, etc.)
- Component-scoped styling over global CSS

## Development Workflow

### Build & Dev Commands
```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

### File Structure
- `/components/ui/` - Reusable UI primitives (shadcn/ui)
- `/components/figma/` - Design system components from Figma
- `/components/[Screen].tsx` - Main application screens
- `/styles/globals.css` - Theme variables and global styles

## Key Implementation Details

### Image Handling
- File upload simulation via hidden input + FileReader API
- `ImageWithFallback` component with base64 fallback SVG
- Preview state management before analysis

### Analysis Simulation
- Mock AI analysis with progress animation (200ms intervals)
- `AnalysisResult` interface defines health data structure
- Bristol scale typing, color/shape analysis, health recommendations

### Toast Notifications
- Sonner library for user feedback
- Consistent Chinese text for user-facing messages
- Success/error states for form validation and actions

## Component Props Pattern
Pass screen navigation handlers down through props:
```tsx
interface ScreenProps {
  onBackToCamera: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  isGuest: boolean;
}
```

## Internationalization Note
UI text is in Chinese - maintain language consistency when adding features. Error messages and user feedback use Chinese characters.