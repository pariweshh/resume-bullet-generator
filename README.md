# Resume Bullet Generator

An AI-powered micro-SaaS that transforms job descriptions into tailored, quantified resume bullet points. Built with Next.js 16, OpenAI GPT-4o-mini, and LemonSqueezy payments.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **AI-Powered Generation**: Uses GPT-4o-mini to create STAR-format resume bullets
- **ATS Optimized**: Keywords matched to job descriptions for better ATS scores
- **Quantified Results**: Every bullet includes metrics and impact numbers
- **Freemium Model**: 3 free generations/day, paid tiers for more
- **One-Time Payments**: No subscriptions via LemonSqueezy
- **Completely Anonymous**: No accounts required, license key based

## 🛠 Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack) |
| Frontend   | React 19, Tailwind CSS 4           |
| AI         | OpenAI GPT-4o-mini                 |
| Database   | Upstash Redis (serverless)         |
| Payments   | LemonSqueezy                       |
| Deployment | Vercel                             |

## 📁 Project Structure

```
resume-bullet-generator/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # Main generation endpoint
│   │   ├── webhook/route.ts     # LemonSqueezy webhooks
│   │   └── verify-license/route.ts
│   ├── success/page.tsx         # Post-purchase page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Tailwind + custom styles
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   └── icons.tsx
│   ├── generator-form.tsx       # Main input form
│   ├── bullet-results.tsx       # Results display
│   ├── paywall-modal.tsx        # Upgrade modal
│   ├── license-key-input.tsx    # License verification
│   ├── header.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── how-it-works-section.tsx
│   ├── pricing-section.tsx
│   └── error-alert.tsx
├── lib/
│   ├── openai.ts                # OpenAI client & helpers
│   ├── prompts.ts               # AI prompt templates
│   ├── redis.ts                 # Upstash client & usage tracking
│   ├── lemonsqueezy.ts          # Payment integration
│   ├── validation.ts            # Zod schemas
│   └── utils.ts                 # Utility functions
├── .env.example                 # Environment template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9 or higher
- npm or pnpm
- OpenAI API key
- Upstash account (free)
- LemonSqueezy account (free)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/resume-bullet-generator.git
cd resume-bullet-generator
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# LemonSqueezy
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_VARIANT_BASIC=...
LEMONSQUEEZY_VARIANT_LIFETIME=...
NEXT_PUBLIC_CHECKOUT_URL_BASIC=https://...
NEXT_PUBLIC_CHECKOUT_URL_LIFETIME=https://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔧 Configuration

### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env.local` as `OPENAI_API_KEY`
4. Add billing (required for API access)

**Estimated costs**: ~$0.001 per generation (~$5/month at 5,000 generations)

### Upstash Redis Setup

1. Create account at [Upstash](https://console.upstash.com/)
2. Create a new Redis database (free tier)
3. Go to "REST API" tab
4. Copy URL and Token to `.env.local`

**Free tier limits**: 10,000 requests/day

### LemonSqueezy Setup

1. Create store at [LemonSqueezy](https://app.lemonsqueezy.com/)
2. Create two products:
   - **Basic** - $9.99 one-time, 50 generations
   - **Lifetime** - $19.99 one-time, unlimited
3. Set up webhook:
   - URL: `https://yourdomain.com/api/webhook`
   - Events: `order_created`
4. Copy all IDs to `.env.local`

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add all environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production URL
2. Update LemonSqueezy webhook URL to production
3. Test the full purchase flow with test mode

## 🧪 Testing

### Test Free Tier

1. Open the app
2. Enter a job description and experience
3. Generate bullets (3 times)
4. Verify paywall appears on 4th attempt

### Test Paid Flow

1. Enable LemonSqueezy test mode
2. Complete a test purchase
3. Verify webhook creates license
4. Enter license key
5. Verify unlimited generations

### Test License Key

```bash
# Verify a license via API
curl -X POST http://localhost:3000/api/verify-license \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "XXXX-XXXX-XXXX-XXXX"}'
```

## 📊 Analytics & Monitoring

### Track Daily Stats (Optional)

The app tracks daily generation counts in Redis. Query with:

```javascript
// Get today's stats
const today = new Date().toISOString().split("T")[0]
const count = await redis.get(`stats:daily:${today}`)
```

### Recommended Tools

- **Vercel Analytics**: Built-in, free tier available
- **Plausible/Umami**: Privacy-friendly analytics
- **Sentry**: Error tracking

## 💰 Pricing Strategy

| Tier     | Price  | Generations | Target Customer              |
| -------- | ------ | ----------- | ---------------------------- |
| Free     | $0     | 3/day       | Try before buy               |
| Basic    | $9.99  | 50 total    | Single job search            |
| Lifetime | $19.99 | Unlimited   | Career changers, power users |

**Revenue projections** (conservative):

- Month 1-3: ~$300-500/month
- Month 4-6: ~$1,000-2,000/month (SEO kicks in)

## 🔒 Security

- Webhook signatures verified with HMAC-SHA256
- License keys use cryptographically secure random generation
- Rate limiting prevents API abuse (10 req/min per IP)
- Input validation with Zod prevents injection
- No sensitive data stored client-side (only license key)

## 🛣 Roadmap

- [ ] Email delivery of license keys
- [ ] Multiple output formats (LinkedIn, cover letters)
- [ ] Chrome extension
- [ ] Bulk generation for multiple jobs
- [ ] Team/enterprise tier

## 📄 License

MIT License - feel free to use this as a template for your own micro-SaaS!

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

- Create an issue for bugs
- Discussions for questions
- Email: support@example.com

---

Built with ❤️ as a side hustle project
