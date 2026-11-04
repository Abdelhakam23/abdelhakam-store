# Abdelhakam Store

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![License](https://img.shields.io/badge/license-private-lightgrey)

**Abdelhakam Store** is a production-oriented bilingual e-commerce application built with Next.js App Router, TypeScript, MongoDB, Auth.js, Tailwind CSS, Zustand, Zod, Framer Motion, and Stripe-ready payment infrastructure.

The storefront supports English and Arabic with RTL layout switching, persistent guest and authenticated carts, dynamic product attributes, wishlist synchronization, protected administration, responsive design, loading skeletons, and localized feedback.

## Highlights

- Bilingual English/Arabic storefront with RTL/LTR switching.
- Responsive home page, catalog, collections, product details, cart, wishlist, checkout, profile, and informational pages.
- Dynamic product attributes sourced from stored product data.
- `Material` attributes are display-only; selectable attributes remain required before adding to cart.
- Variant-aware cart items allow multiple option combinations for one product.
- Guest cart and wishlist persistence through browser storage.
- Authenticated cart and wishlist synchronization through MongoDB.
- Auth.js credentials authentication with customer/admin roles.
- Admin dashboard for products, categories, orders, users, and role management.
- Admin user deletion with confirmation, server authorization, and backend deletion.
- Zod validation for authentication, products, orders, filters, roles, and statuses.
- Server-side price, stock, and product-option revalidation during order creation.
- Stripe Payment Intent and signed webhook endpoints with server-calculated order totals.
- Search with literal matching, per-term filtering, 5ms debounce, request deduplication, and client/server caching.
- Framer Motion product reveal animations and route-level skeleton loading states.
- SEO metadata, sitemap, robots route, and optimized MongoDB reads.

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, Lucide React |
| Animation | Framer Motion |
| Database | MongoDB with Mongoose |
| Authentication | Auth.js / NextAuth credentials provider |
| Validation | Zod |
| Client state | Zustand |
| Payments | Stripe server endpoints and signed webhook |
| Passwords | bcryptjs |

## Requirements

- Node.js 20+
- npm
- MongoDB database
- Stripe account for payment functionality

## Getting started

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Set these values in `.env.local`. Never commit this file.

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=ecommerce_store
AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Required only when Stripe payments are enabled
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Optional media integration values
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Generate a secure Auth.js secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Creating an administrator

The admin script creates or promotes an account without printing the password:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="use-a-long-unique-password"
$env:ADMIN_NAME="Abdelhakam Store Admin"
npm run admin:create
```

Sign in at `/login`, then open `/admin`.

Admin authorization is checked both in protected pages and in mutation API routes. Privileged API requests re-read the current user role from MongoDB, so changing a role takes effect even if an old JWT still exists.

## Project structure

```text
ecommerce-store/
├── app/
│   ├── (storefront pages)/
│   ├── admin/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   └── api/
│       ├── admin/
│       ├── auth/
│       ├── cart/
│       ├── orders/
│       ├── payments/
│       ├── products/
│       └── wishlist/
├── components/
│   ├── admin/              # Admin forms, panels, controls, and user list
│   ├── app-providers.tsx   # Session, locale, toast, and sync providers
│   ├── product-card.tsx
│   ├── cart-page.tsx
│   ├── checkout-form.tsx
│   └── page-skeletons.tsx
├── lib/
│   ├── authz.ts            # Route and current-role authorization helpers
│   ├── cart.ts
│   ├── db.ts
│   ├── env.ts
│   ├── i18n.ts
│   ├── product-options.ts
│   ├── product-search.ts
│   └── validation.ts
├── models/                 # Mongoose schemas and indexes
├── scripts/                # Operational scripts such as admin:create
├── types/                  # Shared domain types
├── public/                 # Static assets
├── auth.ts                 # Auth.js configuration
├── proxy.ts                # Route protection proxy
└── README.md
```

## Main routes

### Storefront

- `/` — bilingual home page
- `/shop` — product catalog and search results
- `/shop/[slug]` — product details and option selection
- `/collections/[slug]` — collection listing
- `/cart` — persistent cart
- `/wishlist` — saved products
- `/checkout` — authenticated checkout
- `/profile` — profile and order history

### Administration

- `/admin` — dashboard overview
- `/admin/products` — product CRUD and attributes
- `/admin/categories` — category management
- `/admin/orders` — order status management
- `/admin/users` — role updates and confirmed user deletion

## Security design

- Passwords are hashed with bcryptjs.
- Credentials and registration payloads are validated with Zod.
- Admin APIs verify the current MongoDB role, not only a cached JWT role.
- Payment Intent amounts are calculated from the owned order in MongoDB.
- Stripe webhook signatures are verified before processing.
- Webhooks compare the received amount with the stored order total.
- Order creation rechecks product existence, current price, stock, and valid options.
- Admin user deletion prevents an administrator from deleting their own account.
- Environment variables are parsed server-side and `.env*` files are ignored.
- Search input is escaped before constructing literal MongoDB regular expressions.

## Useful commands

```powershell
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
npm run admin:create
```

## Stripe webhook development

Configure `STRIPE_WEBHOOK_SECRET` with the signing secret for your webhook endpoint. In local development, forward Stripe events to:

```text
http://localhost:3000/api/payments/webhook
```

The webhook only marks an order as paid after signature and amount verification.

## Quality checks

Run all checks before opening a pull request:

```powershell
npm run lint
npm run typecheck
npm run build
```

## Deployment notes

1. Provision MongoDB and configure a production `MONGODB_URI`.
2. Generate a strong production `AUTH_SECRET`.
3. Configure HTTPS and secure deployment cookies at the hosting layer.
4. Configure Stripe production keys and webhook signing secret.
5. Set `NEXT_PUBLIC_APP_URL` to the public HTTPS origin.
6. Run the validation commands before deployment.
7. Never expose server-only secrets through `NEXT_PUBLIC_*` variables.

## License

This project is private software. Add a license file before distributing it publicly.
