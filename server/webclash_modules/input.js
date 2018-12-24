//Input module for WebClash

exports.filterText = function(text)
{
    permissions.censoredWords.forEach(function(word) {
        while (text.toLowerCase().indexOf(word) != -1) {
            let sp = text.toLowerCase().indexOf(word);
            
            let replacement = '';
            for (let i = 0; i < word.length; i++)
                replacement += '*';
            
            text = text.substr(0, sp) + replacement + text.substr(sp + replacement.length);
        }
    });
    
    return text;
}