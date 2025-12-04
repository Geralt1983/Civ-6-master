const fs = require('fs');
const https = require('https');
const path = require('path');

const luaLogPath = path.join(
    process.env.APPDATA || process.env.HOME,
    '..',
    'Local',
    'Firaxis Games',
    'Sid Meier\'s Civilization VI',
    'Logs',
    'Lua.log'
);

const SERVER_HOST = 'civ-sage-ai--jkimble1983.replit.app';
const SERVER_PATH = '/api/gamestate';

console.log('=== CIV 6 COMPANION BRIDGE ===');
console.log('Log:', luaLogPath);
console.log('Server:', `https://${SERVER_HOST}${SERVER_PATH}`);
console.log('');

if (!fs.existsSync(luaLogPath)) {
    console.error('ERROR: Lua.log not found!');
    process.exit(1);
}

console.log('Watching for game data... Play a turn in Civ 6!');
console.log('');

let lastSize = fs.statSync(luaLogPath).size;
let debounceTimer = null;
let lastData = null;

function sendToServer(gameData) {
    console.log(`[SENDING] Turn ${gameData.turn} to server...`);
    
    const postData = JSON.stringify(gameData);
    
    const req = https.request({
        hostname: SERVER_HOST,
        port: 443,
        path: SERVER_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('[SUCCESS] Dashboard updated!');
            } else {
                console.log(`[ERROR] Server returned ${res.statusCode}: ${body}`);
            }
        });
    });
    
    req.on('error', (e) => {
        console.error('[ERROR] Connection failed:', e.message);
    });
    
    req.write(postData);
    req.end();
}

function checkForNewData() {
    const currentSize = fs.statSync(luaLogPath).size;
    
    if (currentSize > lastSize) {
        const content = fs.readFileSync(luaLogPath, 'utf8');
        const lines = content.split('\n');
        
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            if (line.includes('CIV_DATA_DUMP::')) {
                const startIdx = line.indexOf('{');
                const endIdx = line.lastIndexOf('}') + 1;
                
                if (startIdx !== -1 && endIdx > startIdx) {
                    const jsonStr = line.substring(startIdx, endIdx);
                    try {
                        const gameData = JSON.parse(jsonStr);
                        
                        if (!lastData || lastData.turn !== gameData.turn) {
                            console.log(`[DETECTED] Turn ${gameData.turn}, Leader: ${gameData.leader}`);
                            lastData = gameData;
                            
                            if (debounceTimer) clearTimeout(debounceTimer);
                            debounceTimer = setTimeout(() => {
                                sendToServer(gameData);
                            }, 1500);
                        }
                        break;
                    } catch (e) {
                        console.error('[ERROR] JSON parse failed:', e.message);
                    }
                }
            }
        }
        
        lastSize = currentSize;
    }
}

setInterval(checkForNewData, 1000);

console.log('Bridge running. Press Ctrl+C to stop.');
