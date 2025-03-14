# Discord Status Customizer v2.0.5

⚠️ **DISCLAIMER** ⚠️
This tool is for educational purposes only. Using selfbots is against Discord's Terms of Service and can result in account termination. Use at your own risk.

## 🌟 Features

### 🔄 Core
- Advanced console logging with error tracking
- Real-time system monitoring (CPU, Memory, Uptime)
- Auto-status rotation with multiple activity types
- Connection quality monitoring with ping analysis
- Enhanced error handling and crash recovery
- Rate limit protection with automatic cooldown
- Token validation and secure login with retries
- User settings optimization for better stability

### 📊 Monitoring & Visuals
- CPU, Memory, and Network usage tracking
- Guild/Friend/Channel statistics
- Connection quality analysis with alerts
- Process health monitoring with recovery
- Progress bars and loading spinners
- Color-coded log levels with icons
- ASCII art banners with gradients

## 🚀 Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the bot:
- Create and edit `config.json`:
  ```json
  {
    "token": "YOUR_TOKEN_HERE",
    "settings": {
      "status": {
        "enabled": true,
        "rotation": true,
        "interval": 300000,
        "initialStatus": "online",
        "options": [
          { "text": "🎮 Gaming", "type": "PLAYING" },
          { "text": "🎵 Music", "type": "LISTENING" },
          { "text": "📺 Streaming", "type": "STREAMING" }
        ]
      },
      "monitoring": {
        "enabled": true,
        "interval": 60000,
        "logSystem": true,
        "logNetwork": true
      }
    }
  }
  ```

3. Run the bot:
```bash
npm start    # Standard mode
npm run dev  # Development mode with auto-restart
```

## 🔍 Log Types
- 🔵 INFO: General information
- 🟢 SUCCESS: Successful operations
- 🟡 WARNING: Warning messages
- 🔴 ERROR: Error messages
- ⚙️ SYSTEM: System statistics
- 🌐 NETWORK: Network status

## ⚙️ Requirements
- Node.js >= 16.x
- NPM >= 7.x
- Memory: 512MB minimum
- CPU: 1 core minimum

## 📝 Changelog v2.0.5
- Enhanced user settings handling
- Improved error recovery system
- Added connection quality monitoring
- Improved startup sequence
- Added detailed logging
- Fixed stability issues
- Added automatic retry mechanism
- Enhanced shutdown process
