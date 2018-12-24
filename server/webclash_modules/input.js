//Input module for WebClash

exports.filterText = function(text)
{
    //Cycle through all censored words
    
    permissions.censoredWords.forEach(function(word) 
    {
        //While a word persists in the text, replace it
        //with the '*' character
        
        while (text.toLowerCase().indexOf(word) != -1) 
        {
            let sp = text.toLowerCase().indexOf(word);
            
            let replacement = '';
            for (let i = 0; i < word.length; i++)
                replacement += '*';
            
            text = text.substr(0, sp) + replacement + text.substr(sp + replacement.length);
        }
    });
    
    //Return filtered text
    
    return text;
}

exports.handleCommand = function(socket, text)
{
    try 
    {
        //Split the '/' character
        
        let command = '';
        
        if (text.indexOf(' ') == -1) 
            command = text.substr(1, text.length);
        else
            command = text.substr(1, text.indexOf(' ')-1);

        //Filter out argument(s)
        
        let argument = '';

        let sp = text.indexOf(' ');
        if (sp != -1)
            argument = text.substr(sp+1, text.length-sp);

        //Check which command applies
        
        switch (command)
        {
            //Load map command, requires map ID
            case 'loadMap':
                if (argument.length == 0)
                    return 'wrong';
                
                game.loadMap(socket, parseInt(argument));
                
                return 'success';
        }
    }
    catch (err)
    {
        output.give('Exception while handling command: ' + err);
    }
    
    //Return invalid in case of no found command
    
    return 'invalid';
}