# Deployment Guide for Grocery Inventory Management System

This guide provides multiple options for deploying your Django backend to the web.

## Option 1: Railway (Recommended for Beginners)

Railway is a modern platform that makes deployment simple and offers a free tier.

### Steps:

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Connect your repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `inventory123` repository

3. **Configure environment variables**
   Add these environment variables in Railway dashboard:
   ```
   SECRET_KEY=your-very-secure-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.railway.app
   DATABASE_URL=postgresql://... (Railway will provide this)
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy**
   - Railway will automatically detect it's a Python app
   - It will use the `Procfile` to run your application
   - Your app will be available at `https://your-app-name.railway.app`

## Option 2: Render

Render is another excellent platform with a free tier.

### Steps:

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service**
   - **Name**: `inventory123-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn inventory.wsgi:application`

4. **Add environment variables**
   ```
   SECRET_KEY=your-very-secure-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.onrender.com
   DATABASE_URL=postgresql://... (Render will provide this)
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

## Option 3: Heroku

Heroku is a popular platform (now requires credit card for free tier).

### Steps:

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-inventory-app
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=your-very-secure-secret-key-here
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

## Option 4: DigitalOcean App Platform

DigitalOcean offers a managed platform with good performance.

### Steps:

1. **Sign up for DigitalOcean**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Create an account

2. **Create a new app**
   - Go to App Platform
   - Click "Create App"
   - Connect your GitHub repository

3. **Configure the app**
   - **Source**: Your GitHub repo
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `gunicorn inventory.wsgi:application`

4. **Add environment variables**
   - Add all required environment variables in the dashboard

## Environment Variables Required

For any deployment platform, you'll need these environment variables:

```bash
# Django Settings
SECRET_KEY=your-very-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-app-name.platform.com

# Database (platform will provide DATABASE_URL)
DATABASE_URL=postgresql://username:password@host:port/database

# CORS Settings
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Redis (optional, for caching)
REDIS_URL=redis://username:password@host:port/database
```

## Pre-deployment Checklist

Before deploying, ensure you have:

1. ✅ **Updated requirements.txt** with deployment dependencies
2. ✅ **Created Procfile** for deployment platforms
3. ✅ **Set DEBUG=False** in production settings
4. ✅ **Configured environment variables**
5. ✅ **Set up database** (PostgreSQL recommended)
6. ✅ **Configured CORS** for your frontend domain
7. ✅ **Set up static files** handling
8. ✅ **Configured logging** for production

## Post-deployment Steps

After successful deployment:

1. **Run migrations**
   ```bash
   python manage.py migrate
   ```

2. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

3. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

4. **Test your API endpoints**
   - Visit your API root: `https://your-app.com/api/`
   - Test authentication endpoints
   - Verify CORS is working with your frontend

## Security Considerations

1. **Never commit sensitive data** to your repository
2. **Use strong secret keys** (generate with `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
3. **Enable HTTPS** (most platforms do this automatically)
4. **Set up proper CORS** for your frontend domain
5. **Monitor logs** for security issues
6. **Keep dependencies updated**

## Troubleshooting

### Common Issues:

1. **Build fails**: Check your `requirements.txt` and Python version
2. **Database connection errors**: Verify your `DATABASE_URL`
3. **Static files not loading**: Ensure `collectstatic` was run
4. **CORS errors**: Check your `CORS_ALLOWED_ORIGINS` setting
5. **500 errors**: Check your logs and ensure `DEBUG=False`

### Getting Help:

- Check the platform's documentation
- Review your application logs
- Test locally with production settings
- Use Django's `check --deploy` command

## Recommended Platform: Railway

For beginners, I recommend **Railway** because:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ PostgreSQL database included
- ✅ Simple GitHub integration
- ✅ Good documentation
- ✅ Fast deployment

Your backend will be accessible at: `https://your-app-name.railway.app/api/` 