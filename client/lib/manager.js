const manager = {
    progress: {
        visible: false,
        create: function() {
            let text = document.createElement('p');
            text.id = 'progress_text';
            text.classList.add('info');
            text.style = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); visibility: hidden;';

            view.dom.appendChild(text);
        },
        update: function(text) {
            document.getElementById('progress_text').innerHTML = text;
        },
        start: function(text) {
            this.update(text);
            ui.hide();

            document.getElementById('lynx-canvas').style.visibility = 'hidden';
            document.getElementById('progress_text').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            ui.show();

            document.getElementById('lynx-canvas').style.visibility = 'visible';
            document.getElementById('progress_text').style.visibility = 'hidden';

            this.visible = false;
        }
    },

    cacheTilesets: function(tilesets, cb)
    {
        //Set progress

        this.progress.start('Building map - 0%');

        //Recursive tileset caching

        let t = 0;
        let cacheTileset = function() {
            manager.getTileset(tilesets[t].image, function() {
                t++;

                //Cache tileset and adjust
                //progress

                if (t < tilesets.length) {
                    manager.progress.update('Building map - ' + ((t/(tilesets.length-1))*100).toFixed(0) + '%');

                    cacheTileset();
                }

                //Callback if finished

                else
                    cb();
            });
        };

        cacheTileset();
    },
    getTileset: function(src, cb)
    {
        //Adjust source of tileset

        let s   = src.lastIndexOf('/')+1;
        let loc = 'res/tilesets/' + src.substr(s, src.length-s);

        //Get through getSprite

        if (cb == undefined)
            return this.getSprite(loc);
        else
            this.getSprite(loc, cb);
    },

    sprites: {},
    getSprite: function(src, cb)
    {
        //Cache the sprite normally

        if (this.sprites[src] === undefined) {
            //Direct result (unsafe!)

            if (cb == undefined) {
                this.sprites[src] = new lx.Sprite(src);
                return this.sprites[src];
            }

            //Callback result (preferred way)

            else {
                this.sprites[src] = new lx.Sprite(src, cb);
                return;
            }
        }

        //If already cached, create an identical
        //copy and use that (this avoids same usage of
        //one sprite, which can conflict with rotation and
        //other manipulations)

        else {
            let copy = new lx.Sprite(this.sprites[src].Image());

            if (cb == undefined)
                return copy;
            else
                cb(copy)
        }
    },

    audio: {},
    getAudio: function(src, channel)
    {
        if (this.audio[src] === undefined)
            this.audio[src] = new lx.Sound(src, channel);

        return this.audio[src];
    },
};
