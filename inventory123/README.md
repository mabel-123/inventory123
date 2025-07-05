# 🛒 Grocery Inventory Management System

A comprehensive, secure, and modern grocery inventory management system built with Django (backend) and React (frontend). This application provides complete inventory tracking, user management, and business analytics with enterprise-grade security features.

## 🌟 Features

### 🔐 Security Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Secure Session Management**: HttpOnly cookies with secure session handling
- **Input Validation & Sanitization**: Comprehensive validation on all inputs
- **Encryption**: HTTPS enforcement and data encryption
- **CSRF Protection**: Built-in CSRF protection for all forms
- **Logging & Monitoring**: Comprehensive audit logging and security monitoring
- **Account Lockout**: Rate limiting and account lockout after failed attempts
- **Password Security**: Strong password policies and secure password handling
- **Content Security Policy**: CSP headers for XSS protection
- **Secure Dependencies**: Regularly updated and audited dependencies

### 📊 Business Features
- **Product Management**: Add, edit, delete, and categorize products
- **Category Management**: Organize products by categories
- **Supplier Management**: Track suppliers and their information
- **Stock Management**: Real-time inventory tracking
- **Sales Tracking**: Monitor sales and revenue
- **Dashboard Analytics**: Visual charts and business insights
- **User Management**: Role-based user access control
- **Audit Trail**: Complete activity logging

## 🏗️ Architecture

```
inventory123/
├── backend/                 # Django REST API
│   ├── core/               # Main application
│   ├── inventory/          # Django project settings
│   ├── requirements.txt    # Production dependencies
│   ├── requirements-dev.txt # Development dependencies
│   ├── Procfile           # Deployment configuration
│   └── manage.py          # Django management
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── App.js        # Main app component
│   └── package.json      # Node.js dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (for production)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mabel-123/inventory123.git
   cd inventory123
   ```

2. **Set up Python environment**
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements-dev.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate --settings=inventory.local
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser --settings=inventory.local
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver --settings=inventory.local
   ```

   The backend will be available at: `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will be available at: `http://localhost:3000/`

## 🌐 Deployment

### Option 1: Railway (Recommended)

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `inventory123` repository

3. **Configure environment variables**
   ```
   SECRET_KEY=your-secure-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.railway.app
   DATABASE_URL=postgresql://... (Railway provides this)
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

4. **Your app will be deployed automatically!**

### Option 2: Render

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure settings**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn inventory.wsgi:application`

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-inventory-app
   ```
3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/token/verify/` - Verify JWT token

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create new category
- `GET /api/categories/{id}/` - Get category details
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Suppliers
- `GET /api/suppliers/` - List all suppliers
- `POST /api/suppliers/` - Create new supplier
- `GET /api/suppliers/{id}/` - Get supplier details
- `PUT /api/suppliers/{id}/` - Update supplier
- `DELETE /api/suppliers/{id}/` - Delete supplier

### Sales
- `GET /api/sales/` - List all sales
- `POST /api/sales/` - Create new sale
- `GET /api/sales/{id}/` - Get sale details
- `PUT /api/sales/{id}/` - Update sale
- `DELETE /api/sales/{id}/` - Delete sale

### Dashboard
- `GET /api/dashboard/` - Get dashboard analytics

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Secure password policies
- Account lockout protection

### Data Protection
- HTTPS enforcement
- CSRF protection
- XSS protection
- SQL injection prevention
- Input validation and sanitization

### Monitoring & Logging
- Comprehensive audit logging
- Security event monitoring
- Failed login attempt tracking
- User activity logging

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test --settings=inventory.local
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```bash
# Django Settings
SECRET_KEY=your-secure-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mabel Akwa**
- GitHub: [@mabel-123](https://github.com/mabel-123)

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- React for the modern frontend framework
- Material-UI for the beautiful UI components
- All contributors and supporters

## 📞 Support

If you have any questions or need support, please:
1. Check the [Issues](https://github.com/mabel-123/inventory123/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainer

---

**⭐ Star this repository if you find it helpful!** 