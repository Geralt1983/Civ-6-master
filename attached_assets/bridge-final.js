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

let lastPostTime = 0;

tail.on('line', (line) => {
    // Check if line contains the marker
    if (line.includes('CIV_DATA_DUMP::')) {
        console.log('[DETECTED] Game data in line');
        
        // Extract JSON
        const startIdx = line.indexOf('{');
        const endIdx = line.lastIndexOf('}') + 1;
        
        if (startIdx === -1 || endIdx <= startIdx) {
            console.error('[ERROR] Could not find JSON braces');
            return;
        }
        
        const jsonStr = line.substring(startIdx, endIdx);
        
        try {
            // Parse as object (Lua table format)
            const gameData = eval('(' + jsonStr + ')');
            
            // Throttle posts - don't spam
            const now = Date.now();
            if (now - lastPostTime < 500) {
                console.log('[SKIP] Too many posts, throttling');
                return;
            }
            lastPostTime = now;
            
            const postData = JSON.stringify(gameData);
            console.log('[POSTING] Turn', gameData.turn);
            
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
                if (res.statusCode === 200) {
                    console.log('[SUCCESS] Dashboard updated');
                } else {
                    console.log(`[ERROR] Server returned ${res.statusCode}`);
                }
            });
            
            req.on('error', (e) => {
                console.error('[ERROR] Request failed:', e.message);
            });
            
            req.write(postData);
            req.end();
            
        } catch (e) {
            console.error('[ERROR] Failed to parse JSON:', e.message);
            console.error('[DEBUG] JSON string:', jsonStr.substring(0, 100));
        }
    }
});

tail.on('error', (err) => {
    console.error('[ERROR] Tail error:', err.message);
});

process.on('SIGINT', () => {
    console.log('\n\nBridge shutting down...');
    tail.unwatch();
    process.exit(0);
});
