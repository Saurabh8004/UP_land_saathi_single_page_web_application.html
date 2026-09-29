# Bhumi Seva Kendra - Property Information & Verification Assistance (Uttar Pradesh)

> ज़मीन से जुड़ी जानकारी, एक जगह

A private property information and verification assistance platform for Uttar Pradesh, India.

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay
- **Messaging**: WhatsApp Cloud API
- **Fonts**: Mukta (Hindi) + Inter (English)

## 📁 Project Structure

```
src/
├── App.tsx              # Main app with routing
├── config.ts            # All config: brand, translations, districts, packages, rates
├── index.css            # Tailwind + custom styles
├── main.tsx             # Entry point
└── components/
    ├── Header.tsx       # Navigation, language toggle
    ├── Hero.tsx         # Hero section + quick-start form
    ├── Sections.tsx     # Problem, HowItWorks, WhyUs, Testimonials
    ├── Packages.tsx     # Pricing cards + comparison table
    ├── SampleReport.tsx # Sample report HTML preview
    ├── FreeTools.tsx    # Portals, stamp duty calc, checklist
    ├── B2BAndFAQ.tsx    # B2B section + FAQ accordion
    ├── Footer.tsx       # Footer with disclaimer
    ├── BookingFlow.tsx  # Multi-step booking form
    ├── TrackStatus.tsx  # Request status tracker
    ├── AdminPanel.tsx   # Admin dashboard
    └── LegalPage.tsx    # Privacy, Terms, Refund, Disclaimer
```

## 🚀 Setup

1. **Clone and install**:
```bash
npm install
```

2. **Environment variables**:
```bash
cp .env.example .env.local
# Fill in your keys
```

3. **Development**:
```bash
npm run dev
```

4. **Build**:
```bash
npm run build
```

## 🗄️ Database Setup (Supabase)

Create these tables in Supabase:

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### requests
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  package TEXT NOT NULL,
  district TEXT NOT NULL,
  tehsil TEXT,
  village TEXT,
  gata TEXT NOT NULL,
  area TEXT,
  owner_name TEXT,
  status TEXT DEFAULT 'Received',
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### reports
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  pdf_url TEXT,
  risk_score TEXT,
  advocate_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### leads_b2b
```sql
CREATE TABLE leads_b2b (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  monthly_volume TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 🔌 API Routes (TODO)

When deploying with a backend (Vercel serverless functions or Supabase Edge Functions):

- `POST /api/requests` - Create new request
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify Razorpay signature
- `GET /api/requests/:id/status` - Get request status
- `POST /api/leads/b2b` - Create B2B lead
- `POST /api/admin/upload-report` - Upload report PDF
- `POST /api/whatsapp/send` - Send WhatsApp notification

## ✅ Before Launch Checklist

- [ ] **Legal**: Get Privacy Policy, Terms, Refund Policy, Disclaimer reviewed by a lawyer
- [ ] **Testimonials**: Replace placeholder testimonials with real reviews
- [ ] **Sample Report**: Create and upload a real sample PDF report
- [ ] **Razorpay**: Complete KYC and activate account
- [ ] **Domain**: Purchase and configure domain (zameensaathi.in)
- [ ] **GST**: Register for GST if applicable
- [ ] **WhatsApp Business**: Set up WhatsApp Business API
- [ ] **Supabase**: Set up database tables and RLS policies
- [ ] **SSL**: Ensure HTTPS is enabled
- [ ] **Analytics**: Set up Google Analytics and Meta Pixel
- [ ] **Testing**: Test all forms, payment flow, and file uploads
- [ ] **Performance**: Run Lighthouse audit (target 90+ on mobile)
- [ ] **Accessibility**: Test keyboard navigation and screen reader
- [ ] **SEO**: Verify meta tags, sitemap, and structured data

## 🎨 Design System

- **Primary**: `#0F5132` (deep green)
- **Accent**: `#F59E0B` (warm amber)
- **Background**: `#FAFAF7` (off-white)
- **Text**: `#1e293b` (dark slate)
- **Border Radius**: `2xl` (16px) for cards
- **Min tap target**: 48px
- **Min body text**: 16px

## 📝 Assumptions Made

1. Used React + Vite instead of Next.js (as per project setup). API routes are stubbed as TODOs.
2. Razorpay integration is stubbed - needs server-side implementation.
3. WhatsApp Cloud API is stubbed - needs webhook setup.
4. Admin auth uses simple password - should use Supabase Auth for production.
5. File uploads are client-side only - needs Supabase Storage or S3.
6. OTP verification is stubbed - needs SMS gateway integration.
7. Stamp duty rates are approximate - verify with IGRSUP for latest.
8. Field verification districts list not implemented - needs backend config.
9. Rate limiting not implemented - needs middleware/server config.
10. No actual payment processing - Razorpay keys needed.

## 📜 License

Private - All rights reserved.
