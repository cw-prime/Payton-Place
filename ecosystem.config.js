module.exports = {
  apps: [
    {
      name: 'payton-place-backend',
      script: './backend/dist/server.js',
      cwd: '/opt/apps/payton-place',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: '/opt/apps/payton-place/logs/backend-error.log',
      out_file: '/opt/apps/payton-place/logs/backend-out.log',
      log_file: '/opt/apps/payton-place/logs/backend-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
