# Discord Status Customizer (Educational Purposes Only)

⚠️ **DISCLAIMER** ⚠️
This tool is for educational purposes only. Using selfbots is against Discord's Terms of Service and can result in account termination. Use at your own risk.

## 🌟 Features

### 🔄 Core
- Advanced console logging
- Real-time system monitoring (CPU, Memory, Uptime)
- Auto-status rotation with multiple activity types
- Connection quality monitoring
- Enhanced error handling and crash recovery
- Rate limit protection
- Graceful shutdown
- Token validation and secure login

### 📊 Monitoring
- CPU, Memory, and Network usage tracking
- Guild/Friend/Channel statistics
- Connection quality analysis
- Process health monitoring

### 🎨 Visual Enhancements
- Gradient text effects
- ASCII art banners
- Progress bars and loading spinners
- Boxed status messages
- Color-coded log levels
- Centered text formatting
- Table-formatted statistics
- Custom status icons

### 🛡️ Reliability
- Automatic crash recovery
- Rate limit handling
- Connection retry mechanism
- Process monitoring
- Graceful shutdown
- Error stack traces
- Cooldown periods after crashes
- Maximum restart attempt limits

## 🚀 Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the bot:
- On first run, a `config.json` file will be created
- Edit `config.json` and add your Discord token
- Customize other settings as needed:
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
          { "text": "📺 Streaming", "type": "STREAMING" },
          { "text": "🎯 Custom Status", "type": "CUSTOM" }
        ]
      },
      "monitoring": {
        "enabled": true,
        "interval": 60000,
        "logSystem": true,
        "logNetwork": true
      },
      "logging": {
        "colors": true,
        "timestamps": true,
        "decorations": true
      }
    }
  }
  ```

3. Security:
- The `config.json` file is automatically added to `.gitignore`
- Never share your `config.json` file as it contains your token
- Keep your token secure and private

4. Run the bot:
```bash
# Standard mode
npm start

# Development mode with auto-restart
npm run dev
```

## 🎯 Console Output Features

### Log Types
- 🔵 INFO: General information
- 🟢 SUCCESS: Successful operations
- 🟡 WARNING: Warning messages
- 🔴 ERROR: Error messages
- ⚙️ SYSTEM: System statistics
- 🌐 NETWORK: Network status
- 📊 STATS: Statistical information

### Visual Elements
- Timestamp for each log entry
- Color-coded messages
- Boxed important messages
- Progress bars
- Loading spinners
- ASCII art banners
- Gradient text effects
- Separator lines
- Table formatting

## ⚠️ Security Warning
Never share your Discord token with anyone. The token provides full access to your Discord account.

## 🎓 Educational Value
This project demonstrates:
- Advanced Node.js application architecture
- Complex event handling
- Process management techniques
- System monitoring implementation
- Error handling strategies
- Visual feedback systems
- Resource management
- Network monitoring
- State management

## 🛠️ Technical Requirements
- Node.js >= 16.x
- NPM >= 7.x
- Modern terminal with Unicode support
- Color terminal support
