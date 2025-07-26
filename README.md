# 🎓 EXIVOX - Educational Platform

A modern educational content sharing platform built with React and Node.js, designed for students, tutors, and educational institutions to share and discover learning materials.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Content Management
- **Multi-format Support**: Upload and share images, videos, audio, and documents
- **Content Types**: Posts, reels, Q&A, tutorials, and lectures
- **Categories**: Mathematics, Science, Technology, Language, History, Arts, Business
- **Difficulty Levels**: Beginner, Intermediate, Advanced

### Interactive Features
- **Q&A System**: Ask questions and provide answers with voting
- **Comments & Discussions**: Engage with educational content
- **Like System**: Show appreciation for helpful content
- **View Tracking**: Monitor content engagement

### User Experience
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Real-time Updates**: Dynamic content loading
- **Content Moderation**: AI-powered content filtering
- **User Profiles**: Track uploads and activity

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Exivox/
├── backEnd/
│   ├── config/
│   │   ├── cloudinary.js      # Cloud storage configuration
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── moderationController.js # Content moderation
│   │   └── postController.js   # Post management
│   ├── middleware/
│   │   ├── aiModerationMiddleware.js # AI content filtering
│   │   ├── authMiddleware.js   # Authentication middleware
│   │   └── uploadMiddleware.js # File upload handling
│   ├── models/
│   │   ├── Post.js            # Post data model
│   │   ├── User.js            # User data model
│   │   └── ModerationSettings.js # Moderation configuration
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── postRoutes.js      # Post-related routes
│   │   └── moderationRoutes.js # Moderation routes
│   ├── uploads/               # File storage directory
│   ├── server.js              # Main server file
│   └── package.json
└── frontEnd/
    └── frontend/
        ├── src/
        │   ├── components/
        │   │   ├── ContentCard.jsx    # Content display component
        │   │   ├── UploadComponent.jsx # File upload interface
        │   │   ├── CommentModal.jsx   # Comment system
        │   │   └── ...
        │   ├── pages/
        │   │   ├── Dashboard.jsx      # Main dashboard
        │   │   └── ...
        │   ├── context/
        │   │   └── AuthContext.jsx    # Authentication context
        │   └── services/
        │       └── api.js             # API service layer
        ├── package.json
        └── vite.config.js
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Exivox/backEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/exivox
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontEnd/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 💻 Usage

### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Main Features

#### Content Feed
- Browse educational content by category
- Filter by content type (posts, tutorials, Q&A)
- Like and comment on posts
- View detailed content information

#### Upload Content
- Upload various file formats (images, videos, documents)
- Add titles, descriptions, and tags
- Select appropriate categories and difficulty levels
- Set content type (post, tutorial, lecture, Q&A)

#### Q&A System
- Ask educational questions
- Provide answers to existing questions
- Vote on helpful answers
- Mark correct answers

#### Profile Management
- View your uploaded content
- Track engagement metrics
- Manage your posts and answers

## 🔌 API Endpoints

### Posts
- `GET /api/posts` - Retrieve all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/answer` - Add answer to Q&A post

### File Upload
- `POST /api/posts/upload` - Upload media files
- File size limit: 100MB
- Supported formats: Images, videos, audio, documents

### Content Moderation
- Automatic content filtering
- AI-powered inappropriate content detection
- Manual moderation capabilities

## 🎯 Key Components

### ContentCard
Displays educational content with:
- Title and description
- Author information
- Like and view counts
- Comment functionality
- Media preview

### UploadComponent
Handles content creation with:
- File upload interface
- Form validation
- Progress tracking
- Preview functionality

### Dashboard
Main application interface featuring:
- Responsive navigation
- Content feed
- Upload interface
- Profile management

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration included
- Modern JavaScript (ES6+)
- React functional components with hooks
- Responsive design principles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for educational accessibility
- Community-driven content sharing
- Responsive and inclusive design

---

**EXIVOX** - Empowering Education Through Technology 🚀
