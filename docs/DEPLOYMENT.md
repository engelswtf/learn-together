# Deploying LearnTogether

This guide covers deploying LearnTogether to a production environment.

## Prerequisites

- Node.js 18+ installed
- PM2 process manager (`npm install -g pm2`)
- A reverse proxy (Caddy, Nginx, or similar)
- Domain name (optional but recommended)

## Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized production build in the `.next` directory.

## Running with PM2

PM2 is a production process manager that keeps your app running and restarts it if it crashes.

### Start the Application

```bash
# Start using the ecosystem config
pm2 start ecosystem.config.js

# Or start manually
pm2 start npm --name "learn-together" -- start
```

### PM2 Configuration

The `ecosystem.config.js` file configures PM2:

```javascript
module.exports = {
  apps: [{
    name: 'learn-together',
    script: 'node_modules/.bin/ts-node',
    args: '--project tsconfig.server.json server.ts',
    cwd: '/root/learn-together',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/root/learn-together/logs/error.log',
    out_file: '/root/learn-together/logs/out.log',
    log_file: '/root/learn-together/logs/combined.log',
    time: true
  }]
};
```

### PM2 Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs learn-together

# Monitor resources
pm2 monit

# Restart application
pm2 restart learn-together

# Stop application
pm2 stop learn-together

# Delete from PM2
pm2 delete learn-together
```

### Auto-start on Boot

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

## Reverse Proxy Configuration

### Caddy (Recommended)

Caddy automatically handles HTTPS certificates.

```
# /etc/caddy/Caddyfile

learn.example.com {
    reverse_proxy localhost:3000
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
```

### Nginx

```nginx
# /etc/nginx/sites-available/learn-together

server {
    listen 80;
    server_name learn.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/learn-together /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

For HTTPS, use Certbot:
```bash
sudo certbot --nginx -d learn.example.com
```

## WebSocket Configuration

LearnTogether uses Socket.io for real-time multiplayer features. Make sure your reverse proxy supports WebSocket connections.

### Caddy

WebSocket support is automatic with `reverse_proxy`.

### Nginx

The configuration above includes WebSocket support via:
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Set to `production` for production |
| `PORT` | `3000` | Port the server listens on |

## Data Persistence

Player progress is stored in `data/progress/` as JSON files. Make sure this directory:

1. **Exists**: Create it if needed
   ```bash
   mkdir -p data/progress
   ```

2. **Has proper permissions**: The Node.js process needs read/write access
   ```bash
   chmod 755 data/progress
   ```

3. **Is backed up**: Include in your backup strategy

## Logs

Logs are stored in the `logs/` directory:

- `out.log` - Standard output
- `error.log` - Error output
- `combined.log` - Both combined

### Log Rotation

PM2 has built-in log rotation:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Health Checks

The application serves on port 3000 by default. You can check if it's running:

```bash
curl http://localhost:3000
```

For monitoring, you can add a health endpoint or use PM2's built-in monitoring.

## Updating the Application

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart learn-together
```

## Troubleshooting

### Application won't start

1. Check logs:
   ```bash
   pm2 logs learn-together --lines 100
   ```

2. Verify Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

3. Check if port is in use:
   ```bash
   lsof -i :3000
   ```

### WebSocket connections failing

1. Check reverse proxy configuration
2. Verify firewall allows WebSocket connections
3. Check browser console for connection errors

### Progress not saving

1. Verify `data/progress` directory exists
2. Check directory permissions
3. Look for errors in logs

### High memory usage

1. Check PM2 memory limit in ecosystem.config.js
2. Monitor with `pm2 monit`
3. Consider increasing `max_memory_restart`

## Security Considerations

1. **Run behind a reverse proxy**: Don't expose Node.js directly
2. **Use HTTPS**: Let Caddy or Certbot handle certificates
3. **Firewall**: Only expose ports 80 and 443
4. **Updates**: Keep Node.js and dependencies updated
5. **Backups**: Regularly backup the `data/progress` directory

## Container Deployment (LXC/Docker)

If running in a container:

1. Ensure the container has network access
2. Map the port (e.g., 3000)
3. Mount the data directory for persistence
4. Configure the reverse proxy on the host

### LXC Example

```bash
# Create container
pct create 108 local:vztmpl/debian-12-standard_12.0-1_amd64.tar.zst \
  --hostname learn-together \
  --memory 1024 \
  --cores 2 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp

# Start and enter
pct start 108
pct enter 108

# Install Node.js and deploy
```

### Docker Example

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t learn-together .
docker run -d -p 3000:3000 -v ./data:/app/data learn-together
```
