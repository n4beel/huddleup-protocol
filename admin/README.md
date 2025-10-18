# HuddleUp Frontend

A modern Next.js frontend application for the HuddleUp Protocol, built with TypeScript and Tailwind CSS.

## Features

- 🚀 **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design** for all devices
- 🔗 **Client-side Navigation** with Next.js routing
- ⚡ **TypeScript** for type safety
- 🧹 **ESLint** for code quality

## Pages & Routes

- `/` - Home page with welcome content and features
- `/dashboard` - User dashboard with stats and quick actions
- `/profile` - User profile management
- `/social` - Social feed and community features
- `/settings` - Application and account settings

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── profile/           # Profile page
│   ├── settings/          # Settings page
│   ├── social/            # Social page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── Navigation.tsx     # Main navigation component
└── ...
```

## Styling

This project uses **Tailwind CSS** for styling. The design system includes:

- **Color Palette**: Blue primary colors with gray neutrals
- **Typography**: Inter font family
- **Components**: Custom components with consistent spacing
- **Responsive**: Mobile-first responsive design

## Navigation

The application features a responsive navigation bar with:

- **Logo**: HuddleUp branding
- **Navigation Links**: Home, Dashboard, Profile, Social, Settings
- **Active States**: Visual indication of current page
- **Connect Wallet**: Placeholder for Web3 wallet integration

## Components

### Navigation Component

Located at `src/components/Navigation.tsx`, this component provides:

- Responsive navigation bar
- Active page highlighting
- Mobile-friendly design
- Connect wallet button

## Development

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Export a default React component
4. The route will be automatically available

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the established color scheme
- Maintain consistent spacing and typography
- Ensure responsive design for all components

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## Integration

This frontend is designed to work with the HuddleUp backend API:

- **Backend URL**: Configure in environment variables
- **API Endpoints**: RESTful API integration
- **Authentication**: Web3 wallet integration planned
- **Real-time**: WebSocket support for live updates

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Ensure responsive design
4. Test on multiple devices
5. Run linting before committing

## License

This project is part of the HuddleUp Protocol for EthOnline.