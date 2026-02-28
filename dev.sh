#!/bin/bash

# --- Config ---
PORT=8123
URL="http://localhost:$PORT"
CHROME_BIN=$(which google-chrome || which google-chrome-stable || which chromium-browser || which chromium)
USER_DATA_DIR="/tmp/shipment_tool_chrome_dev"

# --- Initialization ---
echo "--- Shipment Tool: Dev Launcher ---"

# Step 1: Check if Chrome/Chromium exists
if [ -z "$CHROME_BIN" ]; then
    echo "Error: Chromium or Google Chrome was not found on your system."
    exit 1
fi

# Step 2: Ensure any old server handles are cleaned up (optional but recommended)
echo "Checking for existing server on port $PORT..."
fuser -k $PORT/tcp >/dev/null 2>&1

# Step 3: Start the local server in the background
echo "Starting local web server on port $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

# Step 4: Ensure the server stops when we exit this script
trap "kill $SERVER_PID; echo 'Exiting... Server Stopped.'; exit" INT TERM EXIT

# Step 5: Launch Chrome with Web Security disabled
# Note: --disable-web-security requires --user-data-dir to be active
echo "Launching Browser (CORS security disabled)..."
echo "URL: $URL"

"$CHROME_BIN" \
    --disable-web-security \
    --user-data-dir="$USER_DATA_DIR" \
    --no-first-run \
    --no-default-browser-check \
    --window-size=1200,900 \
    "$URL"

# Wait for process to finish
wait $SERVER_PID
