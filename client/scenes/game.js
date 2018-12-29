const gameScene = new lx.Scene(function() {
    //Game scene (Lynx2D) code goes here
    
    //Set background to the standard color
    
    lx.Background('');
    
    //Attempt to join the game
    
    client.joinGame();
    
    //Initialize UI
        
    ui.initialize();
});