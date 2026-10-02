# Bhumi Seva Kendra - Production Application

> भूमि सेवा केंद्र - ज़मीन से जुड़ी जानकारी, एक जगह

A complete production-ready property information and verification assistance platform for Uttar Pradesh, India.

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Supabase Client
    ↓
Supabase (PostgreSQL + Auth + Storage)
    ↓
Razorpay (Payments)
    ↓
WhatsApp Business API (Notifications)
```

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Razorpay
- **Forms**: React Hook Form + Zod
- **Messaging**: WhatsApp Business API

## 📁 Project Structure

```
bhumisevakendra/
├── src/
│   ├── components/          # React components
│   ├── services/            # API service layer
│   │   ├── requests.ts      # Request management
│   │   ├── payments.ts      # Payment processing
│   │   ├── documents.ts     # Document upload/download
│   │   ├── reports.ts       # Report management
│   │   ├── auth.ts          # Authentication
│   │   └── b2b.ts           # B2B leads
│   ├── config/              # Configuration
│   │   ├── pricing.ts       # Pricing plans
│   │   └── districts.ts     # UP districts
│   ├── lib/                 # Utilities
│   │   └── supabase.ts      # Supabase client
│   ├── hooks/               # Custom hooks
│   ├── App.tsx              # Main app
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/          # Database migrations
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       ├── 003_storage_policies.sql
│       └── 004_seed_districts.sql
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Razorpay account
- (Optional) WhatsApp Business API access

### 1. Clone & Install

```bash
git clone <repository-url>
cd bhumisevakendra
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 3. Supabase Setup

#### Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Run Migrations

1. Go to SQL Editor in Supabase Dashboard
2. Run migrations in order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_storage_policies.sql`
   - `004_seed_districts.sql`

#### Create Storage Buckets

1. Go to Storage in Supabase Dashboard
2. Create three buckets:
   - `property-documents` (Private)
   - `reports` (Private)
   - `field-evidence` (Private)

#### Create Admin User

1. Go to Authentication → Users
2. Create a new user with email/password
3. Add user to `admin_users` table:

```sql
INSERT INTO admin_users (id, full_name, email, role)
VALUES (
  'user-uuid-here',
  'Admin Name',
  'admin@bhumisevakendra.in',
  'admin'
);
```

### 4. Razorpay Setup

1. Go to [razorpay.com](https://razorpay.com)
2. Create an account and complete KYC
3. Generate API keys from Dashboard
4. Add keys to `.env.local`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_...
   RAZORPAY_KEY_SECRET=...
   ```
5. Configure webhook:
   - URL: `https://your-domain.com/api/webhooks/razorpay`
   - Events: `payment.captured`, `payment.failed`
   - Copy webhook secret to `.env.local`

### 5. WhatsApp Business API (Optional)

1. Go to Meta Business Suite
2. Create WhatsApp Business account
3. Get API access token and phone number ID
4. Add to `.env.local`:
   ```env
   WHATSAPP_ACCESS_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   ```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🗄️ Database Schema

### Core Tables

- **profiles** - Customer profiles
- **admin_users** - Admin/Staff users
- **requests** - Verification requests
- **request_documents** - Uploaded documents
- **payments** - Payment records
- **reports** - Generated reports
- **report_downloads** - Download logs
- **verification_updates** - Status timeline
- **internal_notes** - Admin notes (private)
- **field_visits** - Field verification visits
- **field_evidence** - Field visit evidence
- **leads_b2b** - B2B leads
- **otp_verifications** - OTP records
- **notifications** - Email/WhatsApp notifications
- **audit_logs** - Audit trail
- **refunds** - Refund records

### Row Level Security (RLS)

All tables have RLS enabled. Customers can only access their own data. Admins have full access based on role.

## 🔐 Security

### Implemented Security Measures

- ✅ Row Level Security (RLS) on all tables
- ✅ Role-based access control (customer, admin, manager, reviewer)
- ✅ Server-side payment verification (Razorpay signature)
- ✅ Signed URLs for document/report downloads
- ✅ File upload validation (size, type, extension)
- ✅ Input sanitization and validation (Zod)
- ✅ Audit logging for all important actions
- ✅ No secrets in client bundle
- ✅ No Aadhaar collection
- ✅ Rate limiting (via Supabase)
- ✅ HTTPS only in production

### Security Checklist

- [ ] Never commit `.env.local`
- [ ] Use strong passwords for admin accounts
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Monitor audit logs
- [ ] Keep dependencies updated
- [ ] Review RLS policies periodically

## 💳 Payment Flow

```
Customer selects package
    ↓
Frontend creates request
    ↓
Server calculates amount (never trust client)
    ↓
Server creates Razorpay order
    ↓
Customer completes payment
    ↓
Server verifies Razorpay signature
    ↓
Server updates payment status
    ↓
Server updates request status
    ↓
Notification sent (Email/WhatsApp)
```

### Important

- Amount is calculated server-side from `config/pricing.ts`
- Razorpay signature is verified server-side
- Duplicate payment prevention via idempotency
- Webhook reconciliation for payment status

## 📄 Document Upload Flow

```
Customer selects file
    ↓
Client validates (size, type)
    ↓
Upload to Supabase Storage
    ↓
Create document record in database
    ↓
Audit log created
```

### Storage Structure

```
property-documents/
  └── {request-id}/
      └── {document-uuid}.{ext}

reports/
  └── {request-id}/
      └── BSK-Report-{request-id}.pdf

field-evidence/
  └── {field-visit-id}/
      └── {evidence-uuid}.{ext}
```

## 👤 User Roles

### Customer
- Create requests
- Upload documents
- Track request status
- Download reports
- View own payment history

### Admin
- View all requests
- Update request status
- Upload reports
- Manage B2B leads
- View audit logs
- Initiate refunds

### Manager
- Same as Admin but limited to specific districts

### Reviewer
- Review document analysis
- Confirm/dismiss findings
- Add review notes

### Field Agent
- Record field visits
- Upload field evidence
- Update visit status

## 📊 Admin Dashboard

Access at `/admin`

### Features

- Dashboard overview (new requests, revenue, etc.)
- Request management table with filters
- Request detail view with:
  - Customer information
  - Property details
  - Document list
  - Payment status
  - Verification timeline
  - Internal notes
  - Report upload
- B2B leads management
- CSV export functionality

## 📱 Customer Features

### Booking Flow
1. Select service package
2. Enter property details
3. Upload documents (optional)
4. Enter contact details
5. Consent & payment
6. Receive confirmation

### Track Request
- Enter Request ID + Mobile
- View status timeline
- Download report when ready

### User Dashboard (if authenticated)
- View all requests
- Active requests
- Completed reports
- Payment history

## 🔔 Notifications

### Email Notifications
- Booking confirmation
- Payment confirmation
- Status updates
- Report ready

### WhatsApp Notifications
- Booking confirmation
- Payment confirmation
- Report ready

### Implementation

Notifications use a provider abstraction. If WhatsApp/Email credentials are not configured, the application logs a warning but continues to function.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create new request
- [ ] Upload documents
- [ ] Complete payment
- [ ] Track request status
- [ ] Download report
- [ ] Admin login
- [ ] Admin update request status
- [ ] Admin upload report
- [ ] B2B lead submission
- [ ] OTP verification
- [ ] Refund initiation

### Automated Tests (TODO)

- Request creation validation
- Payment verification
- Document upload authorization
- Customer request authorization
- Admin authorization
- Report download authorization

## 🚢 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables from `.env.example`
5. Deploy

### Post-Deployment Checklist

- [ ] Verify Supabase connection
- [ ] Test payment flow (test mode)
- [ ] Test document upload
- [ ] Test report download
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure Razorpay webhook URL
- [ ] Test WhatsApp notifications
- [ ] Test email notifications
- [ ] Review RLS policies
- [ ] Set up monitoring
- [ ] Configure backups

## 🔄 Database Backup Strategy

### Supabase Backups

- **Daily automated backups** (Pro plan)
- **Point-in-time recovery** (Pro plan)
- **Manual backups** before major changes

### Backup Procedure

1. Go to Supabase Dashboard → Database → Backups
2. Download backup or restore from point-in-time
3. Test restore in staging environment

## 📈 Monitoring & Analytics

### Application Monitoring

- Vercel Analytics (built-in)
- Sentry for error tracking (recommended)
- Supabase logs for database queries

### Business Analytics

Track via analytics events:
- `hero_property_check`
- `service_selected`
- `document_uploaded`
- `booking_started`
- `payment_started`
- `payment_success`
- `report_downloaded`
- `whatsapp_clicked`
- `b2b_lead_submitted`

**Important**: Never send sensitive data (mobile, email, property details) to analytics.

## 🐛 Troubleshooting

### Common Issues

#### "Failed to create request"
- Check Supabase connection
- Verify RLS policies
- Check database constraints

#### "Payment verification failed"
- Verify Razorpay keys
- Check webhook configuration
- Review payment signature

#### "Document upload failed"
- Check file size (max 10MB)
- Verify file type (PDF, JPG, PNG only)
- Check storage bucket permissions

#### "Report download failed"
- Verify report status is 'ready'
- Check storage bucket permissions
- Verify signed URL generation

### Debug Mode

Set `VITE_DEMO_MODE=true` in `.env.local` to enable debug logging.

## 📝 TODO / Future Enhancements

### High Priority
- [ ] Automated document analysis (OCR + AI)
- [ ] Automated report generation
- [ ] Multi-language support (English/Hindi toggle)
- [ ] Customer account/profile page
- [ ] Email templates with branding

### Medium Priority
- [ ] Advanced admin analytics dashboard
- [ ] Bulk request import for B2B
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering

### Low Priority
- [ ] Integration with official government APIs (if available)
- [ ] AI-powered risk assessment
- [ ] Blockchain-based document verification
- [ ] Multi-state support (beyond UP)

## 📜 License

Proprietary - All rights reserved.

## 🤝 Support

For technical support:
- Email: support@bhumisevakendra.in
- WhatsApp: +91-XXXXXXXXXX

For business inquiries:
- Email: business@bhumisevakendra.in

## 🙏 Acknowledgments

Built with:
- React & Vite
- Supabase
- Razorpay
- Tailwind CSS
- Framer Motion

---

**Important**: Bhumi Seva Kendra is a private information-assistance platform, not a government department or portal.
