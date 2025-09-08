# SampleSafe - Music Sample Clearance Platform

SampleSafe is a comprehensive Frame mini-app for remix artists to manage music sample clearance and invoicing, streamlining the legal and payment processes.

## 🎵 Features

### Core Features
- **Sample Discovery & Rights Management**: Upload audio files and let AI identify potential samples with centralized tracking
- **Automated Clearance Request Routing**: Streamlined communication and negotiation with rights holders
- **Intelligent License Fee Calculation**: AI-powered fair fee calculation based on usage and industry standards
- **Integrated Payment Gateway & Tracking**: Seamless payment collection via on-chain and fiat methods

### Technical Features
- **AI-Powered Sample Analysis**: OpenAI/Anthropic integration for sample identification
- **IPFS Document Storage**: Decentralized storage for legal documents via Pinata
- **Multi-Payment Support**: Stripe for fiat, Turnkey for on-chain payments
- **Real-time Database**: Supabase integration with Row Level Security
- **Wallet Integration**: WalletConnect support for Web3 authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (for fiat payments)
- Pinata account (for IPFS storage)
- WalletConnect project ID

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd samplesafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # Payment Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # IPFS Configuration
   PINATA_JWT=your_pinata_jwt_token
   PINATA_GATEWAY_URL=https://your_gateway.mypinata.cloud
   
   # WalletConnect Configuration
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Enable Row Level Security (RLS) policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI/Anthropic for sample analysis
- **Payments**: Stripe (fiat), Turnkey (on-chain)
- **Storage**: Pinata (IPFS)
- **Authentication**: WalletConnect

### Project Structure
```
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── samples/        # Sample management
│   │   ├── invoices/       # Invoice handling
│   │   ├── payments/       # Payment processing
│   │   └── upload/         # File upload
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application
├── components/             # React components
│   ├── AppShell.tsx        # Main app container
│   ├── SampleListItem.tsx  # Sample display component
│   ├── InvoiceCard.tsx     # Invoice display component
│   ├── PaymentButton.tsx   # Payment processing
│   └── ...
├── lib/                    # Utility libraries
│   ├── supabase.ts         # Database client
│   ├── ai.ts               # AI integration
│   ├── payments.ts         # Payment processing
│   ├── pinata.ts           # IPFS integration
│   └── types.ts            # TypeScript types
├── database/
│   └── schema.sql          # Database schema
└── README.md
```

## 📊 Database Schema

### Core Tables
- **users**: User profiles and subscription tiers
- **samples**: Audio samples and analysis results
- **rights_holders**: Music rights holder information
- **invoices**: Payment invoices and tracking
- **clearance_requests**: Sample clearance communications

### Key Relationships
- Users have many Samples and Invoices
- Samples belong to Users and have associated Invoices
- Rights Holders manage multiple Samples
- Invoices link Samples, Users, and Rights Holders

## 🔌 API Endpoints

### Authentication
- `POST /api/auth` - Create or authenticate user
- `GET /api/auth?walletAddress=...` - Get user by wallet
- `PUT /api/auth` - Update user profile

### Samples
- `GET /api/samples?userId=...` - Get user's samples
- `POST /api/samples` - Upload and analyze new sample
- `POST /api/samples/[id]/clearance` - Submit clearance request

### Invoices
- `GET /api/invoices?userId=...` - Get user's invoices
- `POST /api/invoices` - Create new invoice

### Payments
- `POST /api/payments` - Process payment
- `POST /api/payments/intent` - Create payment intent

### Upload
- `POST /api/upload` - Upload files to IPFS

## 💳 Payment Integration

### Fiat Payments (Stripe)
- Credit/debit card processing
- Automatic fee calculation (2.9% + $0.30)
- Payment intent creation and confirmation
- Refund support

### On-Chain Payments (Turnkey)
- USDC payments on Base network
- Wallet integration via WalletConnect
- Gas fee estimation
- Transaction tracking

## 🔒 Security Features

### Database Security
- Row Level Security (RLS) policies
- User data isolation
- Encrypted sensitive data

### API Security
- Input validation and sanitization
- File type and size restrictions
- Rate limiting (recommended for production)

### Payment Security
- PCI DSS compliant via Stripe
- Secure key management
- Transaction verification

## 🎨 Design System

### Color Palette
- **Background**: `hsl(225, 7%, 95%)`
- **Primary**: `hsl(220, 88%, 50%)`
- **Accent**: `hsl(170, 70%, 45%)`
- **Surface**: `hsl(0, 0%, 100%)`

### Components
- **AppShell**: Main application container with glass effect
- **SampleListItem**: Sample display with status indicators
- **InvoiceCard**: Invoice display with payment actions
- **PaymentButton**: Multi-method payment processing

## 🚀 Deployment

### Environment Setup
1. Set up production environment variables
2. Configure Supabase production database
3. Set up Stripe webhook endpoints
4. Configure IPFS gateway settings

### Recommended Platforms
- **Vercel**: Optimal for Next.js deployment
- **Railway**: Good alternative with database support
- **Netlify**: Static site deployment option

### Production Checklist
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Stripe webhooks configured
- [ ] IPFS gateway accessible
- [ ] SSL certificates installed
- [ ] Rate limiting implemented
- [ ] Error monitoring setup

## 🧪 Testing

### Running Tests
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run lint        # Run linting
```

### Test Coverage
- API endpoint testing
- Component unit tests
- Payment flow integration tests
- Database operation tests

## 📈 Business Model

### Pricing Tiers
- **Pay-per-clearance**: $5-$15 per sample
- **Unlimited**: $29/month for unlimited clearances
- **Premium**: $49/month with advanced features

### Revenue Streams
- Per-transaction fees
- Subscription revenue
- Premium feature access
- API usage fees

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use the established design system
- Write comprehensive tests
- Document API changes
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- [API Documentation](./docs/api.md)
- [Component Guide](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

### Community
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Discord community (coming soon)

### Professional Support
For enterprise support and custom implementations, contact our team.

---

**SampleSafe** - Clear music samples legally, get paid hassle-free. 🎵
