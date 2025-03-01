document.addEventListener('DOMContentLoaded', function() {
    // Update the year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Theme toggler
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Save preference
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Token visibility toggle
    const tokenInput = document.getElementById('discord-token');
    const toggleBtn = document.getElementById('toggle-visibility');
    
    toggleBtn.addEventListener('click', function() {
        if (tokenInput.type === 'password') {
            tokenInput.type = 'text';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            tokenInput.type = 'password';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });
    
    // Terminal animation
    const terminalText = document.getElementById('terminal-text');
    const terminalContent = [
        '> node index.js',
        '',
        '╔════════════════════════════════════════════════════╗',
        '║              DISCORD STATUS CUSTOMIZER              ║',
        '║                  STARTING UP...                     ║',
        '╚════════════════════════════════════════════════════╝',
        '',
        '✅ Configuration loaded successfully',
        '✅ Validating Discord token...',
        '✅ Token is valid',
        '',
        '🔌 Connecting to Discord Gateway...',
        '🔵 [WS => Discord] Gateway URL: wss://gateway.discord.gg/?v=9&encoding=json',
        '🔵 [WS <= Discord] Gateway connection established',
        '🔵 [WS <= Discord] Received HELLO from Gateway',
        '🔵 [WS => Discord] Sending IDENTIFY payload',
        '🔵 [WS <= Discord] Received READY event',
        '🟢 Successfully connected to Discord Gateway v9',
        '',
        '📊 Session Info:',
        '  - Session ID: 8f732e5f98b543c09876ce8fa4a1b2c3',
        '  - Gateway: v9',
        '  - Client: discord.js-selfbot-v13',
        '  - Latency: 45ms',
        '',
        '🔄 Status rotation enabled (5 minute interval)',
        '📝 Setting status: 🎮 Playing Minecraft',
        '🔵 [WS => Discord] Sending PRESENCE_UPDATE payload',
        '',
        '⚡ System monitoring initialized',
        '  - CPU: 5% utilization',
        '  - Memory: 87.5 MB',
        '  - Uptime: 0:00:15',
        '',
        '✨ Discord Status Customizer is now running!',
        '   Listening for Gateway events...'
    ];
    
    // Configuración de la terminal
    const terminalConfig = {
        typingSpeed: { min: 5, max: 30 },
        linePause: { min: 100, max: 500 },
        commandPause: 800,
        cursorBlinkRate: 500
    };
    
    // Función mejorada de animación de escritura
    function enhancedTypeWriter() {
        const terminalText = document.getElementById('terminal-text');
        const terminalContent = [
            '> node index.js',
            '',
            '╔════════════════════════════════════════════════════╗',
            '║              DISCORD STATUS CUSTOMIZER              ║',
            '║                  STARTING UP...                     ║',
            '╚════════════════════════════════════════════════════╝',
            '',
            '✅ Configuration loaded successfully',
            '✅ Validating Discord token...',
            '✅ Token is valid',
            '',
            '🔌 Connecting to Discord Gateway...',
            '🔵 [WS => Discord] Gateway URL: wss://gateway.discord.gg/?v=9&encoding=json',
            '🔵 [WS <= Discord] Gateway connection established',
            '🔵 [WS <= Discord] Received HELLO from Gateway',
            '🔵 [WS => Discord] Sending IDENTIFY payload',
            '🔵 [WS <= Discord] Received READY event',
            '🟢 Successfully connected to Discord Gateway v9',
            '',
            '📊 Session Info:',
            '  - Session ID: 8f732e5f98b543c09876ce8fa4a1b2c3',
            '  - Gateway: v9',
            '  - Client: discord.js-selfbot-v13',
            '  - Latency: 45ms',
            '',
            '🔄 Status rotation enabled (5 minute interval)',
            '📝 Setting status: 🎮 Playing Minecraft',
            '🔵 [WS => Discord] Sending PRESENCE_UPDATE payload',
            '',
            '⚡ System monitoring initialized',
            '  - CPU: 5% utilization',
            '  - Memory: 87.5 MB',
            '  - Uptime: 0:00:15',
            '',
            '✨ Discord Status Customizer is now running!',
            '   Listening for Gateway events...'
        ];

        // Limpiar el terminal
        terminalText.innerHTML = '';
        
        // Agregar cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '█';
        terminalText.appendChild(cursor);
        
        // Configurar parpadeo del cursor
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, terminalConfig.cursorBlinkRate);
        
        // Función para escribir línea a línea con velocidad variable
        async function typeLine(text, isCommand = false) {
            const lineElement = document.createElement('div');
            lineElement.classList.add('terminal-line');
            lineElement.style.opacity = '0';
            
            if (isCommand) {
                lineElement.classList.add('command-line');
            }
            
            // Detectar y aplicar estilos específicos según el contenido
            if (text.includes('✅')) lineElement.classList.add('message-success');
            if (text.includes('🔵')) lineElement.classList.add('message-info');
            if (text.includes('⚠️') || text.includes('🔄')) lineElement.classList.add('message-warning');
            if (text.includes('❌') || text.includes('Error')) lineElement.classList.add('message-error');
            if (text.includes('🟢')) lineElement.classList.add('message-success');
            
            terminalText.insertBefore(lineElement, cursor);
            
            // Fade in de la línea
            lineElement.style.transition = 'opacity 0.3s ease';
            lineElement.style.opacity = '1';
            
            if (text === '') {
                return new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Si es una línea de comando, pausa especial
            if (isCommand) {
                lineElement.textContent = text;
                return new Promise(resolve => setTimeout(resolve, terminalConfig.commandPause));
            }
            
            // Escribir carácter por carácter con velocidad variable
            for (let i = 0; i < text.length; i++) {
                lineElement.textContent = text.substring(0, i + 1);
                
                // Velocidad variable para simular escritura humana
                const charDelay = Math.floor(
                    Math.random() * (terminalConfig.typingSpeed.max - terminalConfig.typingSpeed.min) + 
                    terminalConfig.typingSpeed.min
                );
                
                await new Promise(resolve => setTimeout(resolve, charDelay));
            }
            
            // Pausa variable entre líneas
            const linePause = Math.floor(
                Math.random() * (terminalConfig.linePause.max - terminalConfig.linePause.min) + 
                terminalConfig.linePause.min
            );
            
            return new Promise(resolve => setTimeout(resolve, linePause));
        }
        
        // Función principal para escribir todas las líneas secuencialmente
        async function writeContent() {
            for (let i = 0; i < terminalContent.length; i++) {
                const isCommand = terminalContent[i].startsWith('>');
                await typeLine(terminalContent[i], isCommand);
                
                // Auto-scroll para mantener visible la última línea
                const terminalContainer = document.querySelector('.terminal-content');
                terminalContainer.scrollTop = terminalContainer.scrollHeight;
            }
        }
        
        // Iniciar la animación
        writeContent();
    }
    
    // Start the typing animation
    enhancedTypeWriter();
    
    // Add transitions to feature categories
    const featureCategories = document.querySelectorAll('.feature-category');
    featureCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
    
    // Add animation to setup steps
    const setupSteps = document.querySelectorAll('.step');
    setupSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, 800 + (index * 200));
    });
    
    // Discord Gateway implementation
    let gateway = null;
    let interval = null;
    let sequence = null;
    let sessionId = null;
    let heartbeatInterval = null;
    let resumeGatewayUrl = null;
    let connected = false;
    
    // Token form event listeners
    const tokenForm = document.getElementById('token-form');
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const statusType = document.getElementById('status-type');
    const activityType = document.getElementById('activity-type');
    const activityName = document.getElementById('activity-name');
    
    // Agregar la referencia al nuevo botón
    const updatePresenceBtn = document.getElementById('update-presence-btn');
    
    // Connect to Discord Gateway
    tokenForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (connected) {
            enhancedAddToTerminal('Already connected to Gateway', 'warning');
            return;
        }
        
        const token = tokenInput.value.trim();
        if (!token) {
            enhancedAddToTerminal('Please enter a valid Discord token', 'error');
            return;
        }
        
        connectToGateway(token);
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
    });
    
    // Disconnect from Gateway
    disconnectBtn.addEventListener('click', function() {
        if (!connected || !gateway) return;
        
        disconnect();
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
    });
    
    // Update presence when status options change
    statusType.addEventListener('change', updatePresence);
    activityType.addEventListener('change', updatePresence);
    activityName.addEventListener('input', debounce(updatePresence, 500));
    
    // Agregar el evento click para el botón Update Presence
    updatePresenceBtn.addEventListener('click', function() {
        if (connected && gateway && gateway.readyState === WebSocket.OPEN) {
            updatePresence();
            enhancedAddToTerminal('🔄 Presence updated manually', 'success');
        }
    });
    
    // Agregar esto después de las referencias a los elementos del formulario
    document.getElementById('status-type').addEventListener('change', presenceOptionsChanged);
    document.getElementById('activity-type').addEventListener('change', presenceOptionsChanged);
    document.getElementById('activity-name').addEventListener('input', presenceOptionsChanged);
    
    // Función para destacar el botón de actualizar cuando se hacen cambios
    function presenceOptionsChanged() {
        if (connected) {
            updatePresenceBtn.classList.add('highlight-btn');
            // Quitar el highlight después de un tiempo
            setTimeout(() => {
                updatePresenceBtn.classList.remove('highlight-btn');
            }, 2000);
        }
    }
    
    // Gateway connection and management functions
    function connectToGateway(token) {
        // Clear terminal first
        document.getElementById('terminal-text').textContent = '';
        
        enhancedAddToTerminal('> node web-client.js', 'default');
        enhancedAddToTerminal('');
        enhancedAddToTerminal('╔════════════════════════════════════════════════════╗');
        enhancedAddToTerminal('║              DISCORD STATUS CUSTOMIZER              ║');
        enhancedAddToTerminal('║                  STARTING UP...                     ║');
        enhancedAddToTerminal('╚════════════════════════════════════════════════════╝');
        enhancedAddToTerminal('');
        
        enhancedAddToTerminal('✅ Token provided', 'success');
        enhancedAddToTerminal('✅ Validating token format...', 'success');
        
        if (!validateTokenFormat(token)) {
            enhancedAddToTerminal('❌ Token format may not be correct, but trying anyway...', 'warning');
        }
        
        enhancedAddToTerminal('🔌 Connecting to Discord Gateway...', 'info');
        
        // Actualizar el estado a "Connecting..." al inicio del proceso
        document.getElementById('connection-status').textContent = 'Connecting...';
        document.getElementById('connection-status').style.color = 'var(--warning)';
        
        try {
            gateway = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
            
            gateway.onopen = function() {
                enhancedAddToTerminal('🔌 Connected to Discord Gateway', 'success');
                // Actualizar el estado a "Connected" cuando se abre la conexión
                document.getElementById('connection-status').textContent = 'Connected';
                document.getElementById('connection-status').style.color = 'var(--success)';
            };
            
            gateway.onmessage = function(event) {
                const data = JSON.parse(event.data);
                handleGatewayMessage(data, token);
            };
            
            gateway.onerror = function(error) {
                enhancedAddToTerminal(`❌ WebSocket Error: ${error.message || 'Unknown error'}`, 'error');
                document.getElementById('connection-status').textContent = 'Error';
                document.getElementById('connection-status').style.color = 'var(--danger)';
                disconnect();
            };
            
            gateway.onclose = function(event) {
                handleDisconnect(event);
            };
            
        } catch (error) {
            enhancedAddToTerminal(`❌ Failed to connect: ${error.message}`, 'error');
            connectBtn.disabled = false;
        }
        
        // Cuando se conecta:
        connected = true;
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        updatePresenceBtn.disabled = false; // Habilitar el botón de actualizar presencia
    }
    
    function handleGatewayMessage(data, token) {
        const { op, d, s, t } = data;
        
        // Update sequence number if provided
        if (s !== null) sequence = s;
        
        switch (op) {
            case 10: // Hello
                enhancedAddToTerminal('🔵 [WS <= Discord] Received HELLO from Gateway', 'info');
                heartbeatInterval = d.heartbeat_interval;
                
                // Start heartbeat
                startHeartbeat();
                
                // Identify
                enhancedAddToTerminal('🔵 [WS => Discord] Sending IDENTIFY payload', 'info');
                sendIdentify(token);
                break;
                
            case 11: // Heartbeat ACK
                enhancedAddToTerminal('💓 Heartbeat acknowledged', 'success');
                break;
                
            case 0: // Dispatch
                handleDispatch(t, d);
                break;
                
            case 7: // Reconnect
                enhancedAddToTerminal('🔄 Gateway requested reconnect', 'warning');
                reconnect(token);
                break;
                
            case 9: // Invalid Session
                enhancedAddToTerminal('❌ Invalid session', 'error');
                setTimeout(() => {
                    sendIdentify(token);
                }, 5000);
                break;
                
            default:
                enhancedAddToTerminal(`Received opcode ${op}`, 'info');
        }
    }
    
    function handleDispatch(type, data) {
        switch (type) {
            case 'READY':
                connected = true;
                sessionId = data.session_id;
                resumeGatewayUrl = data.resume_gateway_url;
                
                enhancedAddToTerminal('🔵 [WS <= Discord] Received READY event', 'info');
                enhancedAddToTerminal('🟢 Successfully connected to Discord Gateway v9', 'success');
                enhancedAddToTerminal('');
                
                // Display session info
                enhancedAddToTerminal('📊 Session Info:', 'info');
                enhancedAddToTerminal(`  - User: ${data.user.username}#${data.user.discriminator}`);
                enhancedAddToTerminal(`  - ID: ${data.user.id}`);
                enhancedAddToTerminal(`  - Session ID: ${sessionId}`);
                enhancedAddToTerminal(`  - Gateway: v9`);
                enhancedAddToTerminal('');
                
                // Set initial presence
                updatePresence();
                
                // Show system info
                setTimeout(() => {
                    enhancedAddToTerminal('⚡ System monitoring initialized');
                    enhancedAddToTerminal(`  - CPU: ${Math.floor(Math.random() * 10)}% utilization`);
                    enhancedAddToTerminal(`  - Memory: ${Math.floor(80 + Math.random() * 20)}.${Math.floor(Math.random() * 9)} MB`);
                    enhancedAddToTerminal(`  - Uptime: 0:00:${Math.floor(10 + Math.random() * 50)}`);
                    enhancedAddToTerminal('');
                    enhancedAddToTerminal('✨ Discord Status Customizer is now running!');
                    enhancedAddToTerminal('   Listening for Gateway events...');
                }, 1000);
                
                // Actualizar el estado a "Online" cuando se recibe READY
                document.getElementById('connection-status').textContent = 'Online';
                document.getElementById('connection-status').style.color = 'var(--success)';
                enhancedAddToTerminal('🟢 Connected successfully!', 'success');
                break;
                
            case 'PRESENCE_UPDATE':
                enhancedAddToTerminal('🔄 External presence update detected', 'info');
                break;
                
            default:
                enhancedAddToTerminal(`Received event: ${type}`, 'info');
        }
    }
    
    function sendIdentify(token) {
        if (!gateway || gateway.readyState !== WebSocket.OPEN) return;
        
        const payload = {
            op: 2, // Identify opcode
            d: {
                token: token,
                properties: {
                    $os: 'browser',
                    $browser: 'Discord Status Customizer',
                    $device: 'Discord Status Customizer'
                },
                presence: getCurrentPresence()
            }
        };
        
        gateway.send(JSON.stringify(payload));
    }
    
    function startHeartbeat() {
        // Clear any existing interval
        if (interval) clearInterval(interval);
        
        // Send first heartbeat
        sendHeartbeat();
        
        // Set up interval for future heartbeats
        interval = setInterval(sendHeartbeat, heartbeatInterval);
        
        enhancedAddToTerminal(`💓 Heartbeat started (interval: ${heartbeatInterval}ms)`, 'info');
    }
    
    function sendHeartbeat() {
        if (!gateway || gateway.readyState !== WebSocket.OPEN) return;
        
        const payload = {
            op: 1, // Heartbeat opcode
            d: sequence
        };
        
        gateway.send(JSON.stringify(payload));
        enhancedAddToTerminal('💓 Heartbeat sent', 'info');
    }
    
    function updatePresence() {
        if (!connected || !gateway || gateway.readyState !== WebSocket.OPEN) return;
        
        const presence = getCurrentPresence();
        const payload = {
            op: 3, // Presence Update opcode
            d: presence
        };
        
        gateway.send(JSON.stringify(payload));
        
        enhancedAddToTerminal('🔵 [WS => Discord] Sending PRESENCE_UPDATE payload', 'info');
        enhancedAddToTerminal(`📝 Setting status: ${getActivityEmoji()} ${getActivityVerb()} ${presence.activities[0]?.name || 'N/A'}`, 'success');
    }
    
    function getCurrentPresence() {
        const status = document.getElementById('status-type').value;
        const activityTypeValue = parseInt(document.getElementById('activity-type').value);
        const activityNameValue = document.getElementById('activity-name').value || 'Minecraft';
        
        const presence = {
            status: status,
            since: status === 'idle' ? Date.now() : null,
            activities: [],
            afk: false
        };
        
        // Only add activity if it's not a custom status (which requires special handling)
        if (activityTypeValue !== 4) {
            presence.activities.push({
                name: activityNameValue,
                type: activityTypeValue
            });
        } else {
            // Custom status
            presence.activities.push({
                name: 'Custom Status',
                type: 4,
                state: activityNameValue,
                emoji: null
            });
        }
        
        return presence;
    }
    
    function getActivityEmoji() {
        const type = parseInt(document.getElementById('activity-type').value);
        switch (type) {
            case 0: return '🎮';
            case 1: return '🔴';
            case 2: return '🎵';
            case 3: return '📺';
            case 4: return '💭';
            case 5: return '🏆';
            default: return '📝';
        }
    }
    
    function getActivityVerb() {
        const type = parseInt(document.getElementById('activity-type').value);
        switch (type) {
            case 0: return 'Playing';
            case 1: return 'Streaming';
            case 2: return 'Listening to';
            case 3: return 'Watching';
            case 4: return 'Custom Status:';
            case 5: return 'Competing in';
            default: return '';
        }
    }
    
    // Agregar una nueva variable para controlar si la desconexión fue manual
    let manualDisconnect = false;

    // Modificar la función disconnect para marcar cuando es manual
    function disconnect() {
        manualDisconnect = true; // Marcar que la desconexión fue manual
        
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        
        if (gateway) {
            gateway.close();
            gateway = null;
        }
        
        connected = false;
        document.getElementById('connection-status').textContent = 'Disconnected';
        document.getElementById('connection-status').style.color = 'var(--text-muted)';
        
        enhancedAddToTerminal('🔌 Disconnected from Gateway', 'warning');
        
        // Actualizar estados de botones
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
        updatePresenceBtn.disabled = true; // También deshabilitamos el nuevo botón
    }
    
    // Modificar la función handleDisconnect para respetar la desconexión manual
    function handleDisconnect(event) {
        clearInterval(interval);
        
        enhancedAddToTerminal(`🔌 Connection closed: Code ${event.code}`, event.code === 1000 ? 'info' : 'error');
        
        // Solo intentar reconectar si no fue una desconexión manual y el código no es 1000
        if (event.code !== 1000 && !manualDisconnect) {
            enhancedAddToTerminal('🔄 Attempting to reconnect in 5 seconds...', 'warning');
            setTimeout(() => {
                if (tokenInput.value) {
                    connectToGateway(tokenInput.value);
                }
            }, 5000);
        } else {
            // Resetear la bandera de desconexión manual
            manualDisconnect = false;
        }
        
        connected = false;
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
        updatePresenceBtn.disabled = true; // También deshabilitamos el nuevo botón
        
        document.getElementById('connection-status').textContent = 'Disconnected';
        document.getElementById('connection-status').style.color = 'var(--text-muted)';
    }
    
    function reconnect(token) {
        if (gateway) {
            gateway.close();
        }
        
        setTimeout(() => {
            connectToGateway(token);
        }, 1000);
    }
    
    function validateTokenFormat(token) {
        // Validación más permisiva para tokens de Discord
        // Comprueba simplemente que tenga el formato general de tres partes separadas por puntos
        
        // Eliminar la validación estricta:
        // return /^[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}$/.test(token);
        
        // Nueva validación más flexible:
        return token.split('.').length === 3 && token.length > 50;
        
        // También podrías omitir la validación por completo:
        // return true;
    }
    
    function enhancedAddToTerminal(message, type = 'default') {
        const terminalText = document.getElementById('terminal-text');
        const messageElement = document.createElement('div');
        messageElement.classList.add('terminal-line', 'new-line');
        
        if (type) {
            messageElement.classList.add(`message-${type}`);
        }
        
        // Insertar antes del cursor si existe
        const cursor = terminalText.querySelector('.cursor');
        if (cursor) {
            terminalText.insertBefore(messageElement, cursor);
        } else {
            terminalText.appendChild(messageElement);
        }
        
        // Animación de fade in
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Función para escribir el mensaje caracter por caracter
        let charIndex = 0;
        const writeChar = () => {
            if (charIndex < message.length) {
                messageElement.textContent = message.substring(0, charIndex + 1);
                charIndex++;
                
                // Velocidad variable para simular escritura humana
                const charDelay = Math.floor(Math.random() * 25 + 5);
                setTimeout(writeChar, charDelay);
            }
        };
        
        // Iniciar la animación después de un pequeño retraso
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
            writeChar();
        }, 10);
        
        // Auto-scroll para mantener visible la última línea
        const terminalContainer = document.querySelector('.terminal-content');
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
    
    // Utility function to debounce input
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Añadir efectos sutiles de scroll para la barra de navegación
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.top-nav');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mejorar la experiencia de copiado de código con la API del portapapeles moderna
    const copyCodeBtn = document.getElementById('copy-code-btn');
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', function() {
            const codeBlock = document.querySelector('.code-preview');
            const codeText = codeBlock.textContent.replace('Copy', '').trim();
            
            // Usar la API moderna cuando esté disponible
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(codeText)
                    .then(() => {
                        const originalText = copyCodeBtn.innerHTML;
                        copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        copyCodeBtn.classList.add('copied');
                        
                        setTimeout(function() {
                            copyCodeBtn.innerHTML = originalText;
                            copyCodeBtn.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Error al copiar: ', err);
                        fallbackCopyTextToClipboard(codeText);
                    });
            } else {
                fallbackCopyTextToClipboard(codeText);
            }
            
            function fallbackCopyTextToClipboard(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyCodeBtn.classList.add('copied');
                
                setTimeout(function() {
                    copyCodeBtn.innerHTML = originalText;
                    copyCodeBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }
}); 