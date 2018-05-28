module.exports = {
  apps : [{
    name   : "api",
    script : "./app.js",
    watch: true,
    ignore_watch: ["uploads/*","*.csv", "*.sql", "schema/*", "test/*"],
    env: {
      "NODE_ENV": "development",
      "API_BASE_URL": "http://localhost:3000/v1/"
    },
    env_production : {
       "NODE_ENV": "production",
       "API_BASE_URL": "http://pone.speachlesslee.com/v1/"
    }
  }]
}
