# 🌺 Kona Island Coffee Website

A premium Hawaiian coffee experience brought to the Bay Area. This website features authentic Kona coffee, pastries, and crepes with a complete online ordering system integrated with POS systems.

## ✨ Features

### 🎨 Design & Experience
- **Hawaiian-inspired design** with warm browns, teal accents, and tropical vibes
- **Responsive design** optimized for all devices
- **Smooth animations** powered by Framer Motion with reduced motion support
- **Accessibility-first** with keyboard navigation and screen reader support
- **SEO optimized** with structured data and Open Graph tags

### ☕ Core Functionality
- **Interactive menu** with real-time inventory and pricing
- **Online ordering** with cart, modifiers, and special instructions
- **POS integration** with webhook support for real-time updates
- **Gift cards** with digital delivery and redemption
- **Loyalty program** with points earning and rewards
- **Store locator** with hours, directions, and features
- **Order tracking** with real-time status updates

### 🔧 Technical Features
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with custom design tokens
- **Server-sent events** for real-time updates
- **Webhook handling** with signature verification
- **API-first architecture** ready for mobile apps
- **Production-ready** with error handling and logging

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Custom components with Radix UI primitives
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Fonts:** League Spartan (headings) + Mangabey fallback (body)
- **POS Integration:** Pluggable provider system (Mock, Square, Toast, Clover)
- **Payments:** Stripe integration ready
- **Analytics:** Plausible Analytics ready

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kona-island-coffee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables) section)

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Kona Brown** (`#b87a4b`) - Primary brand color, headlines, buttons
- **Espresso Black** (`#1f1311`) - Body text, dark elements
- **White** (`#ffffff`) - Backgrounds, reverse text
- **Sandy Taupe** (`#c7bab6`) - Neutral backgrounds, dividers
- **Sea-glass Teal** (`#11c9c8`) - CTAs, accents, hover states

### Typography
- **Headings:** League Spartan (bold, geometric, modern)
- **Body:** Mangabey (playful, rounded, friendly) with fallbacks
- **Accent:** Hawaiian script placeholder for future enhancement

### Usage Examples
```tsx
// Components use design tokens
<Button variant="aloha">Order Online</Button>
<Badge variant="popular">Popular</Badge>
<Card className="shadow-kona-soft">...</Card>
```

## 🔌 POS Integration

The website uses a pluggable POS provider system that supports multiple vendors:

### Supported Providers
- **Mock Provider** (for development/testing)
- **Square** (coming soon)
- **Toast** (coming soon)
- **Clover** (coming soon)

### Key Features
- **Real-time inventory** updates via webhooks
- **Order synchronization** with automatic status updates
- **Menu management** with price and availability sync
- **Gift card** issuance and redemption
- **Loyalty points** tracking and rewards

### Configuration
```bash
# .env.local
POS_PROVIDER=mock  # or square, toast, clover
POS_WEBHOOK_SECRET=your-secure-secret
```

## 🛒 Online Ordering Flow

### Customer Journey
1. **Browse Menu** - View items with real-time availability
2. **Customize Order** - Select size, milk, extras, etc.
3. **Add to Cart** - Review selections and pricing
4. **Checkout** - Apply gift cards, loyalty points, tip
5. **Payment** - Secure payment processing
6. **Confirmation** - Order pushed to POS, tracking provided
7. **Updates** - Real-time status via SSE

### API Endpoints
- `POST /api/order/create` - Create new order
- `GET /api/order/status/[id]` - Check order status
- `GET /api/pos/stream` - Real-time updates (SSE)

## 🎁 Gift Cards & Loyalty

### Gift Cards
- **Digital delivery** via email
- **Custom amounts** ($5 - $500)
- **Secure codes** with POS integration
- **Balance tracking** and partial redemption

### Loyalty Program
- **Points earning** (1 point = $1 spent)
- **Rewards redemption** (50 points = $5 off)
- **Balance tracking** across all locations
- **Automatic enrollment** option

## 🌐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

### Required for Development
```bash
POS_PROVIDER=mock
POS_WEBHOOK_SECRET=your-secret-here
```

### Production Requirements
```bash
# POS Integration
POS_PROVIDER=square  # or your POS system
SQUARE_ACCESS_TOKEN=your-token
SQUARE_WEBHOOK_SIGNATURE_KEY=your-key

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=konaislandcoffee.com
```

## 🚢 Deployment

### Vercel (Recommended)
1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - automatic deployment on git push

### Build Commands
```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Check code quality
```

## 🧪 Testing

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## 🌺 Mahalo!

Built with aloha for the Bay Area coffee community. Experience the true taste of Hawaiian Kona coffee! ☕🏄‍♀️
