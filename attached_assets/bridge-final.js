const fs = require('fs');
const { Tail } = require('tail');
const path = require('path');
const https = require('https');

const luaLogPath = path.join(
    process.env.APPDATA || process.env.HOME,
    '..',
    'Local',
    'Firaxis Games',
    'Sid Meier\'s Civilization VI',
    'Logs',
    'Lua.log'
);

const SERVER_URL = 'https://civ-sage-ai--jkimble1983.replit.app/api/gamestate';

console.log('Bridge starting...');
console.log('Log path:', luaLogPath);
console.log('Server:', SERVER_URL);

// Verify file exists
if (!fs.existsSync(luaLogPath)) {
    console.error('ERROR: Lua.log not found');
    process.exit(1);
}

console.log('Bridge is active. Start your turn in Civ 6!\n');

// Create tail with better options
const tail = new Tail(luaLogPath, {
    follow: true,
    fromBeginning: false,
    useWatchFile: true,
    fsWatchOptions: { 
        interval: 1000 
    }
});

let debounceTimer = null;
let lastGameData = null;

const sendData = (gameData) => {
    console.log('[POSTING] Turn', gameData.turn);
    const postData = JSON.stringify(gameData);
    
    const options = {
        hostname: 'civ-sage-ai--jkimble1983.replit.app',
        path: '/api/gamestate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = https.request(options, (res) => {
        if (res.statusCode === 200) console.log('[SUCCESS] Dashboard updated');
        else console.log(`[ERROR] Server returned ${res.statusCode}`);
    });
    
    req.on('error', (e) => console.error('[ERROR] Request failed:', e.message));
    req.write(postData);
    req.end();
};

tail.on('line', (line) => {
    if (line.includes('CIV_DATA_DUMP::')) {
        const startIdx = line.indexOf('{');
        const endIdx = line.lastIndexOf('}') + 1;
        
        if (startIdx !== -1 && endIdx > startIdx) {
            const jsonStr = line.substring(startIdx, endIdx);
            try {
                // Parse and debounce
                const gameData = eval('(' + jsonStr + ')');
                lastGameData = gameData;
                
                // Clear previous timer if exists
                if (debounceTimer) clearTimeout(debounceTimer);
                
                // Wait 2 seconds of silence before sending (prevents false positives)
                debounceTimer = setTimeout(() => {
                    sendData(lastGameData);
                }, 2000);
                
                console.log('[DETECTED] Data buffered, waiting 2s...');
            } catch (e) {
                console.error('[ERROR] Failed to parse JSON:', e.message);
            }
        }
    }
});

tail.on('error', (err) => {
    console.error('[ERROR] Tail error:', err.message);
});

process.on('SIGINT', () => {
    console.log('\n\nBridge shutting down...');
    if (debounceTimer) clearTimeout(debounceTimer);
    tail.unwatch();
    process.exit(0);
});
