# 📈 Stock Trading Simulator

A full-stack web application that simulates real-time stock trading with a modern, responsive interface. This project demonstrates advanced web development skills including REST API development, real-time data integration, secure authentication, and modern frontend architecture.

## 🚀 Live Demo
[Add your deployed application URL here]

## 🎯 Project Overview

This Stock Trading Simulator is a comprehensive web application that allows users to:
- **Trade stocks** with real-time market data from Alpha Vantage API
- **Manage portfolios** with detailed profit/loss tracking
- **Secure authentication** with JWT tokens and password recovery
- **Real-time updates** with automatic price refresh every 15 seconds
- **Responsive design** optimized for desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Frontend
- **Angular 17** - Modern TypeScript-based framework
- **Angular Material** - Material Design components
- **RxJS** - Reactive programming for async operations
- **SASS** - Advanced CSS preprocessing
- **TypeScript** - Type-safe JavaScript development

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security

### APIs & External Services
- **Alpha Vantage API** - Real-time stock market data
- **RESTful API** - Custom endpoints for user management and trading

## 🏗️ Architecture

### Backend Architecture
```
backend/
├── controllers/          # Business logic layer
│   ├── userController.js    # User authentication & management
│   ├── stockController.js   # Stock data handling
│   └── buySellController.js # Trading operations
├── models/              # Database schemas
│   └── user.js             # User data model
├── routes/              # API route definitions
│   ├── users.js            # User endpoints
│   └── stocks.js           # Stock endpoints
├── middleware/          # Custom middleware
│   └── authenticate.js     # JWT authentication
└── fetchCurrentPrice/   # External API integration
    └── fetchPrice.js       # Alpha Vantage API client
```

### Frontend Architecture
```
frontend/src/app/
├── components/          # Reusable UI components
│   ├── portfolio/          # Portfolio management
│   ├── buy-stock-dialog/   # Trading dialogs
│   ├── searchbar/          # Stock search
│   └── transaction/        # Transaction history
├── pages/              # Main application pages
│   ├── dashboard/          # Main dashboard
│   ├── login/              # Authentication
│   └── stock-page/         # Individual stock views
├── services/           # Business logic & API calls
│   ├── userRouteService/    # User API integration
│   ├── stockRouteService/   # Stock API integration
│   └── profitLossService/   # Portfolio calculations
└── authGuard/          # Route protection
    └── authGuard.ts        # Authentication guards
```

## 🔑 Key Features

### 🔐 Security & Authentication
- **JWT-based authentication** with secure token management
- **Password hashing** using bcryptjs with salt rounds
- **Security questions** for password recovery
- **Input validation** with express-validator
- **CORS protection** and secure headers
- **Route guards** protecting sensitive endpoints

### 💼 Portfolio Management
- **Real-time portfolio tracking** with automatic price updates
- **Profit/loss calculations** with percentage and dollar amounts
- **Transaction history** with detailed buy/sell records
- **Portfolio sorting** by various metrics (price, profit/loss, quantity)
- **Stock detail dialogs** with comprehensive information

### 📊 Trading Features
- **Real-time stock prices** from Alpha Vantage API
- **Buy/sell functionality** with quantity validation
- **Current price display** with automatic refresh
- **Stock search** with symbol lookup
- **Transaction confirmation** dialogs

### 🎨 User Experience
- **Responsive Material Design** interface
- **Dark/light theme** preferences
- **Loading states** and error handling
- **Snackbar notifications** for user feedback
- **Form validation** with real-time feedback
- **Mobile-optimized** responsive design

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `POST /api/users/forgot-password` - Password recovery

### Portfolio & Trading
- `GET /api/users/portfolio` - Get user portfolio
- `POST /api/users/buy-stock` - Buy stock shares
- `POST /api/users/sell-stock` - Sell stock shares
- `POST /api/users/deposit` - Deposit funds
- `GET /api/users/transactions` - Get transaction history

### Stock Data
- `GET /api/stocks/search/:symbol` - Get stock information
- `GET /api/stocks/price/:symbol` - Get current stock price

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Alpha Vantage API key

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/stock-simulator
JWT_SECRET=your_jwt_secret_key
ALPHA_ADV_API=your_alpha_vantage_api_key
```

Start the backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
```

Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## 📱 Screenshots

[Add screenshots of your application here]

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
ng test
```

## 🔄 Development Workflow

1. **Feature Development**: Create feature branches from main
2. **Code Review**: All changes require pull request review
3. **Testing**: Ensure all tests pass before merging
4. **Deployment**: Automated deployment on successful merge

## 📈 Performance Optimizations

- **Concurrent API calls** with RxJS mergeMap for portfolio updates
- **Caching strategies** for frequently accessed stock data
- **Lazy loading** of Angular modules
- **Optimized database queries** with proper indexing
- **Compression** and minification for production builds

## 🔒 Security Measures

- **Input sanitization** and validation
- **SQL injection prevention** with Mongoose
- **XSS protection** with proper content encoding
- **CSRF protection** with secure tokens
- **Rate limiting** on API endpoints
- **Secure password requirements** with regex validation

## 🎯 Learning Outcomes

This project demonstrates proficiency in:

- **Full-stack development** with modern JavaScript/TypeScript
- **RESTful API design** and implementation
- **Real-time data integration** with external APIs
- **Database design** and management with MongoDB
- **Authentication systems** with JWT tokens
- **Responsive web design** with Material Design
- **State management** and reactive programming
- **Error handling** and user experience optimization
- **Security best practices** in web applications
- **Version control** and collaborative development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Cole Baxendale**
- Email: thecodercole@gmail.com
- GitHub: [@ColeBaxendale](https://github.com/ColeBaxendale)

## 🙏 Acknowledgments

- Alpha Vantage for providing real-time stock market data
- Angular Material for the beautiful UI components
- MongoDB for the robust database solution
- The open-source community for various libraries and tools

---

⭐ **Star this repository if you found it helpful!**
