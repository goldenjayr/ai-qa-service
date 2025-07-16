module.exports = {
  apps: [
    {
      script: 'automated-testing-scheduler.js',
      name: 'AUTOMATED-TESTING',
      exp_backoff_restart_delay: 100,
      restart_delay: 3000,
      instances: 1,
      exec_mode: 'cluster'
    }
  ]
}
