const view = {
    dom: document.getElementById('overlay'),
    loadLanding: function() 
    {
        //Clear innerHTML
        
        view.dom.innerHTML = '';

        //Reset in-game

        client.inGame = false;
        
        //Load landing page scene
        
        lx.LoadScene(landingScene);
    },
    loadCreation: function(characters)
    {
        //Clear innerHTML
                
        view.dom.innerHTML = '';

        //Set player characters

        playerCharacters = characters;
                
        //Load game scene

        lx.LoadScene(creationScene);
    },
    loadGame: function() 
    {
        //Clear innerHTML
        
        view.dom.innerHTML = '';
        
        //Load game scene
        
        lx.LoadScene(gameScene);
    }
};