const game = {
    initialize: function() {
        //Initialize and start Lynx2D
        
        lx.Initialize(document.title);
        lx.Start(60);
    },
    status: {
        dom: document.getElementById('status_text'),
        set: function(msg) {
            this.dom.style.visibility = "default";
            this.dom.style.innerHTML = msg;
        },
        hide: function() {
            this.dom.style.visibility = "hidden";
        }
    }
};