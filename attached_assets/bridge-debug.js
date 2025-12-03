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

console.log('🔍 Bridge DEBUG Mode Started');
console.log('Log path:', luaLogPath);
console.log('Server:', SERVER_URL);

// Verify file exists
if (!fs.existsSync(luaLogPath)) {
    console.error('❌ ERROR: Lua.log not found at:', luaLogPath);
    console.log('📍 Civ 6 Logs location should be:');
    console.log('   C:\\Users\\[YourUsername]\\AppData\\Local\\Firaxis Games\\Sid Meier\'s Civilization VI\\Logs\\Lua.log');
    process.exit(1);
}

console.log('✅ Lua.log found!');
console.log('🎮 Start a turn in Civ 6 now...\n');

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
let detectionCount = 0;

const sendData = (gameData) => {
    console.log('\n📤 SENDING TO SERVER:');
    console.log('   Turn:', gameData.turn);
    console.log('   Leader:', gameData.leader);
    console.log('   Era:', gameData.era);
    if (gameData.cities) console.log('   Cities:', gameData.cities.length);
    if (gameData.army) console.log('   Army units:', Object.keys(gameData.army).length);
    
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
        if (res.statusCode === 200) {
            console.log('✅ SUCCESS - Dashboard updated!');
        } else {
            console.log(`❌ Server returned status ${res.statusCode}`);
        }
    });
    
    req.on('error', (e) => console.error('❌ Request failed:', e.message));
    req.write(postData);
    req.end();
};

tail.on('line', (line) => {
    if (line.includes('CIV_DATA_DUMP::')) {
        detectionCount++;
        console.log(`\n[${detectionCount}] 🔍 Detected CIV_DATA_DUMP marker`);
        
        const startIdx = line.indexOf('{');
        const endIdx = line.lastIndexOf('}') + 1;
        
        console.log(`    String indices: start=${startIdx}, end=${endIdx}`);
        
        if (startIdx !== -1 && endIdx > startIdx) {
            const jsonStr = line.substring(startIdx, endIdx);
            console.log(`    JSON length: ${jsonStr.length} chars`);
            console.log(`    First 100 chars: ${jsonStr.substring(0, 100)}`);
            
            try {
                const gameData = eval('(' + jsonStr + ')');
                console.log('    ✅ JSON parsed successfully');
                lastGameData = gameData;
                
                if (debounceTimer) clearTimeout(debounceTimer);
                
                console.log('    ⏱️  Waiting 2s before sending...');
                debounceTimer = setTimeout(() => {
                    sendData(lastGameData);
                }, 2000);
                
            } catch (e) {
                console.error('    ❌ JSON parse error:', e.message);
                console.log('    Raw JSON:', jsonStr.substring(0, 200));
            }
        } else {
            console.log('    ❌ Could not find valid { } braces in line');
        }
    }
});

tail.on('error', (err) => {
    console.error('❌ Tail error:', err.message);
});

process.on('SIGINT', () => {
    console.log('\n\n👋 Bridge shutting down...');
    if (debounceTimer) clearTimeout(debounceTimer);
    tail.unwatch();
    process.exit(0);
});
