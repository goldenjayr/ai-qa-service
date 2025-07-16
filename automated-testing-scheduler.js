import dotenv from 'dotenv'
import { AsyncTask, ToadScheduler, SimpleIntervalJob } from 'toad-scheduler'
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
        child.on('error', reject)
      })
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Error running daily_web_audit.py:`, err)
    }
  }
)

const automated_testing = new SimpleIntervalJob(
  { days: 1, runImmediately: true },
  task_automated_testing,
  { preventOverrun: true }
)

scheduler.addSimpleIntervalJob(automated_testing)
