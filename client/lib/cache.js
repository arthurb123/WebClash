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

            document.getElementById('lynx-canvas').style.visibility = 'hidden';
            document.getElementById('progress_text').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            document.getElementById('lynx-canvas').style.visibility = 'visible';
            document.getElementById('progress_text').style.visibility = 'hidden';

            this.visible = false;
        }
    },

    tilesets: {},
    cacheTilesets: function(tilesets, cb)
    {
        let t = 0;

        this.progress.start('Loading map - 0%');

        let cacheTileset = function() {
            cache.getTileset(tilesets[t].image, function() {
                t++;

                if (t < tilesets.length) {
                    cache.progress.update('Loading map - ' + ((t/(tilesets.length-1))*100).toFixed(0) + '%');

                    cacheTileset();
                }
                else
                    cb();
            });
        };

        cacheTileset();
    },
    getTileset: function(src, cb)
    {
        let canCallback = true;

        if (this.tilesets[src] === undefined) {
            let s = src.lastIndexOf('/')+1;

            if (cb == undefined)
                this.tilesets[src] = new lx.Sprite('res/tilesets/' + src.substr(s, src.length-s));
            else {
                canCallback = false;

                this.tilesets[src] = new lx.Sprite('res/tilesets/' + src.substr(s, src.length-s), cb);
            }
        }

        this.tilesets[src].CLIP = undefined;

        if (cb != undefined && canCallback)
            cb(this.tilesets[src]);

        return this.tilesets[src];
    },

    sprites: {},
    getSprite: function(src, cb)
    {
        let canCallback = true;

        if (this.sprites[src] === undefined) {
            if (cb == undefined)
                this.sprites[src] = new lx.Sprite(src);
            else {
                canCallback = false;

                this.sprites[src] = new lx.Sprite(src, cb);
            }
        }

        this.sprites[src].CLIP = undefined;

        if (cb != undefined && canCallback)
            cb(this.sprites[src]);

        return this.sprites[src];
    },

    audio: {},
    getAudio: function(src, channel)
    {
        let canCallback = true;

        if (this.audio[src] === undefined)
            this.audio[src] = new lx.Sound(src, channel);

        return this.audio[src];
    },
};
