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
    
    //Load all script files
    
    addScript('properties.js');
    
    addScript('lib/socket.io.js');
    addScript('lib/lynx2d.js');
    addScript('lib/game.js');
    addScript('lib/client.js');
    addScript('lib/view.js');
    
    addScript('misc/prototypes.js');
    
    addScript('scenes/landing.js');
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
    
        let st = document.getElementById('status_text');
        st.parentNode.removeChild(st);
        
        let ls = document.getElementById('loader');
        ls.parentNode.removeChild(ls);
    });
}

loadAllScripts();