# Checkpoint - Daily Standup Tracker

A lightweight, full-stack application that helps teams track their daily standups asynchronously. Built with React, Node.js, TypeScript, and MongoDB.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Daily Standups**: Create and edit daily standup entries with yesterday's work, today's plans, and blockers
- **Team View**: View all team members' standups with visual indicators and date filtering
- **History**: Browse your personal standup history with pagination and date range filtering
- **Real-time Updates**: Edit today's standup at any time

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Responsive Design**: Mobile-optimized interface using Tailwind CSS
- **API Validation**: Comprehensive input validation and error handling
- **Testing**: Unit tests for authentication and API endpoints
- **Modular Architecture**: Clean separation of concerns with proper folder structure

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** with TypeScript
- **Express.js** for API framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Jest** for testing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd renti-take-home-project
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Environment
Create a `.env` file in the `server` directory:
```bash
cd server
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/checkpoint
MONGODB_TEST_URI=mongodb://localhost:27017/checkpoint-test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

#### Client Environment
Create a `.env` file in the `client` directory:
```bash
cd client
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Database Setup
Make sure MongoDB is running on your system or use a cloud MongoDB instance. Update the `MONGODB_URI` in your server `.env` file accordingly.

### 5. Running the Application

#### Development Mode
```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Build
```bash
# Build the server
cd server
npm run build
npm start

# Build the client
cd client
npm run build
```

### 6. Running Tests
```bash
# Run server tests
cd server
npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login with existing credentials
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Standup Endpoints

All standup endpoints require authentication (Bearer token in Authorization header)

#### POST /api/standups
Create or update today's standup
```json
{
  "yesterday": "Completed user authentication feature",
  "today": "Working on dashboard UI improvements",
  "blockers": "Waiting for design feedback"
}
```

#### GET /api/standups/today
Get today's standup for the current user

#### GET /api/standups/team?date=2024-01-15
Get team standups for a specific date (optional)

#### GET /api/standups/history?page=1&limit=10&startDate=2024-01-01&endDate=2024-01-31
Get user's standup history with pagination and date filtering

#### GET /api/standups/date/:date
Get all standups for a specific date

## 🏗️ Project Structure

```
renti-take-home-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── router/        # Routing configuration
│   │   └── ...
│   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── __tests__/     # Test files
│   │   └── ...
│   └── ...
└── README.md
```

## 🧪 Testing

The project includes comprehensive unit tests for the backend API:

- **Authentication Tests**: User registration and login functionality
- **API Validation**: Input validation and error handling
- **Database Operations**: MongoDB model testing

Run tests with:
```bash
cd server
npm test
```

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to various platforms:

1. **Railway**: Connect your GitHub repository and set environment variables
2. **Render**: Deploy as a web service with MongoDB add-on
3. **Heroku**: Deploy with MongoDB Atlas connection
4. **DigitalOcean**: Deploy to App Platform or Droplet

### Frontend Deployment
The frontend can be deployed to:

1. **Vercel**: Connect GitHub repository for automatic deployments
2. **Netlify**: Drag and drop build folder or connect repository
3. **GitHub Pages**: Deploy static build files

### Environment Variables for Production
Update the client's `VITE_API_URL` to point to your deployed backend API.

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Modular component architecture

### Best Practices
- Input validation on both frontend and backend
- Proper error handling and user feedback
- Responsive design for mobile devices
- Clean and maintainable code structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is created as a take-home assignment for Renti.

## 🆘 Support

For questions or issues, please refer to the project documentation or create an issue in the repository.