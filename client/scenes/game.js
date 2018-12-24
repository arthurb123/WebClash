const gameScene = new lx.Scene(function() {
    //Attempt to join the game
    
    client.joinGame();
    
    //Initialize UI
        
    ui.initialize();
});