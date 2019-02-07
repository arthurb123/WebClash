//Scripts that need to be loaded

const scripts = [
    'properties.js',
    
    'lib/socket.io.js',
    'lib/lynx2d.js',
    'lib/tiled.js',
    'lib/game.js',
    'lib/client.js',
    'lib/player.js',
    'lib/view.js',
    'lib/animation.js',
    'lib/ui.js',
    
    'misc/prototypes.js',
    
    'scenes/landing.js',
    'scenes/game.js'
];

//Loader for WebClash Client

function addScript(src)
{
    let s = document.createElement('script');
    s.src = src;
    s.async = false;
    
    document.head.appendChild(s);
}

function loadAllScripts()
{
    //Add event listener
    
    window.onload = finishLoading;
    
    //Load all scripts
    
    for (let i = 0; i < scripts.length; i++)
        addScript(scripts[i]);
}

function finishLoading()
{
    //Initialize game/Lynx2D
    
    game.initialize();
    
    //Set status
    
    document.getElementById('status_text').innerHTML = 'Connecting';
    
    //Connect to server
    
    client.connect(function() {   
        //Cleanup
    
        let st = document.getElementById('status_text'),
            ls = document.getElementById('loader');
        
        if (st == undefined ||
            ls == undefined)
            window.location.reload(true);
        
        st.parentNode.removeChild(st);
        ls.parentNode.removeChild(ls);
    });
}

loadAllScripts();