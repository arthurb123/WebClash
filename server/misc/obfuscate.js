// Require the JavaScript obfuscator

const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Check if correct arguments are supplied

if (process.argv.length < 4) {
    console.log('Not enough arguments supplied, requires input file and output file argument.');
    return;
}

// Obfuscate the code

const obfuscationResult = JavaScriptObfuscator.obfuscate(
    fs.readFileSync(process.argv[2]).toString()
).getObfuscatedCode();

// Write the obfuscated result to the output file

fs.writeFileSync(process.argv[3], obfuscationResult, 'utf-8');