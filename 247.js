const { exec } = require('child_process');
const chalk = require('chalk');
const moment = require('moment');
const { loadConfig } = require('./config');
const gradient = require('gradient-string');
const boxen = require('boxen');
const ora = require('ora');
const figlet = require('figlet');
const os = require('os');

// Load configuration
const config = loadConfig();

// Process state tracking
let processAttempts = 0;
const MAX_ATTEMPTS = 10;
const COOLDOWN_TIME = 300000; // 5 minutes in milliseconds
let lastCrashTime = 0;

// ASCII Art Banner
function displayBanner() {
    console.log('\n' + gradient.rainbow(figlet.textSync('24/7 Manager', {
        font: 'Big',
        horizontalLayout: 'full'
    })));
    console.log(gradient.pastel('\n' + '='.repeat(80) + '\n'));
}

// Enhanced logging function
function advancedLog(type, message, subType = 'default') {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const types = {
        info: { color: chalk.blue('INFO'), icon: '🔵' },
        success: { color: chalk.green('SUCCESS'), icon: '🟢' },
        warning: { color: chalk.yellow('WARNING'), icon: '🟡' },
        error: { color: chalk.red('ERROR'), icon: '🔴' },
        system: { color: chalk.magenta('SYSTEM'), icon: '⚙️' },
        process: { color: chalk.cyan('PROCESS'), icon: '🔄' },
        monitor: { color: chalk.white('MONITOR'), icon: '📊' }
    };

    const decorations = {
        default: message,
        box: boxen(message, { 
            padding: 1, 
            margin: 1, 
            borderStyle: 'round',
            borderColor: type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'
        }),
        separator: '\n' + '─'.repeat(80) + '\n' + message + '\n' + '─'.repeat(80)
    };

    console.log(
        `[${chalk.gray(timestamp)}] ${types[type].icon} ${types[type].color} ${decorations[subType]}`
    );
}

// System monitoring
function getSystemStats() {
    const cpuUsage = os.loadavg()[0];
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = ((usedMem / totalMem) * 100).toFixed(2);
    
    return {
        cpu: cpuUsage.toFixed(2),
        memory: memoryUsage,
        platform: os.platform(),
        arch: os.arch(),
        uptime: Math.floor(os.uptime())
    };
}

// Process monitoring
function monitorProcess(process) {
    const stats = getSystemStats();
    advancedLog('monitor', `
        System Status:
        ├─ CPU Usage: ${stats.cpu}%
        ├─ Memory Usage: ${stats.memory}%
        ├─ Platform: ${stats.platform}
        ├─ Architecture: ${stats.arch}
        ├─ System Uptime: ${Math.floor(stats.uptime / 3600)}h ${Math.floor((stats.uptime % 3600) / 60)}m
        └─ Process Restarts: ${processAttempts}
    `, 'box');
}

// Enhanced bot startup function with config validation
function startBot() {
    // Validate config before starting
    if (!config.token || config.token === 'YOUR_TOKEN_HERE') {
        advancedLog('error', 'Invalid token in config.json. Please set your Discord token.', 'box');
        process.exit(1);
    }
    const currentTime = Date.now();
    const timeSinceLastCrash = currentTime - lastCrashTime;

    // Check for crash cooldown
    if (processAttempts > 0 && timeSinceLastCrash < COOLDOWN_TIME) {
        const waitTime = Math.ceil((COOLDOWN_TIME - timeSinceLastCrash) / 1000);
        advancedLog('warning', `Crash cooldown active. Waiting ${waitTime} seconds...`, 'box');
        setTimeout(startBot, COOLDOWN_TIME - timeSinceLastCrash);
        return;
    }

    // Check max attempts
    if (processAttempts >= MAX_ATTEMPTS) {
        advancedLog('error', `
            Maximum restart attempts (${MAX_ATTEMPTS}) reached!
            Please check the logs and resolve any issues.
            The process manager will now exit.
        `, 'box');
        process.exit(1);
    }

    // Start spinner
    const spinner = ora('Starting bot process...').start();
    
    const bot = exec('node index.js', (error) => {
        if (error) {
            spinner.fail('Bot process crashed');
            advancedLog('error', `
                Process Error Details:
                ├─ Code: ${error.code}
                ├─ Signal: ${error.signal}
                └─ Message: ${error.message}
            `, 'box');
            
            processAttempts++;
            lastCrashTime = Date.now();
            
            advancedLog('info', `Attempting restart ${processAttempts}/${MAX_ATTEMPTS} in 30 seconds...`);
            setTimeout(startBot, 30000);
            return;
        }
    });

    // Process output handling with improved formatting
    bot.stdout.on('data', (data) => {
        process.stdout.write(gradient.rainbow(`[BOT] `) + data);
    });

    bot.stderr.on('data', (data) => {
        process.stderr.write(chalk.red(`[ERROR] `) + data);
    });

    // Process monitoring
    const monitorInterval = setInterval(() => monitorProcess(bot), 60000);

    // Handle process exit
    bot.on('exit', (code, signal) => {
        clearInterval(monitorInterval);
        
        if (code !== 0) {
            spinner.fail(`Bot process exited with code ${code}`);
            advancedLog('warning', `
                Process Exit Details:
                ├─ Exit Code: ${code}
                ├─ Signal: ${signal}
                ├─ Attempt: ${processAttempts + 1}/${MAX_ATTEMPTS}
                └─ Next Restart: 30 seconds
            `, 'box');
            
            processAttempts++;
            lastCrashTime = Date.now();
            
            setTimeout(startBot, 30000);
        } else {
            spinner.succeed('Bot process exited cleanly');
            advancedLog('success', 'Clean shutdown detected. Not restarting.', 'box');
            process.exit(0);
        }
    });

    spinner.succeed('Bot process started successfully');
    advancedLog('success', `
        Process Manager Status:
        ├─ Bot Process: Running
        ├─ Process ID: ${bot.pid}
        ├─ Restart Attempts: ${processAttempts}
        └─ Monitoring: Active
    `, 'box');
}

// Enhanced shutdown handling
async function gracefulShutdown() {
    const spinner = ora('Initiating shutdown...').start();
    
    try {
        // Send SIGTERM to any running bot processes
        exec('pkill -f "node index.js"');
        
        spinner.succeed('Shutdown completed successfully');
        process.exit(0);
    } catch (error) {
        spinner.fail('Error during shutdown');
        advancedLog('error', `Shutdown error: ${error.message}`, 'box');
        process.exit(1);
    }
}

// Process event handlers
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (error) => {
    advancedLog('error', `
        Unhandled Rejection:
        ├─ Message: ${error.message}
        ├─ Name: ${error.name}
        └─ Stack: ${error.stack}
    `, 'box');
});

process.on('uncaughtException', (error) => {
    advancedLog('error', `
        Uncaught Exception:
        ├─ Message: ${error.message}
        ├─ Name: ${error.name}
        └─ Stack: ${error.stack}
    `, 'box');
    gracefulShutdown();
});

// Initialize
displayBanner();
advancedLog('info', 'Process Manager Initialized', 'separator');
startBot();

// Keep the process alive
process.stdin.resume();
