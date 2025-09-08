# SampleSafe Deployment Guide

This guide covers the complete deployment process for SampleSafe, from development to production.

## 🚀 Production Deployment

### Prerequisites

Before deploying to production, ensure you have:

- [ ] Supabase production project set up
- [ ] Stripe account with live keys
- [ ] Pinata account with production gateway
- [ ] OpenAI API key with sufficient credits
- [ ] WalletConnect project configured
- [ ] Domain name (optional but recommended)

### Step 1: Database Setup

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com/dashboard
   # Create new project
   # Note down your project URL and anon key
   ```

2. **Run Database Schema**
   - Open Supabase SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Execute the script
   - Verify all tables are created

3. **Configure Row Level Security**
   ```sql
   -- Verify RLS is enabled on all tables
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

### Step 2: Environment Configuration

Create production environment variables:

```env
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key

# Payment Configuration (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
DEFAULT_RECIPIENT_ADDRESS=0x_your_production_wallet_address

# IPFS Configuration
PINATA_JWT=your_pinata_jwt_token
PINATA_GATEWAY_URL=https://your-gateway.mypinata.cloud

# Turnkey Configuration
TURNKEY_API_KEY=your_turnkey_api_key
TURNKEY_PRIVATE_KEY=your_turnkey_private_key

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=SampleSafe
```

### Step 3: Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all production environment variables
   - Ensure they're set for "Production" environment

3. **Configure Domains**
   - Add your custom domain in Vercel Dashboard
   - Update DNS records as instructed
   - Enable HTTPS (automatic with Vercel)

### Step 4: Stripe Configuration

1. **Webhook Setup**
   ```bash
   # Webhook endpoint
   https://your-domain.com/api/webhooks/stripe
   
   # Events to listen for:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - invoice.payment_succeeded
   - invoice.payment_failed
   ```

2. **Test Webhook**
   ```bash
   # Use Stripe CLI to test
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Step 5: Security Hardening

1. **API Rate Limiting**
   ```typescript
   // Add to middleware.ts
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";
   
   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, "10 s"),
   });
   ```

2. **CORS Configuration**
   ```typescript
   // next.config.mjs
   const nextConfig = {
     async headers() {
       return [
         {
           source: "/api/:path*",
           headers: [
             { key: "Access-Control-Allow-Origin", value: "https://your-domain.com" },
             { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
             { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
           ],
         },
       ];
     },
   };
   ```

3. **Input Validation**
   ```typescript
   // Add validation middleware
   import { z } from "zod";
   
   const sampleSchema = z.object({
     userId: z.string().uuid(),
     file: z.instanceof(File),
   });
   ```

### Step 6: Monitoring Setup

1. **Error Tracking**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Performance Monitoring**
   ```typescript
   // Add to next.config.mjs
   const { withSentryConfig } = require("@sentry/nextjs");
   
   module.exports = withSentryConfig(nextConfig, {
     silent: true,
     org: "your-org",
     project: "samplesafe",
   });
   ```

3. **Uptime Monitoring**
   - Set up monitoring with Uptime Robot or similar
   - Monitor key endpoints:
     - `/api/health`
     - `/api/samples`
     - `/api/payments`

## 🧪 Staging Environment

### Setup Staging

1. **Create Staging Branch**
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. **Deploy to Staging**
   ```bash
   # Deploy staging branch to Vercel
   vercel --target staging
   ```

3. **Staging Environment Variables**
   ```env
   # Use test/sandbox keys for staging
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_APP_URL=https://staging-samplesafe.vercel.app
   ```

### Testing Checklist

- [ ] User registration and authentication
- [ ] Sample upload and analysis
- [ ] Clearance request generation
- [ ] Invoice creation
- [ ] Payment processing (both fiat and crypto)
- [ ] IPFS document storage
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Performance benchmarks

## 🔧 Alternative Deployment Options

### Railway Deployment

1. **Connect Repository**
   ```bash
   # Go to railway.app
   # Connect GitHub repository
   # Select branch for deployment
   ```

2. **Configure Build**
   ```json
   // railway.json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health"
     }
   }
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     samplesafe:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       env_file:
         - .env.production
   ```

## 📊 Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   ```bash
   npm install @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

2. **Image Optimization**
   ```typescript
   // next.config.mjs
   const nextConfig = {
     images: {
       domains: ['your-gateway.mypinata.cloud'],
       formats: ['image/webp', 'image/avif'],
     },
   };
   ```

3. **Caching Strategy**
   ```typescript
   // Add Redis caching
   import { Redis } from "@upstash/redis";
   
   const redis = Redis.fromEnv();
   
   export async function getCachedSample(sampleId: string) {
     const cached = await redis.get(`sample:${sampleId}`);
     if (cached) return JSON.parse(cached);
     
     // Fetch from database
     const sample = await fetchSample(sampleId);
     await redis.setex(`sample:${sampleId}`, 3600, JSON.stringify(sample));
     
     return sample;
   }
   ```

### Database Optimization

1. **Connection Pooling**
   ```typescript
   // lib/supabase.ts
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
       db: {
         schema: 'public',
       },
       auth: {
         persistSession: false,
       },
     }
   );
   ```

2. **Query Optimization**
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX CONCURRENTLY idx_samples_user_status 
   ON samples(user_id, clearance_status);
   
   CREATE INDEX CONCURRENTLY idx_invoices_status_created 
   ON invoices(status, created_at DESC);
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check Supabase connection
   curl -H "apikey: YOUR_ANON_KEY" \
        -H "Authorization: Bearer YOUR_ANON_KEY" \
        https://your-project.supabase.co/rest/v1/users
   ```

2. **Payment Processing Failures**
   ```typescript
   // Add comprehensive error handling
   try {
     const paymentIntent = await stripe.paymentIntents.create({...});
   } catch (error) {
     if (error.type === 'StripeCardError') {
       // Handle card errors
     } else if (error.type === 'StripeInvalidRequestError') {
       // Handle invalid parameters
     }
     // Log error for monitoring
     console.error('Payment error:', error);
   }
   ```

3. **IPFS Upload Failures**
   ```typescript
   // Add retry logic
   async function uploadWithRetry(file: Buffer, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await pinata.upload.buffer(file);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

### Health Checks

Create health check endpoints:

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    stripe: await checkStripe(),
    pinata: await checkPinata(),
    openai: await checkOpenAI(),
  };
  
  const allHealthy = Object.values(checks).every(check => check.status === 'ok');
  
  return NextResponse.json(
    { status: allHealthy ? 'healthy' : 'unhealthy', checks },
    { status: allHealthy ? 200 : 503 }
  );
}
```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**
   - Use Vercel's edge functions
   - Implement Redis for session storage
   - Consider CDN for static assets

2. **Database Scaling**
   - Use Supabase read replicas
   - Implement connection pooling
   - Consider database sharding for large datasets

3. **File Storage Scaling**
   - Use IPFS clustering
   - Implement CDN for frequently accessed files
   - Consider multiple IPFS providers

### Monitoring and Alerts

1. **Key Metrics**
   - Response times
   - Error rates
   - Payment success rates
   - Database query performance
   - IPFS upload success rates

2. **Alert Thresholds**
   - Response time > 2 seconds
   - Error rate > 1%
   - Payment failure rate > 5%
   - Database connection failures

---

This deployment guide ensures a robust, scalable, and secure production deployment of SampleSafe. Follow the checklist carefully and test thoroughly before going live.
