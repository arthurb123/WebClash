const cache = {
    progress: {
        visible: false,
        create: function() {
            view.dom.innerHTML += '<p id="progress_text" class="info" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); visibility: hidden;"></p>';
        },
        update: function(text) {
            document.getElementById('progress_text').innerHTML = text;
        },
        start: function(text) {
            this.update(text);
            
            document.getElementById('progress_text').style.visibility = 'visible';
            
            this.visible = true;
        },
        hide: function() {
            document.getElementById('progress_text').style.visibility = 'hidden';
            
            this.visible = false;
        }
    },
    cacheTilesets: function(tilesets, cb) 
    {
        let t = 0;
        
        this.progress.start('Loading map - 0%');
        
        let cacheTileset = function() {
            game.getTileset(tilesets[t].image, function() {
                t++;
                
                if (t < tilesets.length) {
                    cache.progress.update('Loading map - ' + (t/(tilesets.length-1))*100 + '%');
                    
                    cacheTileset();
                }
                else {
                    cache.progress.hide();
                    
                    cb();
                }
            });
        };
                            
        cacheTileset();
    },
};