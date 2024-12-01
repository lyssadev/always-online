const { Client } = require('discord.js-selfbot-v13');
const chalk = require('chalk');
const moment = require('moment');

// Initialize client
const client = new Client({
    checkUpdate: false,
    language: 'en-US'
});

// Advanced console logging function
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

// Calculate uptime
function getUptime() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
}

// Ready event
client.on('ready', async () => {
    // Set online status
    await client.user.setStatus('online'); // Can be: 'online', 'idle', 'dnd', 'invisible'

    // Log successful login
    advancedLog('success', `Logged in as ${client.user.tag}`);
    advancedLog('info', `User ID: ${client.user.id}`);
    advancedLog('info', 'Status: ' + chalk.green('Online'));
    
    // Start uptime tracking
    setInterval(() => {
        advancedLog('info', `Uptime: ${getUptime()}`);
    }, 60000); // Log uptime every minute
});

// Error handling
client.on('error', error => {
    advancedLog('error', `An error occurred: ${error.message}`);
});

// Warning handling
client.on('warn', warning => {
    advancedLog('warning', warning);
});

// Login with token
const TOKEN = 'YOUR_TOKEN_HERE'; // Replace with your token
client.login(TOKEN).catch(err => {
    advancedLog('error', `Failed to login: ${err.message}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    advancedLog('warning', 'Shutting down...');
    client.destroy();
    process.exit(0);
});

// Unhandled rejection handling
process.on('unhandledRejection', (error) => {
    advancedLog('error', `Unhandled rejection: ${error.message}`);
});
