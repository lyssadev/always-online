const { exec } = require('child_process');
const chalk = require('chalk');
const moment = require('moment');

// Advanced logging function
function advancedLog(type, message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const types = {
        info: chalk.blue('INFO'),
        success: chalk.green('SUCCESS'),
        warning: chalk.yellow('WARNING'),
        error: chalk.red('ERROR')
    };
    
    console.log(`[${chalk.gray(timestamp)}] ${types[type] || types.info} ${message}`);
}

// Function to start the bot
function startBot() {
    const bot = exec('node index.js', (error) => {
        if (error) {
            advancedLog('error', `Error: ${error.message}`);
            advancedLog('info', 'Attempting to restart in 30 seconds...');
            setTimeout(startBot, 30000);
            return;
        }
    });

    // Handle bot output
    bot.stdout.on('data', (data) => {
        process.stdout.write(data);
    });

    bot.stderr.on('data', (data) => {
        process.stderr.write(data);
    });

    // Restart bot if it exits
    bot.on('exit', (code) => {
        advancedLog('warning', `Bot process exited with code ${code}`);
        advancedLog('info', 'Restarting bot in 30 seconds...');
        setTimeout(startBot, 30000);
    });
}

// Handle process termination
process.on('SIGINT', () => {
    advancedLog('warning', 'Received SIGINT. Shutting down...');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    advancedLog('error', `Unhandled rejection: ${error.message}`);
});

// Initial start
advancedLog('info', 'Starting 24/7 bot process...');
startBot();

// Keep the process alive
process.stdin.resume();
