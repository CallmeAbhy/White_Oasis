Based on the provided information and repository content, I'll help create a comprehensive README.md file in the requested format:

# White Oasis

## Project Overview

White Oasis is a full-stack web application built with React (frontend) and Node.js/Express (backend). The project uses MongoDB for data storage and includes features for file handling, authentication, and various content management capabilities.

## Tech Stack

### Frontend

- React + Vite
- TailwindCSS
- React Router DOM
- Axios for API calls
- Various UI libraries (@headlessui/react, @heroicons/react)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- GridFS for file storage
- JWT for authentication
- Nodemailer for email functionality

## Installation Instructions

### Prerequisites

- Node.js (Latest LTS version)
- npm (comes with Node.js)
- MongoDB installed and running locally

### Setting Up the Project

1. **Clone the Repository**

```bash
git clone https://github.com/callmeabhy/white_oasis.git
cd white_oasis
```

2. **Frontend Setup**

```bash
cd frontend
npm install
```

3. **Backend Setup**

```bash
cd backend
npm install
```

4. **Environment Variables**
   Create a `.env` file in the backend directory with:

```env
PORT=7001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. **Start Backend Server**

```bash
cd backend
npm run dev
```

2. **Start Frontend Development Server**

```bash
cd frontend
npm run dev
```

## Project Structure

```
white_oasis/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── context/
│   │   └── components/
│   └── package.json
└── backend/
    ├── src/
    │   ├── routes/
    │   ├── models/
    │   ├── controllers/
    │   └── config/
    └── package.json
```

## Features

- User Authentication (Admin, Manager, User roles)
- File Upload and Management using GridFS
- Dashboard for Admins and Managers
- Content Management System
- Old Age Home Management
- User Profile Management
- Review and Rating System

## API Routes

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/admin` - Admin functionalities
- `/api/oldAgeHome` - Old age home management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any queries or support, please open an issue in the repository.
