# Discord Selfbot (Educational Purposes Only)

⚠️ **IMPORTANT DISCLAIMER** ⚠️
This selfbot is created for educational purposes only. Using selfbots is against Discord's Terms of Service and can result in account termination. Use at your own risk.

## Features
- Advanced console logging with timestamps and colors
- Uptime tracking
- Custom presence status
- Error handling and graceful shutdown
- English language support

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure the bot:
- Open `index.js`
- Replace `YOUR_TOKEN_HERE` with your Discord account token

3. Run the bot:
```bash
node index.js
```

## Console Output Features
- Timestamp for each log entry
- Color-coded log types:
  - 🔵 INFO: General information
  - 🟢 SUCCESS: Successful operations
  - 🟡 WARNING: Warning messages
  - 🔴 ERROR: Error messages
- Uptime tracking (updates every minute)

## Status Options
You can modify the online status in `index.js` by changing the `setStatus` parameter:
- Available options: 'online', 'idle', 'dnd', 'invisible'

## ⚠️ Security Warning
Never share your Discord token with anyone. The token provides full access to your Discord account.

## 24/7 Operation (Not Recommended)
For educational purposes, a `247.js` script is included that can keep the bot running continuously:
```bash
node 247.js
```

Features of 24/7 mode:
- Automatic restart if the bot crashes
- 30-second delay between restart attempts
- Advanced error logging
- Process monitoring

⚠️ **Warning**: Running a selfbot 24/7 significantly increases the risk of detection and account termination.

## Educational Purpose
This code demonstrates:
- Node.js application structure
- Event handling in Discord.js
- Advanced logging implementation
- Process management and error handling
- Continuous operation techniques
