const fs = require('fs');
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

console.log('🔍 LUA.LOG INSPECTOR');
console.log('='.repeat(60));

if (!fs.existsSync(luaLogPath)) {
    console.error('❌ Lua.log not found');
    process.exit(1);
}

// Read file and get last 30 lines
const content = fs.readFileSync(luaLogPath, 'utf8');
const lines = content.split('\n');
const lastLines = lines.slice(-30);

console.log(`File size: ${content.length} bytes`);
console.log(`Total lines: ${lines.length}`);
console.log('\n📋 LAST 30 LINES OF LUA.LOG:\n');
console.log('='.repeat(60));

lastLines.forEach((line, idx) => {
    if (line.trim()) {
        // Highlight lines with CIV_DATA_DUMP
        if (line.includes('CIV_DATA_DUMP')) {
            console.log(`✅ [${idx}] ${line.substring(0, 120)}...`);
        } else {
            console.log(`[${idx}] ${line.substring(0, 120)}...`);
        }
    }
});

console.log('\n' + '='.repeat(60));

// Check for CIV_DATA_DUMP in entire file
const dumpCount = (content.match(/CIV_DATA_DUMP/g) || []).length;
console.log(`\n📊 STATISTICS:`);
console.log(`   CIV_DATA_DUMP occurrences: ${dumpCount}`);
console.log(`   Lines with "error": ${(content.match(/error/gi) || []).length}`);
console.log(`   Lines with "OnTurnBegin": ${(content.match(/OnTurnBegin/gi) || []).length}`);

// Try to find patterns
console.log('\n🔎 SEARCHING FOR OUTPUT PATTERNS:\n');
if (content.includes('CIV_DATA_DUMP')) {
    console.log('✅ Found CIV_DATA_DUMP - Mod is outputting!');
    
    // Extract and show a sample
    const dumpIdx = content.indexOf('CIV_DATA_DUMP');
    const sample = content.substring(dumpIdx, dumpIdx + 300);
    console.log(`   Sample: ${sample}`);
} else {
    console.log('❌ NO CIV_DATA_DUMP found - Lua script may not be executing');
    
    if (content.includes('OnTurnBegin')) {
        console.log('   ⚠️  Found "OnTurnBegin" but no CIV_DATA_DUMP - script has an error');
    } else {
        console.log('   ⚠️  No OnTurnBegin found - mod may not be registered properly');
    }
}

console.log('\n' + '='.repeat(60));
console.log('Copy the output above and share it in the chat.');
