const client = {
    connect: function(cb) {
        //Try to make a connection
        
        window['socket'] = io.connect(properties.address + ":" + properties.port);
        
        //Setup possible server requests
        
        this.setup();
        
        //Callback
        
        cb();
    },
    setup: function() {
        socket.on('UPDATE_CLIENT_NAME', function(t) { document.title = t; });
        
        socket.on('REQUEST_LANDING_PAGE', view.loadLandingPage);
        socket.on('REQUEST_GAME', view.loadGamePage);
    }
}