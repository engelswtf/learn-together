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
