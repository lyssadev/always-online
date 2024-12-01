// DOM Elements
const tokenInput = document.getElementById('token');
const toggleTokenBtn = document.getElementById('toggleToken');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const tokenSection = document.getElementById('tokenSection');
const statusSection = document.getElementById('statusSection');
const statusType = document.getElementById('statusType');
const activityType = document.getElementById('activityType');
const activityText = document.getElementById('activityText');
const updateStatusBtn = document.getElementById('updateStatus');
const resetStatusBtn = document.getElementById('resetStatus');
const emojiPickerBtn = document.getElementById('emojiPicker');
const previewStatusDot = document.getElementById('previewStatusDot');
const previewStatus = document.getElementById('previewStatus');
const previewName = document.getElementById('previewName');

// State Management
let ws = null;
let heartbeatInterval = null;
let sequence = null;
let sessionId = null;
let picker = null;

// Constants
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=9&encoding=json';
const OP_CODES = {
    DISPATCH: 0,
    HEARTBEAT: 1,
    IDENTIFY: 2,
    PRESENCE_UPDATE: 3,
    RESUME: 6,
    RECONNECT: 7,
    HELLO: 10,
    HEARTBEAT_ACK: 11
};

// Utility Functions
function showError(message) {
    alert(`Error: ${message}`);
}

function updatePreview() {
    // Update status dot
    previewStatusDot.className = 'status-dot ' + statusType.value;
    
    // Update status text
    const type = activityType.value;
    const text = activityText.value;
    previewStatus.textContent = text ? `${type.charAt(0) + type.slice(1).toLowerCase()} ${text}` : 'No activity';
    previewName.textContent = 'Your Discord Name'; // Placeholder for user name
}

// WebSocket Functions
function connect(token) {
    ws = new WebSocket(GATEWAY_URL);

    ws.onopen = () => {
        console.log('Connected to Discord gateway');
        identify(token); // Pass the token to identify
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleGatewayMessage(data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        showError('Connection error');
        disconnect();
    };

    ws.onclose = () => {
        console.log('Disconnected from Discord gateway');
        clearInterval(heartbeatInterval);
        tokenSection.classList.remove('d-none');
        statusSection.classList.add('d-none');
    };
}

function handleGatewayMessage(data) {
    const { op, d, s, t } = data;
    
    if (s) sequence = s;

    switch (op) {
        case OP_CODES.HELLO:
            startHeartbeat(d.heartbeat_interval);
            break;
        
        case OP_CODES.DISPATCH:
            handleDispatch(t, d);
            break;
        
        case OP_CODES.RECONNECT:
            reconnect();
            break;
    }
}

function handleDispatch(type, data) {
    switch (type) {
        case 'READY':
            sessionId = data.session_id;
            tokenSection.classList.add('d-none');
            statusSection.classList.remove('d-none');
            break;
    }
}

function startHeartbeat(interval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => {
        ws.send(JSON.stringify({
            op: OP_CODES.HEARTBEAT,
            d: sequence
        }));
    }, interval);
}

function identify(token) {
    ws.send(JSON.stringify({
        op: OP_CODES.IDENTIFY,
        d: {
            token: token,
            properties: {
                $os: 'browser',
                $browser: 'Discord Status Customizer',
                $device: 'Discord Status Customizer'
            },
            presence: getDefaultPresence()
        }
    }));
}

function updatePresence() {
    if (!ws) return;

    const presence = {
        op: OP_CODES.PRESENCE_UPDATE,
        d: {
            since: null,
            activities: [{
                name: activityText.value,
                type: activityType.value
            }],
            status: statusType.value,
            afk: false
        }
    };

    ws.send(JSON.stringify(presence));
    console.log('Presence updated:', presence); // Log presence update
    updatePreview();
}

function getDefaultPresence() {
    return {
        since: null,
        activities: [],
        status: 'online',
        afk: false
    };
}

function disconnect() {
    if (ws) {
        ws.close();
        ws = null;
    }
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    sequence = null;
    sessionId = null;
}

// Event Listeners
connectBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (!token) {
        showError('Please enter a token');
        return;
    }
    connect(token);
});

disconnectBtn.addEventListener('click', () => {
    disconnect();
});

toggleTokenBtn.addEventListener('click', () => {
    const type = tokenInput.type === 'password' ? 'text' : 'password';
    tokenInput.type = type;
    toggleTokenBtn.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
});

updateStatusBtn.addEventListener('click', updatePresence);

resetStatusBtn.addEventListener('click', () => {
    statusType.value = 'online';
    activityType.value = 'PLAYING';
    activityText.value = '';
    updatePresence();
});

emojiPickerBtn.addEventListener('click', () => {
    if (!picker) {
        picker = new EmojiMart.Picker({
            onEmojiSelect: (emoji) => {
                activityText.value += emoji.native;
                updatePreview();
                picker.remove();
                picker = null;
            },
            theme: 'dark'
        });
        document.body.appendChild(picker);
        picker.style.position = 'fixed';
        picker.style.top = '50%';
        picker.style.left = '50%';
        picker.style.transform = 'translate(-50%, -50%)';
        picker.style.zIndex = '1000';
    } else {
        picker.remove();
        picker = null;
    }
});

[statusType, activityType, activityText].forEach(element => {
    element.addEventListener('change', updatePreview);
    element.addEventListener('input', updatePreview);
});

// Initialize preview
updatePreview();

// Cleanup on page unload
window.addEventListener('unload', () => {
    disconnect();
});
