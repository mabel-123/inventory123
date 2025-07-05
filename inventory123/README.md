# Grocery Inventory Management System

A full-stack application for managing grocery inventory, built with Django and React.

## Project Structure

```
inventory123/
├── backend/                 # Django backend
│   ├── core/               # Main Django application
│   ├── inventory/          # Inventory management app
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
│
└── frontend/               # React frontend
    ├── public/            # Static files
    ├── src/              # React source code
    │   ├── components/   # Reusable components
    │   ├── pages/       # Page components
    │   └── store/       # Redux store and slices
    └── package.json     # Node.js dependencies
```

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000/api/`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend application will be available at `http://localhost:3000`

## Features

- User authentication with JWT
- Product management
- Category management
- Supplier management
- Stock movement tracking
- Sales tracking
- Dashboard with analytics
- Responsive design

## API Endpoints

- `/api/token/` - JWT token obtain
- `/api/token/refresh/` - JWT token refresh
- `/api/products/` - Product management
- `/api/categories/` - Category management
- `/api/suppliers/` - Supplier management
- `/api/stock-movements/` - Stock movement tracking
- `/api/sales/` - Sales management
- `/api/dashboard/` - Dashboard data

## Technologies Used

### Backend
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL

### Frontend
- React
- Redux Toolkit
- Material-UI
- React Router
- Axios 