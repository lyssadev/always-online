const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Default config structure
const defaultConfig = {
    token: 'YOUR_TOKEN_HERE',
    settings: {
        status: {
            enabled: true,
            rotation: true,
            interval: 300000, // 5 minutes
            initialStatus: 'online', // Add this line
            options: [
                { text: '🎮 Gaming', type: 'PLAYING' },
                { text: '🎵 Music', type: 'LISTENING' },
                { text: '📺 Streaming', type: 'STREAMING' },
                { text: '🎯 Custom Status', type: 'CUSTOM' }
            ]
        },
        monitoring: {
            enabled: true,
            interval: 60000, // 1 minute
            logSystem: true,
            logNetwork: true
        },
        logging: {
            colors: true,
            timestamps: true,
            decorations: true
        }
    }
};

// Config file path
const CONFIG_PATH = path.join(__dirname, 'config.json');

// Create config if it doesn't exist
function initializeConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 4));
            console.log(chalk.yellow('⚠️  Default configuration file created. Please edit config.json with your token.'));
            process.exit(1);
        }
    } catch (error) {
        console.error(chalk.red('❌ Error creating config file:'), error);
        process.exit(1);
    }
}

// Load and validate config
function loadConfig() {
    try {
        // Initialize if needed
        initializeConfig();

        // Read config
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

        // Validate token
        if (!config.token || config.token === 'YOUR_TOKEN_HERE') {
            console.error(chalk.red('❌ Please set your Discord token in config.json'));
            process.exit(1);
        }

        // Merge with defaults to ensure all properties exist
        return {
            ...defaultConfig,
            ...config,
            settings: {
                ...defaultConfig.settings,
                ...config.settings
            }
        };
    } catch (error) {
        console.error(chalk.red('❌ Error loading config:'), error);
        process.exit(1);
    }
}

// Save config
function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    } catch (error) {
        console.error(chalk.red('❌ Error saving config:'), error);
    }
}

// Add config.json to .gitignore
function updateGitignore() {
    const gitignorePath = path.join(__dirname, '.gitignore');
    const gitignoreContent = fs.existsSync(gitignorePath)
        ? fs.readFileSync(gitignorePath, 'utf8')
        : '';

    if (!gitignoreContent.includes('config.json')) {
        fs.appendFileSync(gitignorePath, '\n# Config file with sensitive data\nconfig.json\n');
    }
}

// Create .gitignore if it doesn't exist
updateGitignore();

module.exports = {
    loadConfig,
    saveConfig,
    defaultConfig
};
