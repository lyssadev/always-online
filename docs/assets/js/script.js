class DiscordRPC {
    constructor() {
        this.ws = null;
        this.token = null;
        this.heartbeatInterval = null;
        this.sequence = null;
        this.sessionId = null;
        this.connected = false;

        // UI Elements
        this.tokenCard = document.getElementById('token-card');
        this.settingsCard = document.getElementById('settings-card');
        this.statusCard = document.getElementById('status-card');
        this.validateButton = document.getElementById('validate-token');
        this.connectButton = document.getElementById('connect');
        this.statusDot = document.querySelector('.status-dot');
        this.statusText = document.querySelector('.status-text');
        this.statusLog = document.getElementById('status-log');
        this.themeToggle = document.getElementById('theme-toggle');

        // Bind event listeners
        this.validateButton.addEventListener('click', () => this.validateToken());
        this.connectButton.addEventListener('click', () => this.toggleConnection());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.setupFormListeners();

        // Initialize theme
        this.initializeTheme();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    setupFormListeners() {
        const inputs = document.querySelectorAll('.input');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                if (this.connected) {
                    this.updatePresence();
                }
            });
        });
    }

    async validateToken() {
        const token = document.getElementById('token').value;
        if (!token) {
            this.log('Please enter your Discord token', true);
            return;
        }

        this.validateButton.disabled = true;
        this.validateButton.textContent = 'Validating...';

        try {
            const response = await fetch('https://discord.com/api/v9/users/@me', {
                headers: {
                    'Authorization': token
                }
            });

            if (response.ok) {
                this.token = token;
                this.showSettings();
                this.log('Token validated successfully');
            } else {
                this.log('Invalid token. Please check and try again.', true);
            }
        } catch (error) {
            this.log('Failed to validate token: ' + error.message, true);
        }

        this.validateButton.disabled = false;
        this.validateButton.textContent = 'Continue';
    }

    showSettings() {
        this.tokenCard.classList.add('hidden');
        this.settingsCard.classList.remove('hidden');
        this.statusCard.classList.remove('hidden');
        
        // Add visible class after a short delay for animation
        setTimeout(() => {
            this.settingsCard.classList.add('visible');
            this.statusCard.classList.add('visible');
        }, 50);
    }

    log(message, isError = false) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${timestamp}] ${message}`;
        logEntry.style.color = isError ? 'var(--error)' : 'var(--secondary)';
        this.statusLog.prepend(logEntry);

        // Keep only last 5 messages
        while (this.statusLog.children.length > 5) {
            this.statusLog.removeChild(this.statusLog.lastChild);
        }
    }

    updateUI(connected) {
        this.connected = connected;
        this.statusDot.className = `status-dot ${connected ? 'online' : 'offline'}`;
        this.statusText.textContent = connected ? 'Connected' : 'Disconnected';
        this.connectButton.textContent = connected ? 'Disconnect' : 'Connect';
    }

    async connect() {
        if (!this.token) {
            this.log('Token not found. Please validate your token first.', true);
            return;
        }

        try {
            // Get gateway URL
            const response = await fetch('https://discord.com/api/v9/gateway');
            const { url } = await response.json();

            // Connect to gateway
            this.ws = new WebSocket(`${url}/?v=9&encoding=json`);
            this.setupWebSocket();
        } catch (error) {
            this.log('Failed to connect: ' + error.message, true);
            this.updateUI(false);
        }
    }

    setupWebSocket() {
        this.ws.onopen = () => {
            this.log('Connected to gateway');
            this.identify();
        };

        this.ws.onclose = () => {
            this.log('Disconnected from gateway');
            this.cleanup();
        };

        this.ws.onerror = (error) => {
            this.log('WebSocket error: ' + error.message, true);
            this.cleanup();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleGatewayMessage(data);
        };
    }

    identify() {
        this.ws.send(JSON.stringify({
            op: 2,
            d: {
                token: this.token,
                properties: {
                    os: 'Windows',
                    browser: 'Chrome',
                    device: 'browser'
                },
                presence: this.getPresenceData()
            }
        }));
    }

    handleGatewayMessage(data) {
        switch (data.op) {
            case 10: // Hello
                this.heartbeatInterval = data.d.heartbeat_interval;
                this.startHeartbeat();
                break;
            case 11: // Heartbeat ACK
                break;
            case 0: // Dispatch
                this.sequence = data.s;
                switch (data.t) {
                    case 'READY':
                        this.sessionId = data.d.session_id;
                        this.updateUI(true);
                        this.log('Successfully connected to Discord');
                        this.updatePresence();
                        break;
                }
                break;
        }
    }

    startHeartbeat() {
        setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    op: 1,
                    d: this.sequence
                }));
            }
        }, this.heartbeatInterval);
    }

    getPresenceData() {
        const type = document.getElementById('activity-type').value;
        const text = document.getElementById('activity-text').value;

        return {
            status: 'online',
            since: Date.now(),
            activities: [{
                name: text || 'Always Online LITE',
                type: this.getActivityType(type)
            }],
            afk: false
        };
    }

    getActivityType(type) {
        const types = {
            'PLAYING': 0,
            'LISTENING': 2,
            'WATCHING': 3
        };
        return types[type] || 0;
    }

    updatePresence() {
        if (!this.connected || !this.ws) return;

        this.ws.send(JSON.stringify({
            op: 3,
            d: this.getPresenceData()
        }));
        this.log('Updated presence');
    }

    cleanup() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.heartbeatInterval = null;
        this.sequence = null;
        this.sessionId = null;
        this.updateUI(false);
    }

    disconnect() {
        this.cleanup();
        this.log('Disconnected from Discord');
    }

    toggleConnection() {
        if (this.connected) {
            this.disconnect();
        } else {
            this.connect();
        }
    }
}

// Initialize the RPC client when the page loads
window.addEventListener('load', () => {
    new DiscordRPC();
}); 