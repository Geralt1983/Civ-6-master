const fs = require('fs');
const { Tail } = require('tail');
const path = require('path');
const https = require('https');
const http = require('http');

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

console.log('🔍 BRIDGE DIAGNOSTIC MODE');
console.log('='.repeat(50));
console.log('Log path:', luaLogPath);
console.log('Server URL:', SERVER_URL);
console.log('='.repeat(50));

// Step 1: Check if file exists
if (!fs.existsSync(luaLogPath)) {
    console.error('❌ ERROR: Lua.log not found at path');
    console.error('   Expected:', luaLogPath);
    console.error('\n   To fix:');
    console.error('   1. Make sure Civ 6 has been launched at least once');
    console.error('   2. Check your username matches:', process.env.USERNAME);
    process.exit(1);
}

console.log('✅ Lua.log found');

// Step 2: Check file size
const stats = fs.statSync(luaLogPath);
console.log(`✅ Lua.log exists (${stats.size} bytes)`);

// Step 3: Test network connection
console.log('\n🌐 Testing network connection...');
const testReq = https.request('https://civ-sage-ai--jkimble1983.replit.app/api/gamestate', { method: 'GET' }, (res) => {
    console.log(`✅ Server reachable (HTTP ${res.statusCode})`);
    startBridge();
});

testReq.on('error', (err) => {
    console.error('❌ Cannot reach server:', err.message);
    console.error('   Possible causes:');
    console.error('   1. Internet connection issue');
    console.error('   2. Server is down');
    console.error('   3. Firewall blocking HTTPS');
    console.error('   4. Certificate issue (common in dev)');
    console.error('\n   Continuing anyway in case file events trigger...\n');
    startBridge();
});

testReq.end();

function startBridge() {
    console.log('\n🎮 Bridge is active. Start your turn in Civ 6!\n');

    const tail = new Tail(luaLogPath, {
        follow: true,
        fromBeginning: false,
        useWatchFile: true,
        fsWatchOptions: { interval: 500 }
    });

    let detectedCount = 0;
    let lastGameData = null;
    let debounceTimer = null;

    const sendData = (gameData) => {
        console.log(`\n📤 [POSTING] Turn ${gameData.turn} to server...`);
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
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ [SUCCESS] Data received by dashboard');
                } else {
                    console.log(`⚠️  [WARNING] Server returned ${res.statusCode}`);
                    console.log('   Response:', body.substring(0, 100));
                }
            });
        });
        
        req.on('error', (e) => {
            console.error('❌ [ERROR] POST failed:', e.message);
        });

        req.write(postData);
        req.end();
    };

    tail.on('line', (line) => {
        if (line.includes('CIV_DATA_DUMP::')) {
            detectedCount++;
            console.log(`\n🎯 [DETECTED #${detectedCount}] Found CIV_DATA_DUMP marker`);
            
            const startIdx = line.indexOf('{');
            const endIdx = line.lastIndexOf('}') + 1;
            
            if (startIdx !== -1 && endIdx > startIdx) {
                const jsonStr = line.substring(startIdx, endIdx);
                console.log(`   JSON length: ${jsonStr.length} chars`);
                
                try {
                    const gameData = eval('(' + jsonStr + ')');
                    console.log(`   ✅ Parsed: Turn ${gameData.turn}, Leader: ${gameData.leader}`);
                    console.log(`   Fields: ${Object.keys(gameData).join(', ')}`);
                    lastGameData = gameData;
                    
                    if (debounceTimer) clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        sendData(lastGameData);
                    }, 2000);
                    
                    console.log('   ⏳ Waiting 2s for silence before sending...');
                } catch (e) {
                    console.error('   ❌ JSON parse failed:', e.message);
                    console.error('   First 200 chars:', jsonStr.substring(0, 200));
                }
            } else {
                console.error('   ❌ Could not find { } brackets');
            }
        }
    });

    tail.on('error', (err) => {
        console.error('❌ [TAIL ERROR]', err.message);
    });

    process.on('SIGINT', () => {
        console.log('\n\n📞 Bridge shutting down...');
        console.log(`Total detections: ${detectedCount}`);
        if (debounceTimer) clearTimeout(debounceTimer);
        tail.unwatch();
        process.exit(0);
    });
}
