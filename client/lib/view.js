const view = {
    dom: document.getElementById('overlay'),
    loadLanding: function() 
    {
        //Clear innerHTML
        
        view.dom.innerHTML = '';
        
        //Load landing page scene
        
        lx.LoadScene(landingScene);
    },
    loadGame: function() 
    {
        //Clear innerHTML
        
        view.dom.innerHTML = '';
        
        //Load game scene
        
        lx.LoadScene(gameScene);
    }
};