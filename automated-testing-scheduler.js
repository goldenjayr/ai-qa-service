import dotenv from 'dotenv'
import { AsyncTask, ToadScheduler, CronJob } from 'toad-scheduler'
import { spawn } from 'child_process'
import path from 'path'
import process from 'process'

dotenv.config()

const scheduler = new ToadScheduler()

const task_automated_testing = new AsyncTask(
  'automated_testing',
  async () => {
    console.log(`[${new Date().toISOString()}] Starting daily_web_audit.py...`)
    try {
      // Resolve script path
      const scriptPath = path.resolve(process.cwd(), 'daily_web_audit.py')
      // Use 'uv' if available, else fallback to 'python3'
      const interpreter = process.env.UV_BIN || 'uv'
      const interpreterArgs = ['run', '--env-file', '.env', scriptPath]
      const child = spawn(interpreter, interpreterArgs, { stdio: ['ignore', 'pipe', 'pipe'] })

      child.stdout.on('data', data => process.stdout.write(`[PYTHON OUT] ${data}`))
      child.stderr.on('data', data => process.stderr.write(`[PYTHON ERR] ${data}`))

      await new Promise((resolve, reject) => {
        child.on('close', code => {
          if (code === 0) {
            console.log(`[${new Date().toISOString()}] daily_web_audit.py completed successfully.`)
            resolve()
          } else {
            reject(new Error(`daily_web_audit.py exited with code ${code}`))
          }
        })
      })
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Error running daily_web_audit.py:`, err)
    }
  }
)

console.log(`[${new Date().toISOString()}] Automated testing scheduler started.`)

// === Automated Testing Schedule Configuration ===
const AUTOMATED_TEST_HOUR = 11; // 24-hour format
const AUTOMATED_TEST_MINUTE = 0;

// Schedule to run every day at the configured time
const job = new CronJob({ cronExpression: `${AUTOMATED_TEST_MINUTE} ${AUTOMATED_TEST_HOUR} * * *` }, task_automated_testing)
scheduler.addCronJob(job)

// Log server system time every hour
const task_log_time = new AsyncTask(
  'log_system_time',
  async () => {
    const now = new Date()
    // Calculate next automated testing time (local server time)
    const nextRun = new Date(now)
    nextRun.setHours(AUTOMATED_TEST_HOUR, AUTOMATED_TEST_MINUTE, 0, 0)
    if (now >= nextRun) {
      // If past today's scheduled time, set to tomorrow
      nextRun.setDate(nextRun.getDate() + 1)
    }
    const diffMs = nextRun - now
    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60)
    const diffMin = Math.floor((diffMs / 1000 / 60) % 60)
    const diffSec = Math.floor((diffMs / 1000) % 60)
    const countdown = `${diffHrs.toString().padStart(2, '0')}:${diffMin.toString().padStart(2, '0')}:${diffSec.toString().padStart(2, '0')}`
    console.log(`[${now.toISOString()}] Server system time: ${now.toString()} | Countdown to next automated testing: ${countdown}`)
  }
)
const hourlyJob = new CronJob({ cronExpression: '0 * * * *' }, task_log_time)
scheduler.addCronJob(hourlyJob)


