const { Client } = require('discord.js-selfbot-v13');
const chalk = require('chalk');
const moment = require('moment');
const gradient = require('gradient-string');
const os = require('os');
const boxen = require('boxen');
const ora = require('ora');
const cliProgress = require('cli-progress');
const figlet = require('figlet');
const config = require('./config.json');

// Initialize client with improved options
const client = new Client({
    checkUpdate: false,
    language: 'en-US',
    autoRedeemNitro: false,
    captchaService: 'custom',
    wsEventLimit: 100,
    patchVoice: false,
    syncStatus: false,
    readyTimeout: 30000,
    ws: {
        properties: {
            $browser: 'Discord Client',
            $device: 'Discord Client',
            $os: process.platform
        }
    },
    // Disable user settings
    userSettingsCache: false,
    userSettings: {
        all: false,
        sync: false
    }
});

// ASCII Art Banner
function displayBanner() {
    console.log('\n' + gradient.rainbow(figlet.textSync('Always Online', {
        font: 'Big',
        horizontalLayout: 'full'
    })));
    console.log(gradient.pastel('\n' + '='.repeat(80) + '\n'));
}

// Enhanced console logging function with decorations
function advancedLog(type, message, subType = 'default') {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const types = {
        info: { color: chalk.blue('INFO'), icon: '🔵' },
        success: { color: chalk.green('SUCCESS'), icon: '🟢' },
        warning: { color: chalk.yellow('WARNING'), icon: '🟡' },
        error: { color: chalk.red('ERROR'), icon: '🔴' },
        system: { color: chalk.magenta('SYSTEM'), icon: '⚙️' },
        network: { color: chalk.cyan('NETWORK'), icon: '🌐' },
        stats: { color: chalk.white('STATS'), icon: '📊' }
    };

    const decorations = {
        default: message,
        box: boxen(message, { padding: 1, margin: 1, borderStyle: 'round' }),
        separator: '\n' + '─'.repeat(80) + '\n' + message + '\n' + '─'.repeat(80)
    };

    console.log(
        `[${chalk.gray(timestamp)}] ${types[type].icon} ${types[type].color} ${decorations[subType]}`
    );
}

// System monitoring functions
function getSystemStats() {
    const cpuUsage = os.loadavg()[0];
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = ((usedMem / totalMem) * 100).toFixed(2);
    
    return {
        cpu: cpuUsage.toFixed(2),
        memory: memoryUsage,
        uptime: getUptime()
    };
}

// Enhanced uptime calculation
function getUptime() {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Status rotation system
let currentStatusIndex = 0;
function rotateStatus() {
    if (!config.settings.status.enabled || !config.settings.status.rotation) return;
    
    const options = config.settings.status.options;
    const status = options[currentStatusIndex];
    client.user.setActivity(status.text, { type: status.type });
    currentStatusIndex = (currentStatusIndex + 1) % options.length;
}

// Progress bar for startup
const startupBar = new cliProgress.SingleBar({
    format: chalk.cyan('{bar}') + ' | {percentage}% | {stage}',
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true
});

// Connection quality monitoring
let lastPing = 0;
function monitorConnection() {
    const currentPing = client.ws.ping;
    const pingDiff = Math.abs(currentPing - lastPing);
    
    if (pingDiff > 100) {
        advancedLog('warning', `High ping variation detected: ${pingDiff}ms`, 'box');
    }
    
    lastPing = currentPing;
}

// Ready event with enhanced initialization
client.on('ready', async () => {
    try {
        displayBanner();
        
        // Initialize startup progress
        startupBar.start(100, 0, { stage: 'Initializing...' });
        
        // Simulate startup stages
        for (let i = 0; i <= 100; i += 20) {
            await new Promise(resolve => setTimeout(resolve, 200));
            startupBar.update(i, { stage: `Loading... ${i}%` });
        }
        startupBar.stop();

        // Initialize settings if needed
        if (!client.user.settings) {
            client.user.settings = { all: {} };
        }

        // Safely set initial status if enabled
        if (config.settings.status.enabled) {
            try {
                // Set presence instead of status for better compatibility
                await client.user.setPresence({
                    status: config.settings.status.initialStatus,
                    activities: []
                }).catch(err => {
                    advancedLog('warning', `Failed to set initial presence: ${err.message}`, 'box');
                });
            } catch (statusError) {
                advancedLog('warning', `Status setting error: ${statusError.message}`, 'box');
            }
        }

        // Modified status rotation handling
        if (config.settings.status.enabled && config.settings.status.rotation) {
            try {
                rotateStatus();
                setInterval(rotateStatus, config.settings.status.interval);
            } catch (rotationError) {
                advancedLog('warning', `Status rotation error: ${rotationError.message}`, 'box');
            }
        }

        // Display initial statistics if monitoring enabled
        try {
            const stats = {
                guilds: client.guilds.cache.size,
                friends: client.relationships?.friendCount || 0,
                ping: client.ws.ping,
                ...getSystemStats()
            };

            advancedLog('success', `Logged in as ${client.user.tag}`, 'box');
            advancedLog('stats', `
                📊 Statistics:
                ├─ Guilds: ${stats.guilds}
                ├─ Friends: ${stats.friends}
                ├─ Ping: ${stats.ping}ms
                ├─ CPU Usage: ${stats.cpu}%
                ├─ Memory Usage: ${stats.memory}%
                └─ Uptime: ${stats.uptime}
            `, 'box');
        } catch (statsError) {
            advancedLog('warning', `Stats collection error: ${statsError.message}`, 'box');
        }

        // Start monitoring intervals if enabled
        if (config.settings.monitoring.enabled) {
            try {
                setInterval(() => {
                    try {
                        const currentStats = {
                            ...getSystemStats(),
                            ping: client.ws.ping
                        };
                        
                        if (config.settings.monitoring.logSystem) {
                            advancedLog('system', `
                                💻 System Status:
                                ├─ CPU: ${currentStats.cpu}%
                                ├─ Memory: ${currentStats.memory}%
                                ├─ Ping: ${currentStats.ping}ms
                                └─ Uptime: ${currentStats.uptime}
                            `, 'separator');
                        }
                        
                        if (config.settings.monitoring.logNetwork) {
                            monitorConnection();
                        }
                    } catch (monitorError) {
                        advancedLog('warning', `Monitoring error: ${monitorError.message}`, 'box');
                    }
                }, config.settings.monitoring.interval);
            } catch (intervalError) {
                advancedLog('warning', `Failed to start monitoring: ${intervalError.message}`, 'box');
            }
        }
    } catch (error) {
        advancedLog('error', `
        ❌ Error Details:
        ├─ Message: ${error.message}
        ├─ Name: ${error.name}
        └─ Stack: ${error.stack}
        `, 'box');
    }
});

// Enhanced error handling
client.on('error', error => {
    advancedLog('error', `
    ❌ Error Details:
    ├─ Message: ${error.message}
    ├─ Name: ${error.name}
    └─ Stack: ${error.stack}
    `, 'box');
});

// Warning handling with improved visibility
client.on('warn', warning => {
    advancedLog('warning', warning, 'box');
});

// Rate limit handling
client.on('rateLimit', (rateLimitInfo) => {
    advancedLog('warning', `
    ⚠️ Rate Limit Hit:
    ├─ Timeout: ${rateLimitInfo.timeout}ms
    ├─ Limit: ${rateLimitInfo.limit}
    └─ Method: ${rateLimitInfo.method}
    `, 'box');
});

// Improved shutdown handling
async function gracefulShutdown() {
    const spinner = ora('Shutting down...').start();
    
    try {
        // Cleanup tasks
        clearInterval(rotateStatus);
        await client.user.setStatus('invisible');
        await client.destroy();
        
        spinner.succeed('Shutdown completed successfully');
        process.exit(0);
    } catch (error) {
        spinner.fail('Error during shutdown');
        advancedLog('error', `Shutdown error: ${error.message}`);
        process.exit(1);
    }
}

// Graceful shutdown triggers
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Enhanced error handling for unhandled rejections
process.on('unhandledRejection', (error) => {
    advancedLog('error', `
    ❌ Unhandled Rejection:
    ├─ Message: ${error.message}
    ├─ Name: ${error.name}
    └─ Stack: ${error.stack}
    `, 'box');
});

// Login with retry mechanism
async function attemptLogin(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await client.login(config.token);
            return;
        } catch (error) {
            if (i === retries - 1) {
                advancedLog('error', `Failed to login after ${retries} attempts: ${error.message}`, 'box');
                process.exit(1);
            }
            advancedLog('warning', `Login attempt ${i + 1} failed, retrying in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

attemptLogin();

// Add error handler for specific user settings error
client.on('raw', (packet) => {
    if (packet.t === 'READY') {
        try {
            // Force initialize user settings to prevent errors
            if (!client.user.settings) {
                client.user.settings = { all: {} };
            }
        } catch (e) {
            advancedLog('warning', `Settings initialization skipped: ${e.message}`, 'box');
        }
    }
});
