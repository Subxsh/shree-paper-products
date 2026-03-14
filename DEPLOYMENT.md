# Deployment Guide - Shree Paper Products

## Deployment Overview

This guide covers deploying the Shree Paper Products application to production environments.

## Backend Deployment

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

### Option 2: AWS EC2 Deployment

1. **Launch EC2 Instance** (Node.js AMI recommended)

2. **Connect via SSH and install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone repository**
```bash
git clone your-repo-url
cd backend
npm install
```

4. **Setup PM2 for process management**
```bash
npm install -g pm2
pm2 start server.js --name "shree-paper-api"
pm2 startup
pm2 save
```

5. **Setup Nginx as reverse proxy**
```bash
sudo apt-get install nginx
```

6. **Configure Nginx**
Create `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable HTTPS with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Azure App Service

1. **Create App Service**
```bash
az appservice plan create --name myplan --resource-group mygroup --sku B1
az webapp create --resource-group mygroup --plan myplan --name myapp
```

2. **Deploy from Git**
```bash
az webapp create --name myapp --resource-group mygroup --plan myplan --deployment-local-git
```

3. **Set Environment Variables**
```bash
az webapp config appsettings set --resource-group mygroup --name myapp \
  --settings MONGODB_URI=your_url JWT_SECRET=your_secret NODE_ENV=production
```

## Frontend Deployment

### Option 1: Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to vercel.com
- Connect your GitHub repo
- Select `frontend` directory
- Set environment variables

3. **Automatic deployments** on every push

### Option 2: Netlify Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Option 3: AWS S3 + CloudFront

1. **Build the project**
```bash
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync build/ s3://your-bucket-name
```

3. **Create CloudFront distribution** for CDN

4. **Set environment in .env**
```
REACT_APP_API_URL=https://api.your-domain.com/api
```

## Database Deployment

### MongoDB Atlas (Recommended)

1. Create account at mongodb.com/cloud/atlas
2. Create a Project and Cluster
3. Add Database User
4. Add IP to Network Access
5. Get connection string
6. Use in MONGODB_URI

## Environment Variables - Production

### Backend
```
MONGODB_URI=mongodb+srv://prod_user:password@production-cluster.mongodb.net/shree_paper_products
PORT=5000
NODE_ENV=production
JWT_SECRET=your-very-secure-secret-key-minimum-32-chars
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@shreepaper.com
ADMIN_PASSWORD=use-strong-password
```

### Frontend
```
REACT_APP_API_URL=https://api.your-domain.com/api
```

## SSL/HTTPS Configuration

### Self-signed Certificate
```bash
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

### Let's Encrypt (Recommended)
```bash
certbot certonly --standalone -d your-domain.com
```

## Performance Optimization

### Backend
- Enable gzip compression
- Implement rate limiting
- Add caching headers
- Monitor with APM tools (New Relic, DataDog)

### Frontend
- Enable code splitting
- Lazy load components
- Optimize images
- Use CDN for static assets
- Enable service workers

## Database Backups

### Automated MongoDB Atlas Backups
- Enabled by default in MongoDB Atlas
- Point-in-time restores available

### Manual Backup
```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/database"
```

## Monitoring & Logging

### Application Monitoring
- PM2 Monitoring Dashboard
- NewRelic APM
- DataDog
- CloudWatch (AWS)

### Log Management
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Sumologic
- Loggly
- CloudWatch Logs

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd backend && npm install && npm test
      - run: git push heroku main
```

## Security Checklist

- [ ] Change default admin credentials
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT_SECRET
- [ ] Enable CORS only for your domain
- [ ] Add rate limiting
- [ ] Implement request validation
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Enable database encryption
- [ ] Setup firewall rules
- [ ] Monitor for suspicious activity
- [ ] Implement logging
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection

## Troubleshooting

### Connection Issues
```bash
# Test Database Connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/database"
```

### Memory Issues
```bash
# Increase Node.js heap
NODE_OPTIONS=--max_old_space_size=4096 npm start
```

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

## Support & Maintenance

- Keep dependencies updated: `npm outdated`
- Monitor error logs regularly
- Perform security updates promptly
- Backup database frequently
- Test disaster recovery procedures

## Scaling Recommendations

- **Database**: Use MongoDB Atlas replication
- **Backend**: Use load balancer (AWS ELB, Nginx)
- **Frontend**: Use CDN (CloudFront, Cloudflare)
- **API**: Implement caching (Redis)
- **Session**: Use external session store (Redis)

## Cost Estimation

### Free Tier Options
- MongoDB Atlas: Free cluster (512MB)
- Heroku: Free tier (limited)
- Vercel: Free tier
- AWS: Free tier (first year)

### Production Pricing (Monthly Estimate)
- MongoDB Atlas: $57 (M10 cluster)
- Backend Server: $10-50 (depending on provider)
- Frontend Hosting: $0-10
- **Total**: ~$70-100/month minimum

## Support

For deployment issues, contact your hosting provider's support or refer to their documentation.
