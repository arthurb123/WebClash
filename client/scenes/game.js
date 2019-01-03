const gameScene = new lx.Scene(function() {
    //Game scene (Lynx2D) code goes here
    
    //Set background to the standard color
    
    lx.Background('');
    
    //Initialize UI
        
    ui.initialize();
    
    //Attempt to join the game
    
    client.joinGame();
});