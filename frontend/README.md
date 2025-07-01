# Simple OpenAI Frontend

A modern, accessible, and modular React/Next.js frontend for the Simple OpenAI Chat application.

## Features

- **Modular Architecture**: Clean separation of concerns with reusable components
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand store for efficient state management
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Light and dark theme with proper contrast
- **Testing**: Jest and React Testing Library setup

## Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── AppShell.tsx     # Main layout component
│   ├── ChatWindow.tsx   # Chat interface container
│   ├── ChatInput.tsx    # Message input component
│   ├── MessageBubble.tsx # Individual message display
│   ├── SettingsDrawer.tsx # Settings modal
│   ├── Navbar.tsx       # Navigation bar
│   ├── ThemeToggle.tsx  # Theme switcher
│   └── FormattedMessage.tsx # Message formatting
├── store/               # State management
│   └── useAppStore.ts   # Zustand store
├── types/               # TypeScript type definitions
│   └── index.ts
├── constants/           # Application constants
│   └── index.ts
├── utils/               # Utility functions
│   └── api.ts
├── settings/            # Settings page
│   └── page.tsx
└── page.tsx             # Main chat page
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Architecture

### Components

- **AppShell**: Main layout wrapper with navigation and content areas
- **ChatWindow**: Container for messages and input area
- **ChatInput**: Form component for sending messages
- **MessageBubble**: Individual message display with proper accessibility
- **SettingsDrawer**: Modal for application settings
- **Navbar**: Navigation with theme toggle

### State Management

The application uses Zustand for state management with the following features:

- **Persistent Storage**: Settings are saved to sessionStorage
- **Type Safety**: Full TypeScript support
- **DevTools**: Redux DevTools integration for debugging
- **Computed Values**: Derived state for UI logic

### API Integration

- **Base URL Detection**: Automatic API URL detection for different environments
- **Error Handling**: Comprehensive error handling and user feedback
- **Streaming Support**: Real-time message streaming from the backend
- **Key Validation**: API key format and validity checking

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape)
- **Focus Management**: Automatic focus management for better UX
- **Color Contrast**: High contrast ratios for better visibility
- **Semantic HTML**: Proper HTML structure and roles

## Testing

The project includes a comprehensive testing setup:

- **Jest**: Test runner with jsdom environment
- **React Testing Library**: Component testing utilities
- **User Event**: Simulated user interactions
- **Coverage Reports**: Code coverage analysis

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (optional, auto-detected in production)

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Add tests for new components and features
3. Ensure accessibility standards are met
4. Update documentation as needed

## Code Quality

The project uses several tools to maintain code quality:

- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Jest**: Unit testing
- **React Testing Library**: Component testing

## Performance

- **Code Splitting**: Automatic code splitting by Next.js
- **Image Optimization**: Built-in image optimization
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Lighthouse**: Aim for 90+ performance score

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is part of the AI Engineer Challenge. 