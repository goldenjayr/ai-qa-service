#!/bin/bash
# setup-pm2-main-2.sh
# This script sets up PM2 to run main-2.py daily using uv
# You can adjust the CRON_SCHEDULE variable to change the run time

# Path to your script
SCRIPT_PATH="$(dirname "$0")/daily_web_audit.py"

# Name for the PM2 process
PROCESS_NAME="daily-web-audit"

# Cron schedule (default: 2:00 AM daily)
CRON_SCHEDULE="0 2 * * *"

# Find uv binary
UV_BIN=$(which uv)
if [ -z "$UV_BIN" ]; then
  echo "Error: 'uv' is not installed or not in PATH. Please install uv first."
  exit 1
fi

# Start the script with PM2 and schedule it
pm2 start "$SCRIPT_PATH" \
  --interpreter="$UV_BIN" \
  --interpreter-args="run" \
  --name "$PROCESS_NAME" \
  --cron "$CRON_SCHEDULE"

# Save the PM2 process list
pm2 save

echo "\nPM2 process '$PROCESS_NAME' scheduled with cron: $CRON_SCHEDULE"
echo "To change the schedule, edit CRON_SCHEDULE in this script or run:"
echo "  pm2 restart $PROCESS_NAME --cron 'NEW_CRON_EXPRESSION'"
echo "\nTo enable PM2 on system startup, run:"
echo "  pm2 startup"
