const gameScene = new lx.Scene(function() {
    //Game scene (Lynx2D) code goes here
    
    //Set background to the standard color
    
    lx.Background('');

    //Set rendering scale

    if (game.isMobile)
        lx.Scale(properties.mobileRenderScale);
    else
        lx.Scale(properties.computerRenderScale);
    
    //Initialize UI
        
    ui.initialize();
    
    //Attempt to join the game
    
    client.joinGame();

    //Setup game update loop

    lx.Loops(game.update);
});