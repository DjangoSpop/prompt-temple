# Production Deployment Guide

## Overview

This guide covers deploying PromptTemple to production with best practices for scalability, security, and reliability.

## Prerequisites

- Node.js 18.18.0+ installed
- Docker (optional, for containerized deployment)
- Access to Django backend API
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

## Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

1. **Connect Repository**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

2. **Configure Environment Variables**

In Vercel dashboard, set:
```
BACKEND_URL=https://api.prompt-temple.com
NEXTAUTH_SECRET=your-production-secret (generate with: openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com
```

3. **Custom Domain**
- Add your domain in Vercel dashboard
- Update DNS records
- SSL is automatic

### Option 2: Docker + Docker Compose

1. **Build Docker Image**

```dockerfile
# Dockerfile (already configured)
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - BACKEND_URL=https://api.prompt-temple.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://your-domain.com
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

3. **Deploy**

```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f frontend

# Scale instances
docker-compose up -d --scale frontend=3
```

### Option 3: VPS (Ubuntu/Debian)

1. **Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Clone and Setup**

```bash
# Clone repository
git clone https://github.com/your-org/prompt-temple.git
cd prompt-temple

# Install dependencies
npm ci --only=production

# Build
npm run build
```

3. **Configure PM2**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'prompt-temple',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      BACKEND_URL: 'https://api.prompt-temple.com',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: 'https://your-domain.com'
    }
  }]
};
```

4. **Start with PM2**

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Monitor
pm2 monit
```

5. **Configure Nginx**

```nginx
# /etc/nginx/sites-available/prompt-temple
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API proxy with caching
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
    }
}
```

6. **Enable Site**

```bash
# Link configuration
sudo ln -s /etc/nginx/sites-available/prompt-temple /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Environment Variables

### Required Variables

```bash
# Backend Configuration
BACKEND_URL=https://api.prompt-temple.com

# Authentication
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=https://your-production-domain.com

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_ENVIRONMENT=production
```

### Optional Variables

```bash
# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Analytics
ANALYTICS_API_KEY=your-analytics-key
SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_TEAMS=true
ENABLE_BILLING=true

# Database (if using direct connection)
DATABASE_URL=postgresql://user:pass@localhost:5432/prompttemple
```

## Security Checklist

- [x] SSL/TLS configured (HTTPS only)
- [x] Security headers enabled (CSP, X-Frame-Options, etc.)
- [x] Environment variables secured (not in code)
- [x] NEXTAUTH_SECRET is strong and unique
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] SQL injection prevention (parameterized queries)
- [x] XSS protection (React escapes by default)
- [x] CSRF tokens for mutations
- [x] Authentication tokens expire
- [x] Sensitive data not logged
- [x] Dependencies updated regularly

## Performance Optimization

### 1. Enable Caching

```typescript
// next.config.ts
const nextConfig = {
  // ... other config
  compress: true,
  swcMinify: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: ['your-cdn.com'],
    minimumCacheTTL: 86400, // 24 hours
  },
};
```

### 2. CDN Configuration

Use Cloudflare, AWS CloudFront, or similar:

```
User → CDN (cache static assets) → Next.js Server → Django API
```

### 3. Database Optimization

```bash
# Enable connection pooling
DATABASE_URL=postgresql://user:pass@localhost/db?pool_timeout=30&connection_limit=20
```

### 4. Redis Caching

```typescript
// Cache API responses
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

// Cache GET requests
const cacheKey = `api:${endpoint}:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

// ... fetch from backend ...
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min TTL
```

## Monitoring & Logging

### 1. Application Monitoring

**Vercel Analytics (Vercel deployments)**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Custom Monitoring**
```typescript
// Log performance metrics
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}
```

### 2. Error Tracking

**Sentry Integration**
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 3. Logging

**Structured Logging**
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (message: string, error: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};
```

## Health Checks

### Application Health

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    frontend: 'healthy',
    backend: await checkBackend(),
    database: await checkDatabase(),
    redis: await checkRedis(),
  };

  const status = Object.values(checks).every(s => s === 'healthy')
    ? 'healthy'
    : 'degraded';

  return NextResponse.json({
    status,
    checks,
    timestamp: new Date().toISOString(),
  }, {
    status: status === 'healthy' ? 200 : 503
  });
}
```

### Liveness Probe

```bash
# Kubernetes liveness probe
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Backup & Disaster Recovery

### 1. Database Backups

```bash
# Automated daily backups
0 2 * * * pg_dump dbname > /backups/db-$(date +\%Y\%m\%d).sql
```

### 2. File Storage Backups

```bash
# Backup uploads and user data
aws s3 sync /app/uploads s3://bucket/backups/$(date +\%Y\%m\%d)/
```

### 3. Disaster Recovery Plan

1. **Database**: Restore from latest backup
2. **Application**: Deploy from Git tag
3. **DNS**: Switch to backup server if needed
4. **Monitoring**: Alert team immediately

## Scaling Strategies

### Horizontal Scaling

```bash
# PM2 cluster mode
pm2 start app.js -i max

# Docker Swarm
docker service scale frontend=5

# Kubernetes
kubectl scale deployment frontend --replicas=10
```

### Vertical Scaling

```bash
# Increase container resources
docker run -m 4g --cpus=2 frontend

# PM2 with more memory
NODE_OPTIONS=--max-old-space-size=4096 pm2 start app.js
```

## Troubleshooting

### Common Issues

**Issue**: 502 Bad Gateway
- Check if Next.js is running: `pm2 status`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Restart services: `pm2 restart all && sudo systemctl restart nginx`

**Issue**: High Memory Usage
- Check for memory leaks: `pm2 monit`
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Add more instances: `pm2 scale app +2`

**Issue**: Slow Response Times
- Check backend API health
- Enable caching (Redis)
- Use CDN for static assets
- Optimize database queries

**Issue**: Connection Timeouts
- Increase Nginx timeout: `proxy_read_timeout 300s;`
- Check backend availability
- Implement retry logic

## Maintenance

### Regular Tasks

**Daily**
- Monitor error logs
- Check application health
- Review performance metrics

**Weekly**
- Update dependencies: `npm audit fix`
- Review and optimize slow queries
- Check disk space

**Monthly**
- Security audit: `npm audit`
- Backup verification
- Performance review
- Update documentation

### Zero-Downtime Deployments

```bash
# Blue-Green deployment
1. Deploy new version to blue environment
2. Run health checks on blue
3. Switch traffic from green to blue
4. Keep green as rollback option

# With PM2
pm2 reload ecosystem.config.js
```

## Support & Resources

- **Documentation**: https://docs.prompt-temple.com
- **API Reference**: https://api.prompt-temple.com/docs
- **Status Page**: https://status.prompt-temple.com
- **Support Email**: support@prompt-temple.com

---

**Last Updated**: 2024-11-15
**Production Ready**: ✅ Yes
**Deployment Tested**: Vercel, Docker, VPS
