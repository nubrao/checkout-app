# Checkout App 🛒

Standalone checkout application for the e-commerce microfront-end architecture.

## 🚀 Features

- Secure checkout process
- Payment method selection
- Order summary
- Address management
- Integration with main store

## 🛠️ Technologies

- Next.js 14
- React.js
- Ant Design
- TypeScript
- Context API
- CSS Modules
- Jest & Testing Library

## 📋 Prerequisites

- Node.js 20.x or later
- npm or yarn
- Docker (for containerized environment)

## 🏃‍♂️ Running the Project

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:8080
NEXT_PUBLIC_PROXY_URL=http://localhost:8080
NEXT_PUBLIC_CHECKOUT_URL=http://localhost:8080/checkout
```

3. Start the development server:
```bash
npm run dev
```

### Using Docker

```bash
docker compose up checkout-app
```

The application will be available at:
- Local: http://localhost:3001
- Docker: http://localhost:8080/checkout (via proxy)

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📁 Project Structure

```
checkout-app/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── contexts/     # React contexts
│   ├── services/     # API services
│   └── styles/       # CSS modules
├── public/           # Static files
└── tests/           # Test files
```

## 🔄 Dependencies

This project requires:
- `ecommerce-proxy` - For API Gateway/BFF
- `ecommerce-app` - Main store application (cart data)

## 📚 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint