const fs = require('fs');
const { Tail } = require('tail');
const path = require('path');

// User's actual Lua.log path - with proper escaping
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

console.log('------------------------------------------------');
console.log('CIV 6 COMPANION BRIDGE');
console.log('Target Server:', SERVER_URL);
console.log('Watching Log: ', luaLogPath);
console.log('------------------------------------------------');

// Verify log file exists
if (!fs.existsSync(luaLogPath)) {
    console.error('[ERROR] Lua.log not found at:', luaLogPath);
    console.error('[INFO] Start Civ 6 to create the log file, then restart this bridge.');
    process.exit(1);
}

console.log('Bridge is active. Start your turn in Civ 6!');

// Watch the Lua.log file for new output
const tail = new Tail(luaLogPath, {
    follow: true,
    fromBeginning: false,
    useWatchFile: true
});

tail.on('line', (line) => {
    // Look for our marker
    if (line.includes('CIV_DATA_DUMP::')) {
        console.log('[DETECTED] Game data found');
        
        // Extract JSON payload
        const startIdx = line.indexOf('{');
        const endIdx = line.lastIndexOf('}') + 1;
        
        if (startIdx !== -1 && endIdx > startIdx) {
            const jsonStr = line.substring(startIdx, endIdx);
            
            try {
                // Parse and re-serialize to fix Lua format
                const gameData = eval('(' + jsonStr + ')');
                
                console.log('[SENDING] Posting data to:', SERVER_URL);
                
                // POST to server
                const https = require('https');
                const postData = JSON.stringify(gameData);
                
                const options = {
                    hostname: 'civ-sage-ai--jkimble1983.replit.app',
                    port: 443,
                    path: '/api/gamestate',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': postData.length
                    }
                };
                
                const req = https.request(options, (res) => {
                    console.log(`[SUCCESS] Response: ${res.statusCode}`);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('[OK] Game state updated on dashboard');
                    }
                });
                
                req.on('error', (e) => {
                    console.error('[ERROR] POST failed:', e.message);
                });
                
                req.write(postData);
                req.end();
                
            } catch (e) {
                console.error('[ERROR] Failed to parse game data:', e.message);
            }
        }
    }
});

tail.on('error', (err) => {
    console.error('[ERROR] Tail error: ', err.message);
});

process.on('SIGINT', () => {
    console.log('\nBridge shutting down...');
    tail.unwatch();
    process.exit(0);
});
