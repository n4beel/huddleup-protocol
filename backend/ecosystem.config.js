module.exports = {
    apps: [{
      name: "nest-api", // The name PM2 will show
      script: "dist/main.js", // The entry point of your built NestJS app
      
      // This tells PM2 to load the .env file in this *same directory*
      // Your workflow will create this .env file from secrets
      env_file: ".env", 
      
      // Non-secret environment variables can go here
      env: {
        "NODE_ENV": "production",
        // Your Nginx is listening on port 80/443 and proxying to this port
        "PORT": 3000 
      },
      
      watch: false, // PM2 shouldn't watch; workflow handles restarts
      max_memory_restart: "1G", // Or as needed
    }]
  };