class Lynx2D {
constructor() {

/* Core */

this.CONTEXT = {};
this.GAME = {
    RUNNING: false,
    DEBUG: false,
    DRAW_COLLIDERS: false,
    BUFFER: [],
    EVENTS: [],
    GO_MOUSE_EVENTS: [],
    UI: [],
    COLLIDERS: [],
    LOOPS: [],
    LAYER_DRAW_EVENTS: [],
    INIT: function(FPS) {
        //Setup logger

        this.LOG.DATE = new Date().getSeconds();
        this.LOG.DATA.COUNTER = new lx.UIText('0 FPS | 0 UPS', 25, 35, 16);

        //Set FPS if provided

        if (FPS != undefined) 
            this.SETTINGS.FPS = FPS;

        //Start game loop
        
        this.RUNNING = true;
        this.REQUEST_FRAME();
        
        //Debug: Game Start

        if (this.DEBUG)
            console.log(
                this.LOG.TIMEFORMAT() + 'Started game loop at ' + this.SETTINGS.FPS + ' FPS!'
            );
    },
    LOG: {
        DATE: 0,
        DATA: {
            FRAMES: 0,
            UPDATES: 0,
            R_DT: 0,
            U_DT: 0,
            TIMESTAMP: 0,
            P_TIMESTAMP: 0
        },
        UPDATE: function() {
            if (this.DATE != new Date().getSeconds()) {
                this.DATE = new Date().getSeconds();
                
                this.DATA.COUNTER.Text(
                    this.DATA.FRAMES + ' FPS | ' + this.DATA.UPDATES + ' UPS'
                );
                
                this.DATA.FRAMES = 0;
                this.DATA.UPDATES = 0;
            }
        },
        TIMEFORMAT: function() {
            return 'Lynx2D ['+new Date().toTimeString().substring(0,8)+'] - ';
        }
    },
    SETTINGS: {
        FPS: 60,
        AA: true,
        LIMITERS: {
            PARTICLES: 300   
        }
    },
    PHYSICS: {
        STEPS: 60
    },
    TIMESTAMP: function() {
        return (window.performance && window.performance.now) ? window.performance.now() : new Date().getTime();
    },
    CLEAR: function() {
        lx.CONTEXT.GRAPHICS.clearRect(
            0, 
            0, 
            lx.CONTEXT.GRAPHICS.canvas.width, 
            lx.CONTEXT.GRAPHICS.canvas.height
        );  
    },
    RESET: function() {
        this.BUFFER = [];
        this.EVENTS = [];
        this.UI = [];
        this.COLLIDERS = [];
        this.LAYER_DRAW_EVENTS = [];
        this.LOOPS = [];
        this.FOCUS = undefined;
    },
    LOOP: function() {
        if (lx.GAME.RUNNING) {
            lx.GAME.LOG.DATA.TIMESTAMP = lx.GAME.TIMESTAMP();
            
            lx.GAME.LOG.DATA.U_DT = 
                lx.GAME.LOG.DATA.U_DT + Math.min(1, (lx.GAME.LOG.DATA.TIMESTAMP - lx.GAME.LOG.DATA.P_TIMESTAMP) / 1000);
            lx.GAME.LOG.DATA.R_DT = 
                lx.GAME.LOG.DATA.R_DT + Math.min(1, (lx.GAME.LOG.DATA.TIMESTAMP - lx.GAME.LOG.DATA.P_TIMESTAMP) / 1000);

            while (lx.GAME.LOG.DATA.U_DT >= 1/60) {
                lx.GAME.LOG.DATA.U_DT = lx.GAME.LOG.DATA.U_DT - 1/60;
                lx.GAME.UPDATE();
            }

            while (lx.GAME.LOG.DATA.R_DT >= 1/lx.GAME.SETTINGS.FPS) {
                lx.GAME.LOG.DATA.R_DT = lx.GAME.LOG.DATA.R_DT - 1/lx.GAME.SETTINGS.FPS;
                lx.GAME.RENDER();
            }

            lx.GAME.LOG.DATA.P_TIMESTAMP = lx.GAME.LOG.DATA.TIMESTAMP;
        }

        lx.GAME.REQUEST_FRAME();
    },
    UPDATE: function(DT) {
        //Events

        this.EVENTS.forEach(function(obj) {
            if (obj != undefined) 
                if (obj.TYPE == 'key' && lx.CONTEXT.CONTROLLER.KEYS[obj.EVENT] || 
                    obj.TYPE == 'mousebutton' && 
                    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[obj.EVENT]) 
                    for (let i = 0; i < obj.CALLBACK.length; i++) 
                        if (obj.CALLBACK[i] != undefined) 
                            try {
                                obj.CALLBACK[i]({ 
                                    mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS, 
                                    state: 1 
                                });
                            } catch (err) {
                                console.log(err)
                            };
        });
        
        //GameObjects

        for (let i = 0; i < this.BUFFER.length; i++) 
            if (this.BUFFER[i] != undefined) {
                let done = 0;
                
                this.BUFFER[i].forEach(function(obj) {
                    if (obj != undefined && obj.UPDATES) {
                        try {
                            obj.UPDATE();
                            
                            done++;
                        } catch (err) {
                            console.log(err);
                        };
                    }
                });
                
                if (done == 0)
                    this.BUFFER[i] = [];
            }
    
        //Colliders

        this.COLLIDERS.forEach(function(coll1) {
            if (coll1 != undefined) 
                lx.GAME.COLLIDERS.forEach(function(coll2) {
                    if (coll2 != undefined && 
                        coll1.COLLIDER_ID != coll2.COLLIDER_ID) 
                        try {
                            let collision = false;
                            
                            //Check for collision
                            
                            collision = coll2.CheckCollision(coll1);

                            //Act accordingly

                            if (collision) {
    
                                //Callback on collision to
                                //both colliders

                                coll1.OnCollide({
                                    self: coll1,
                                    trigger: coll2,
                                    direction: collision.direction,
                                    gameObject: collision.gameObject,
                                    static: coll2.Static(),
                                    solid: coll2.Solid()
                                });
                            }
                        } catch (err) {
                            console.log(err);
                        };
                });
        });

        //Loop

        this.LOOPS.forEach(function(loop) {
            try {
                if (loop != undefined) 
                    loop(); 
            } catch (err) {
                console.log(err);  
            };
        });
        
        //UI

        this.UI.forEach(function(element) {
            try {
                if (element != undefined) 
                    element.UPDATE();
            } catch (err) {
                console.log(err);  
            };
        });
        
        //Audio

        this.AUDIO.UPDATE();

        //Update Log
        
        this.LOG.UPDATE();
        
        this.LOG.DATA.UPDATES++;
    },
    RENDER: function() {
        //Clear and initialize rendering preferences

        this.CLEAR();

        lx.CONTEXT.GRAPHICS.imageSmoothingEnabled = this.SETTINGS.AA;
        
        //Render buffer

        for (let i = 0; i < this.BUFFER.length; i++) {
            try {
                if (this.BUFFER[i] != undefined) 
                    this.BUFFER[i].forEach(function(obj) {
                        if (obj != undefined) 
                            obj.RENDER();
                    });

                if (this.LAYER_DRAW_EVENTS[i] != undefined) 
                    for (let ii = 0; ii < this.LAYER_DRAW_EVENTS[i].length; ii++)
                        if (this.LAYER_DRAW_EVENTS[i][ii] != undefined) 
                            this.LAYER_DRAW_EVENTS[i][ii](lx.CONTEXT.GRAPHICS);
            } catch (err) {
                console.log(err);
            };
        }
        
        //Debug: FPS and UPS

        if (this.DEBUG) {
            //FPS and UPS

            this.LOG.DATA.COUNTER.RENDER();
        }
        
        //Debug: Draw colliders

        if (this.DRAW_COLLIDERS) 
            this.COLLIDERS.forEach(function(obj) {
                if (obj != undefined) 
                    lx.CONTEXT.GRAPHICS.strokeRect(
                        lx.GAME.TRANSLATE_FROM_FOCUS(obj.POS).X, 
                        lx.GAME.TRANSLATE_FROM_FOCUS(obj.POS).Y, 
                        obj.SIZE.W, 
                        obj.SIZE.H
                    ); 
            });
        
        //User Interface

        for (let i = 0; i < this.UI.length; i++) 
            if (this.UI[i] != undefined) 
                if (this.UI[i].UI_ID != undefined) 
                    this.UI[i].RENDER();
                else 
                    this.UI[i] = undefined;
        
        //Update frames

        this.LOG.DATA.FRAMES++;
    },
    REQUEST_FRAME: function() {
        window.requestAnimationFrame(lx.GAME.LOOP)
    },
    ADD_TO_BUFFER: function(OBJECT, LAYER) {
        if (this.BUFFER[LAYER] == undefined) 
            this.BUFFER[LAYER] = [];
        
        for (let i = 0; i < this.BUFFER[LAYER].length+1; i++) 
            if (this.BUFFER[LAYER][i] == undefined) {
                this.BUFFER[LAYER][i] = OBJECT;
                return i;
            }
    },
    ADD_LOOPS: function(CALLBACK) {
        if (CALLBACK == undefined) 
            return -1;
        
        for (let i = 0; i < this.LOOPS.length+1; i++) 
            if (this.LOOPS[i] == undefined) {
                this.LOOPS[i] = CALLBACK;
                return i;
            }
    },
    ADD_EVENT: function(TYPE, EVENT, CALLBACK) {
        for (let i = 0; i < this.EVENTS.length; i++)
            if (this.EVENTS[i] != undefined && 
                this.EVENTS[i].TYPE == TYPE && 
                this.EVENTS[i].EVENT == EVENT) 
                for (let ii = 0; ii <= this.EVENTS[i].CALLBACK.length; ii++)
                    if (this.EVENTS[i].CALLBACK[ii] == undefined) {
                        this.EVENTS[i].CALLBACK[ii] = CALLBACK;

                        return ii;
                    }
            
        for (let i = 0; i < this.EVENTS.length+1; i++) 
            if (this.EVENTS[i] == undefined) {
                this.EVENTS[i] = {
                    TYPE: TYPE,
                    EVENT: EVENT,
                    CALLBACK: [CALLBACK]
                };
                
                return i;
            }
    },
    INVALIDATE_EVENT: function(TYPE, EVENT) {
        for (let i = 0; i < this.EVENTS.length; i++) 
            if (this.EVENTS[i] != undefined && 
                this.EVENTS[i].TYPE == TYPE && 
                this.EVENTS[i].EVENT == EVENT) 
                for (let ii = 0; ii < this.EVENTS[i].CALLBACK.length; ii++)
                    if (this.EVENTS[i].CALLBACK[ii] != undefined) 
                        this.EVENTS[i].CALLBACK[ii]({
                            mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS,
                            state: 0
                        });
    },
    CLEAR_EVENT: function(TYPE, EVENT, CB_ID) {
        for (let i = 0; i < this.EVENTS.length; i++) {
            if (this.EVENTS[i].TYPE == TYPE && this.EVENTS[i].EVENT == EVENT) {
                if (CB_ID != undefined)
                    this.EVENTS[i].CALLBACK[CB_ID] = undefined;
                else
                    this.EVENTS.splice(i, 1);
                
                return;   
            }
        }
    },
    ADD_COLLIDER: function(COLLIDER) {
        for (let i = 0; i < this.COLLIDERS.length+1; i++) {
            if (this.COLLIDERS[i] == undefined) {
                this.COLLIDERS[i] = COLLIDER;
                return i;
            }
        }
    },
    ADD_UI_ELEMENT: function(UI_ELEMENT) {
        for (let i = 0; i < this.UI.length+1; i++) {
            if (this.UI[i] == undefined) {
                this.UI[i] = UI_ELEMENT;
                return i;
            }
        }
    },
    FOCUS_GAMEOBJECT: function(GAMEOBJECT) {
        this.FOCUS = GAMEOBJECT;
    },
    TRANSLATE_FROM_FOCUS: function(POS) {
        if (this.FOCUS == undefined) return POS;
        else {
            if (this.FOCUS.SIZE == undefined)
                this.FOCUS.SIZE = {
                    W: 0,
                    H: 0
                };
            else if (this.FOCUS.SIZE.W == undefined || this.FOCUS.SIZE.H == undefined)
            {
                this.FOCUS.SIZE.W = 0;
                this.FOCUS.SIZE.H = 0;
            }
            
            return {
                X: Math.floor(Math.round(POS.X)-Math.round(this.FOCUS.Position().X)+lx.GetDimensions().width/2-this.FOCUS.SIZE.W/2),
                Y: Math.floor(Math.round(POS.Y)-Math.round(this.FOCUS.Position().Y)+lx.GetDimensions().height/2-this.FOCUS.SIZE.H/2)
            };
        }
    },
    UNTRANSLATE_FROM_FOCUS: function(POS) {
        if (this.FOCUS == undefined) return POS;
        else {
            if (this.FOCUS.SIZE == undefined)
                this.FOCUS.SIZE = {
                    W: 0,
                    H: 0
                };
            else if (this.FOCUS.SIZE.W == undefined || this.FOCUS.SIZE.H == undefined)
            {
                this.FOCUS.SIZE.W = 0;
                this.FOCUS.SIZE.H = 0;
            }
            
            return {
                X: Math.floor(Math.round(POS.X)+Math.round(this.FOCUS.Position().X)-lx.GetDimensions().width/2+this.FOCUS.SIZE.W/2),
                Y: Math.floor(Math.round(POS.Y)+Math.round(this.FOCUS.Position().Y)-lx.GetDimensions().height/2+this.FOCUS.SIZE.H/2)
            };
        }
    },
    ON_SCREEN: function(POS, SIZE) {
        if (this.FOCUS != undefined) {
            if (Math.abs(this.FOCUS.Position().X-POS.X) <= lx.GetDimensions().width/2+SIZE.W && Math.abs(this.FOCUS.Position().Y-POS.Y) <= lx.GetDimensions().height/2+SIZE.H) return true;
            else return false;
        } else {
            if (POS.X+SIZE.W > 0 && POS.X < lx.GetDimensions().width && POS.Y+SIZE.H > 0 && POS.Y < lx.GetDimensions().height) return true;
            else return false;
        }
    },
    ADD_LAYER_DRAW_EVENT: function(LAYER, CALLBACK) {
        if (this.BUFFER[LAYER] == undefined) this.BUFFER[LAYER] = [];
        if (this.LAYER_DRAW_EVENTS[LAYER] == undefined) this.LAYER_DRAW_EVENTS[LAYER] = [];
        
        for (let i = 0; i < this.LAYER_DRAW_EVENTS[LAYER].length+1; i++) {
            if (this.LAYER_DRAW_EVENTS[LAYER][i] == undefined) {
                this.LAYER_DRAW_EVENTS[LAYER][i] = CALLBACK;
                return i;
            }
        }
        
        return -1;
    },
    CLEAR_LAYER_DRAW_EVENT: function(LAYER) {
        this.LAYER_DRAW_EVENTS[LAYER] = undefined;  
    },
    AUDIO: {
        CAN_PLAY: false,
        SOUNDS: [],
        CHANNELS: [],
        SET_CHANNEL_VOLUME: function (CHANNEL, VOL) {
            this.CHANNELS[CHANNEL] = VOL;
        },
        GET_CHANNEL_VOLUME: function (CHANNEL) {
            if (this.CHANNELS[CHANNEL] == undefined) this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            return this.CHANNELS[CHANNEL];
        },
        ADD: function (SRC, CHANNEL, DELAY, LOOPS) {
            if (!this.CAN_PLAY || SRC == "") return;
            
            if (this.CHANNELS[CHANNEL] == undefined) this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            for (let i = 0; i <= this.SOUNDS.length; i++) {
                if (this.SOUNDS[i] == undefined) {
                    this.SOUNDS[i] = {
                        CUR: 0,
                        SRC: SRC,
                        CHANNEL: CHANNEL,
                        SPATIAL: false,
                        DELAY: DELAY,
                        LOOPS: LOOPS,
                        PLAYING: false
                    };
                    
                    return i;
                }
            }
        },
        ADD_SPATIAL: function(POS, SRC, CHANNEL, DELAY, LOOPS) {
            if (!this.CAN_PLAY || SRC == "") return;
            
            if (this.CHANNELS[CHANNEL] == undefined) this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            for (let i = 0; i <= this.SOUNDS.length; i++) {
                if (this.SOUNDS[i] == undefined) {
                    this.SOUNDS[i] = {
                        CUR: 0,
                        POS: POS,
                        SRC: SRC,
                        SPATIAL: true,
                        CHANNEL: CHANNEL,
                        DELAY: DELAY,
                        LOOPS: LOOPS,
                        PLAYING: false
                    };
                    
                    return i;
                }
            }
        },
        CALCULATE_SPATIAL: function(POS, CHANNEL) {
            POS = lx.GAME.TRANSLATE_FROM_FOCUS(POS);
            let VOL = 1-(Math.abs(POS.X - lx.GetDimensions().width/2)/lx.GetDimensions().width + Math.abs(POS.Y - lx.GetDimensions().height/2)/lx.GetDimensions().height);
            
            if (VOL < 0) VOL = 0;
            else if (VOL > this.CHANNELS[CHANNEL]) VOL = this.CHANNELS[CHANNEL];
            
            return VOL;
        },
        UPDATE: function () {
            if (!this.CAN_PLAY) return;
            
            for (let i = 0; i < this.SOUNDS.length; i++) {
                if (this.SOUNDS[i] == undefined) 
                    continue;
                
                if (this.SOUNDS[i].PLAYING) 
                {
                    if (this.SOUNDS[i].SPATIAL)
                        this.SOUNDS[i].AUDIO.volume = this.CALCULATE_SPATIAL(this.SOUNDS[i].POS, this.SOUNDS[i].CHANNEL);
                        
                    continue;
                }
                
                this.SOUNDS[i].CUR++;
                if (this.SOUNDS[i].DELAY == undefined || this.SOUNDS[i].CUR >= this.SOUNDS[i].DELAY) {
                    let temp = new Audio();
                    temp.type = 'audio/mpeg';
                    temp.src = this.SOUNDS[i].SRC;
                    temp.play_id = i;
                    temp.onended = function() {
                        if (lx.GAME.AUDIO.SOUNDS[this.play_id].LOOPS)
                            lx.GAME.AUDIO.SOUNDS[this.play_id].AUDIO.play();
                        else
                            lx.GAME.AUDIO.SOUNDS[this.play_id] = undefined;
                    }
                    
                    if (!this.SOUNDS[i].SPATIAL) 
                        temp.volume = this.CHANNELS[this.SOUNDS[i].CHANNEL];
                    else 
                        temp.volume = this.CALCULATE_SPATIAL(this.SOUNDS[i].POS, this.SOUNDS[i].CHANNEL);
                    
                    this.SOUNDS[i].PLAYING = true;
                    this.SOUNDS[i].AUDIO = temp;
                    this.SOUNDS[i].AUDIO.play();
                }
            }
        },
        REMOVE: function(ID) {
            if (ID == undefined || this.SOUNDS[ID] == undefined || !this.SOUNDS[ID].PLAYING)
                return;
            
            this.SOUNDS[ID].AUDIO.pause();
            this.SOUNDS[ID].AUDIO.currentTime = 0;
            
            this.SOUNDS[ID] = undefined;
        }
    },
    ADD_GO_MOUSE_EVENT: function (GO, BUTTON, CALLBACK) {
        for (let i = 0; i < this.GO_MOUSE_EVENTS.length+1; i++)
            if (this.GO_MOUSE_EVENTS[i] == undefined) {
                this.GO_MOUSE_EVENTS[i] = {
                    GO: GO,
                    BUTTON: BUTTON,
                    CALLBACK: CALLBACK  
                };
                
                return i;
            }
        
        return -1;
    },
    REMOVE_GO_MOUSE_EVENT: function (ID) {
        this.GO_MOUSE_EVENTS[ID] = undefined;
    },
    HANDLE_MOUSE_CLICK: function (BUTTON) {
        for (let i = 0; i < this.GO_MOUSE_EVENTS.length; i++)
            if (this.GO_MOUSE_EVENTS[i] != undefined && this.GO_MOUSE_EVENTS[i].BUTTON == BUTTON)
                if (this.GO_MOUSE_EVENTS[i].GO == undefined)
                    this.GO_MOUSE_EVENTS[i] = undefined;
                else if (lx.GAME.GET_MOUSE_IN_BOX(
                    this.GO_MOUSE_EVENTS[i].GO.POS, 
                    this.GO_MOUSE_EVENTS[i].GO.SIZE
                ))
                this.GO_MOUSE_EVENTS[i].CALLBACK({
                    mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS,
                    state: 1
                });
                    
        //...
    },
    GET_MOUSE_IN_BOX: function (POS, SIZE) {
        if (this.FOCUS != undefined) 
            POS = this.TRANSLATE_FROM_FOCUS(POS);
        
        if (POS.X <= lx.CONTEXT.CONTROLLER.MOUSE.POS.X && POS.X+SIZE.W >= lx.CONTEXT.CONTROLLER.MOUSE.POS.X && 
            POS.Y <= lx.CONTEXT.CONTROLLER.MOUSE.POS.Y && POS.Y+SIZE.H >= lx.CONTEXT.CONTROLLER.MOUSE.POS.Y)
                return true;
        
        return false;
    }
};

/* Main */

this.Initialize = function(target) {
    //Setup canvas

    this.CONTEXT.CANVAS = document.createElement('canvas');
    this.CONTEXT.CANVAS.id = 'lynx-canvas';
    this.CONTEXT.CANVAS.style = 'background-color: #282828;';
    this.CONTEXT.CANVAS.oncontextmenu = function(e) { e.preventDefault(); return false; };
    
    //Setup graphics
    
    this.CONTEXT.GRAPHICS = this.CONTEXT.CANVAS.getContext('2d');

    //Older framework usability

    let targetIsString = (typeof target === 'string');

    //Check if target is supplied
    //and add to target (standard is body)
    
    if (target == undefined ||
        targetIsString) {
        if (targetIsString)
            document.title = target;

        target = document.body;
        this.CONTEXT.CANVAS.style = 'background-color: #282828; position: absolute; top: 0px; left: 0px;';
    }

    target.appendChild(this.CONTEXT.CANVAS);
    
    //Setup window

    window.onresize = function() {
        let width = target.offsetWidth,
            height = target.offsetWidth;

        if (target == document.body) {
            width = self.innerWidth;
            height = self.innerHeight;
        }

        lx.CONTEXT.CANVAS.width = width;
        lx.CONTEXT.CANVAS.height = height;
    };

    window.onresize();

    //Create standard controller

    if (this.CONTEXT.CONTROLLER == undefined)
        this.CreateController();
    
    return this;
};

this.Start = function(fps) {
    //Init game loop

    if (fps == undefined)
        fps = 60;

    this.GAME.INIT(fps);
    
    return this;
};

this.Background = function(color) {
    if (this.CONTEXT.CANVAS == undefined) {
        if (color != undefined) 
            return this;
        else 
            return;
    }
    
    if (color == undefined) 
        return this.CONTEXT.CANVAS.style.backgroundColor;
    else
        this.CONTEXT.CANVAS.style.backgroundColor = color;
    
    return this;
};

this.GetDimensions = function() {
    if (this.CONTEXT.CANVAS == undefined) {
        console.log(this.GAME.LOG.TIMEFORMAT + 'Could not get canvas dimensions, Lynx2D is not initialized!')
        
        return {
            width: self.innerWidth,
            height: self.innerHeight
        }
    }
    
    return {
        width: this.CONTEXT.CANVAS.width,
        height: this.CONTEXT.CANVAS.height
    };
};

this.LoadScene = function(scene) {
    //Clear previous data
    this.GAME.RESET();
    
    //Create new controller
    this.CreateController();
    
    //Call new scene
    scene.CALLBACK();
    
    //[ENGINE-FEATURE] Notify engine of scene change
    if (scene.ENGINE_ID != undefined)
        console.log("ENGINE_INTERACTION_LOAD_SCENE(" + scene.ENGINE_ID + ")");
    
    return this;
};

this.CreateController = function() {
    //Create a new controller
    this.CONTEXT.CONTROLLER = {
        KEYS: [],
        STOPPED_KEYS: [],
        MOUSE: {
            POS: {
                X: 0,
                Y: 0
            },
            BUTTONS: [],
            STOPPED_BUTTONS: []
        }
    };
    
    //Init/clear set game events
    this.GAME.EVENTS = [];
    
    //Append event listeners
    
    //Key events
    
    document.addEventListener('keydown', function(EVENT) { 
        lx.GAME.AUDIO.CAN_PLAY = true; 
        
        if (lx.CONTEXT.CONTROLLER.STOPPED_KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()]) return; 
        
        if (EVENT.keyCode === 27)
                lx.CONTEXT.CONTROLLER.KEYS['escape'] = true;
        
        lx.CONTEXT.CONTROLLER.KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()] = true;
        lx.CONTEXT.CONTROLLER.KEYS[EVENT.keyCode] = true;
    });
    
    document.addEventListener('keyup', function(EVENT) { 
        if (!lx.CONTEXT.CONTROLLER.STOPPED_KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()]) 
            lx.GAME.INVALIDATE_EVENT('key', String.fromCharCode(EVENT.keyCode).toLowerCase());
        
        lx.CONTEXT.CONTROLLER.STOPPED_KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()] = false; 
        
        if (EVENT.keyCode === 27)
            lx.CONTEXT.CONTROLLER.KEYS['escape'] = false;
        
        lx.CONTEXT.CONTROLLER.KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()] = false;
        lx.CONTEXT.CONTROLLER.KEYS[EVENT.keyCode] = false;
    });
    
    //Mouse events
    
    this.CONTEXT.CANVAS.addEventListener('mousedown', function(EVENT) { 
        lx.GAME.AUDIO.CAN_PLAY = true; 
        
        if (lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[EVENT.button]) return; 
        
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[EVENT.button] = true; 
        lx.GAME.HANDLE_MOUSE_CLICK(EVENT.button); 
    });
    
    this.CONTEXT.CANVAS.addEventListener('mouseup', function(EVENT) { 
        if (!lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[EVENT.button])
            lx.GAME.INVALIDATE_EVENT('mousebutton', EVENT.button);
        
        lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[EVENT.button] = false; 
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[EVENT.button] = false; 
    });
    
    document.addEventListener('mousemove', function(EVENT) { 
        lx.CONTEXT.CONTROLLER.MOUSE.POS = { X: EVENT.pageX, Y: EVENT.pageY }; 
        if (lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER != undefined) lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER(lx.CONTEXT.CONTROLLER.MOUSE.POS); 
    });
    
    //Touch events
    
    const options = {
        passive: true
    };

    this.CONTEXT.CANVAS.addEventListener('touchstart', function(EVENT) {
        lx.GAME.AUDIO.CAN_PLAY = true;

        lx.CONTEXT.CONTROLLER.MOUSE.POS = { X: EVENT.pageX, Y: EVENT.pageY };

        if (lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[0]) return;
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0] = true;
        lx.GAME.HANDLE_MOUSE_CLICK(0);
    }, options);
    this.CONTEXT.CANVAS.addEventListener('touchend', function(EVENT) {
        if (!lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[0])
            lx.GAME.INVALIDATE_EVENT('mousebutton', 0);

        lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[0] = false;
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0] = false;
    }, options);
    
    return this;
};

this.GetFocus = function() {
    return this.GAME.FOCUS;
};

this.ResetCentering = function() {
    this.GAME.FOCUS = undefined;  
    
    return this;
};

/* Settings */

this.Smoothing = function(smoothes) {
    if (smoothes == undefined) 
        return this.GAME.SETTINGS.AA;
    else 
        this.GAME.SETTINGS.AA = smoothes;  
    
    return this;
};

this.Framerate = function(fps) {
    if (fps == undefined) 
        return this.GAME.SETTINGS.FPS;
    else 
        this.GAME.SETTINGS.FPS = fps;  
    
    return this;
};

this.ParticleLimit = function(amount) {
    if (amount != undefined) 
        this.GAME.SETTINGS.LIMITERS.PARTICLES = amount;
    else 
        return this.GAME.SETTINGS.LIMITERS.PARTICLES;
    
    return this;
};

this.ChannelVolume = function(channel, volume) {
    if (channel != undefined && volume != undefined) 
        this.GAME.AUDIO.SET_CHANNEL_VOLUME(channel, volume);
    else if (channel != undefined) 
        return this.GAME.AUDIO.GET_CHANNEL_VOLUME(channel);
    
    return this;
};

/* Finding */

this.FindGameObjectWithCollider = function(collider) {
    for (let i = 0; i < this.GAME.BUFFER.length; i++) {
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) {
                if (this.GAME.BUFFER[i][ii] != undefined && this.GAME.BUFFER[i][ii].COLLIDER != undefined && this.GAME.BUFFER[i][ii].COLLIDER.COLLIDER_ID == collider.COLLIDER_ID) return this.GAME.BUFFER[i][ii];
            }
        }   
    }
};

this.FindGameObjectWithIdentifier = function(ID) {
    for (let i = 0; i < this.GAME.BUFFER.length; i++) 
        if (this.GAME.BUFFER[i] != undefined) 
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) 
                if (this.GAME.BUFFER[i][ii] != undefined && 
                    this.GAME.BUFFER[i][ii].Identifier != undefined &&
                    this.GAME.BUFFER[i][ii].Identifier() === ID) 
                    return this.GAME.BUFFER[i][ii];
};

this.FindGameObjectsWithIdentifier = function(ID) {
    let result = [];
    
    for (let i = 0; i < this.GAME.BUFFER.length; i++) 
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++)
                if (this.GAME.BUFFER[i][ii] != undefined && 
                    this.GAME.BUFFER[i][ii].Identifier != undefined &&
                    this.GAME.BUFFER[i][ii].Identifier() === ID) 
                    result[result.length] = this.GAME.BUFFER[i][ii];
            
            return result;
        }   
};

/* Events */

this.OnKey = function(key, callback) {
    if (isNaN(key))
        this.GAME.ADD_EVENT('key', key.toLowerCase(), callback);
    else
        this.GAME.ADD_EVENT('key', key, callback);
    
    return this;
};

this.ClearKey = function(key) {
    this.GAME.CLEAR_EVENT('key', key.toLowerCase());
    
    return this;
};

this.StopKey = function(key) {
    lx.CONTEXT.CONTROLLER.KEYS[key.toLowerCase()] = false;
    lx.CONTEXT.CONTROLLER.STOPPED_KEYS[key.toLowerCase()] = true;
    
    return this;
};

this.OnMouse = function(button, callback) {
    this.GAME.ADD_EVENT('mousebutton', button, callback);
    
    return this;
};

this.ClearMouse = function(button) {
    this.GAME.CLEAR_EVENT('mousebutton', button);
    
    return this;
};

this.StopMouse = function(button) {
    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[button] = false;
    lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[button] = true;
    
    return this;
};

this.OnMouseMove = function(callback) {
    if (lx.CONTEXT.CONTROLLER != undefined) 
        lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER = callback;
    
    return this;
};

this.ClearMouseMove = function() {
    lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER = undefined;

    return this;
};

this.Loops = function(callback) {
    this.GAME.ADD_LOOPS(callback);
    
    return this;
};

this.ClearLoops = function() {
    this.GAME.LOOPS = [];
    
    return this;
};

/* Drawing */

this.OnLayerDraw = function(layer, callback) {
    this.GAME.ADD_LAYER_DRAW_EVENT(layer, callback);
    
    return this;
};

this.ClearLayerDraw = function(layer) {
    this.GAME.CLEAR_LAYER_DRAW_EVENT(layer);
    
    return this;
};

this.ResetLayerDraw = function() {
    this.GAME.LAYER_DRAW_EVENTS = [];
    
    return this;
};

this.DrawSprite = function(sprite, x, y, w, h) {
    if (w == undefined || h == undefined) {
        w = sprite.Size().W;
        h = sprite.Size().H;
    };
    
    if (!lx.GAME.ON_SCREEN({
        X: x,
        Y: y
    }, {
        W: w,
        H: h
    }))
        return;
    
    sprite.RENDER(this.GAME.TRANSLATE_FROM_FOCUS({
        X: x, 
        Y: y
    }),
    {
        W: w,
        H: h
    });
    
    return this;
};

/* Tools */

this.CreateHorizontalTileSheet = function(sprite, cw, ch) {
    let result = [];

    let w = Math.round(sprite.Size().W/cw),
        h = Math.round(sprite.Size().H/ch);

    for (let y = 0; y < h; y++) {
        if (result[y] == undefined)
            result[y] = [];

        for (let x = 0; x < w; x++)
            result[y][x] = new lx.Sprite(sprite.IMG, x*cw, y*ch, cw, ch);
    }

    return result;
};

this.CreateVerticalTileSheet = function(sprite, cw, ch) {
    let result = [];

    let w = Math.round(sprite.Size().W/cw),
        h = Math.round(sprite.Size().H/ch);

    for (let x = 0; x < w; x++) {
        if (result[x] == undefined)
            result[x] = [];

        for (let y = 0; y < h; y++)
            result[x][y] = new lx.Sprite(sprite.IMG, x*cw, y*ch, cw, ch);
    }

    return result;
};

/* Animation Object */

this.Animation = function (sprite_collection, speed) {
    this.SPRITES = sprite_collection;
    this.FRAME = 0;
    this.ROTATION = 0;
    this.MAX_FRAMES = sprite_collection.length;
    this.TIMER = {
        FRAMES: [],
        STANDARD: speed,
        CURRENT: 0
    };
    this.BUFFER_ID = -1;
    this.BUFFER_LAYER = 0;
    this.UPDATES = true;

    this.Show = function(layer, x, y, w, h, amount) {
        if (this.BUFFER_ID != -1) 
            this.Hide();
        
        this.POS = {
            X: x,
            Y: y
        };

        if (h != undefined)
            this.SIZE = {
                W: w,
                H: h
            };
        else
            this.SIZE = undefined;

        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        if (amount != undefined) 
            this.MAX_AMOUNT = amount;
        
        return this;
    };

    this.Hide = function() {
        if (this.BUFFER_ID == -1) 
            return;
        
        if (lx.GAME.BUFFER[this.BUFFER_LAYER] != undefined)
            lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined;
        
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        return this;
    };

    this.Speed = function(speed) {
        if (speed != undefined) 
            this.TIMER.STANDARD = speed;
        else 
            return this.TIMER.STANDARD;
        
        return this;
    };
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };

    this.Rotation = function(angle) {
        if (angle == undefined)
            return this.ROTATION;
        else
            this.ROTATION = angle;

        return this;
    };
    
    this.GET_CURRENT_FRAME = function() {
        return this.SPRITES[this.FRAME];
    };
    
    this.RENDER = function(POS, SIZE, OPACITY) {
        this.SPRITES[this.FRAME].ROTATION = this.ROTATION;

        if (this.BUFFER_ID == -1) 
            this.SPRITES[this.FRAME].RENDER(POS, SIZE, OPACITY);
        else 
            this.SPRITES[this.FRAME].RENDER(lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), this.SIZE, OPACITY);
    };
    
    this.UPDATE = function() {
        if (this.TIMER.FRAMES.length === this.MAX_FRAMES)
            this.TIMER.STANDARD = this.TIMER.FRAMES[this.FRAME];
        
        this.TIMER.CURRENT++;
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {
            this.TIMER.CURRENT = 0;
            this.FRAME++;
            
            if (this.FRAME >= this.MAX_FRAMES) {
                this.FRAME = 0;
                
                if (this.MAX_AMOUNT != undefined) {
                    if (this.MAX_AMOUNT == 0) {
                        this.MAX_AMOUNT = undefined;
                        this.Hide();
                    } else this.MAX_AMOUNT--;
                }
            }
        }
        
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};

/* Collider Object */

this.Collider = function (x, y, w, h, is_static, callback) {
    this.POS = {
        X: x,
        Y: y
    };
    this.OFFSET = {
        X: 0,
        Y: 0
    };
    this.SIZE = {
        W: w,
        H: h
    };
    this.STATIC = is_static;
    this.SOLID = true;
    this.ENABLED = false;

    //Setup callback
    
    if (callback != undefined) 
        this.OnCollide = callback;
    else 
        this.OnCollide = function() {};
    
    this.Size = function(width, height) {
        if (width == undefined || height == undefined) 
            return this.SIZE;
        else 
            this.SIZE = {
                W: width,
                H: height
            };
        
        return this;
    };

    this.Static = function(is_static) {
        if (is_static == undefined) 
            return this.STATIC;
        else 
            this.STATIC = is_static;
        
        return this;
    };

    this.Solid = function(is_solid) {
        if (is_solid == undefined) 
            return this.SOLID;
        else 
            this.SOLID = is_solid;
        
        return this;
    };

    this.Position = function(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };

    this.Identifier = function(ID) {
        if (ID == undefined) 
            return this.IDENTIFIER;
        else 
            this.IDENTIFIER = ID;
        
        return this;
    };

    this.Enable = function() {
        if (this.ENABLED) 
            return;
        
        this.COLLIDER_ID = lx.GAME.ADD_COLLIDER(this);
        
        this.ENABLED = true;
        
        return this;
    };

    this.Disable = function() {
        if (!this.ENABLED) return;
        
        lx.GAME.COLLIDERS[this.COLLIDER_ID] = undefined;
        this.COLLIDER_ID = undefined;
        
        this.ENABLED = false;
        
        return this;
    };
    
    this.CheckCollision = function(collider) {
        //If the collider has not been fully initialized yet, stop collision detection.

        if (this.POS.X != 0 && 
            this.POS.Y != 0 && 
            this.POS.X == this.OFFSET.X && 
            this.POS.Y == this.OFFSET.Y) 
            return false;

        //Check if collision occurred
        
        let result = !(((collider.POS.Y + collider.SIZE.H) < (this.POS.Y)) || 
                        (collider.POS.Y > (this.POS.Y + this.SIZE.H)) || 
                        ((collider.POS.X + collider.SIZE.W) < this.POS.X) || 
                        (collider.POS.X > (this.POS.X + this.SIZE.W)
                      ));

        //Check direction if occurance took place
        
        if (result) {
            let lowest, distances = [{
                tag: 'right',
                actual: Math.abs(this.POS.X-collider.POS.X-collider.SIZE.W)
            },
            {
                tag: 'left',
                actual: Math.abs(collider.POS.X-this.POS.X-this.SIZE.W)
            },
            {
                tag: 'down',
                actual: Math.abs(this.POS.Y-collider.POS.Y-collider.SIZE.H)
            },
            {
                tag: 'up',
                actual: Math.abs(collider.POS.Y-this.POS.Y-this.SIZE.H)
            }];

            //Check which directional distance is the smallest
            
            distances.forEach(function (obj) {
                if (lowest == undefined || 
                    obj.actual < lowest.actual) 
                    lowest = obj;
            });

            //Generate collider response

            let response = {
                direction: lowest.tag
            };
            
            //Adjust position respectively

            if (this.SOLID && 
                !collider.STATIC) {
                let go = lx.FindGameObjectWithCollider(collider);

                if (go != undefined) {
                    //Add the gameObject property to
                    //the collision response

                    response.gameObject = go;

                    //Adjust position

                    let pos = go.Position();
                    switch(lowest.tag) {
                        case 'right':
                            go.Position(pos.X-lowest.actual, pos.Y);
                            break;
                        case 'left':
                            go.Position(pos.X+lowest.actual, pos.Y);
                            break;
                        case 'down':
                            go.Position(pos.X, pos.Y-lowest.actual);
                            break;
                        case 'up':
                            go.Position(pos.X, pos.Y+lowest.actual);
                            break;
                    };
                }
            }
            
            //Return response

            return response;
        } 

        //Otherwise return result (false)

        else 
            return false;
    };
    
    if (is_static) 
        this.Enable();
};

/* Emitter Object */

this.Emitter = function(sprite, x, y, amount, duration) {
    this.BUFFER_ID = -1;
    this.BUFFER_LAYER = 0;
    this.SPRITE = sprite;
    this.MOVEMENT = {
        MIN_VX: -1,
        MAX_VX: 1,
        MIN_VY: -1,
        MAX_VY: 1,
        DECELERATES: true
    };
    this.POS = {
        X: x,
        Y: y
    };
    this.SIZE = {
        MIN: 8,
        MAX: 16
    };
    this.RANGE = {
        X: 1,
        Y: 1
    };
    this.TIMER = {
        STANDARD: 60,
        CURRENT: 60
    };
    this.AMOUNT = amount;
    this.DURATION = duration;
    this.PARTICLES = [];
    this.UPDATES = true;
    
    this.Setup = function(min_vx, max_vx, min_vy, max_vy, min_size, max_size) {
        this.MOVEMENT.MIN_VX = min_vx;
        this.MOVEMENT.MAX_VX = max_vx;
        this.MOVEMENT.MIN_VY = min_vy;
        this.MOVEMENT.MAX_VY = max_vy;
        this.SIZE.MIN = min_size;
        this.SIZE.MAX = max_size;
        
        return this;
    };

    this.Range = function(x_range, y_range) {
        if (x_range != undefined && y_range != undefined)
            this.RANGE = {
                X: x_range,
                Y: y_range
            };
        else
            return this.RANGE;

        return this;
    };

    this.Speed = function(speed) {
        if (speed != undefined) 
            this.TIMER.STANDARD = speed;
        else 
            return this.TIMER.STANDARD;
        
        return this;
    };

    this.MovementDecelerates = function(decelerates) {
        if (decelerates != undefined) this.MOVEMENT.DECELERATES = decelerates;
        else return this.MOVEMENT.DECELERATES;
        
        return this;
    };

    this.Position = function(x, y) {
        if (x != undefined && y != undefined) {
            if (this.OFFSET == undefined) this.POS = {
                X: x,
                Y: y
            };
            else this.OFFSET = {
                X: x,
                Y: y
            };
        }
        else return this.POS;
        
        return this;
    };

    this.Follows = function(target) {
        if (target != undefined) {
            this.TARGET = target;
            this.OFFSET = this.POS;
        }
        else 
        return this.TARGET;
        
        return this;
    };

    this.StopFollowing = function() {
        this.TARGET = undefined; 
        this.POS = this.OFFSET;
        this.OFFSET = undefined;
        
        return this;
    };

    this.Show = function(layer) {
        if (this.BUFFER_ID != -1) this.Hide();
        
        this.PARTICLES = [];
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        return this;
    };

    this.Hide = function() {
        if (this.BUFFER_ID == -1) return;
        
        lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined; 
        
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        return this;
    };

    this.Emit = function(layer, amount) {
        this.TIMER.CURRENT = this.TIMER.STANDARD;
        this.HIDES_AFTER_AMOUNT = amount;
        
        this.Show(layer);
        
        return this;
    };

    this.RENDER = function() {
        for (let i = 0; i < this.PARTICLES.length; i++) {
            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.globalAlpha = this.PARTICLES[i].OPACITY;
            lx.DrawSprite(this.SPRITE, this.PARTICLES[i].POS.X, this.PARTICLES[i].POS.Y, this.PARTICLES[i].SIZE, this.PARTICLES[i].SIZE);
            lx.CONTEXT.GRAPHICS.restore();
        }
    };
    
    this.UPDATE = function() {
        if (this.TARGET != undefined) {
            this.POS = {
                X: this.TARGET.POS.X+this.OFFSET.X,
                Y: this.TARGET.POS.Y+this.OFFSET.Y
            };
        }

        let VX = this.MOVEMENT.MAX_VX/lx.GAME.PHYSICS.STEPS,
            VY = this.MOVEMENT.MAX_VY/lx.GAME.PHYSICS.STEPS;
        
        for (let i = 0; i < this.PARTICLES.length; i++) {
            if (this.PARTICLES[i].TIMER.CURRENT >= this.PARTICLES[i].TIMER.STANDARD) 
                this.PARTICLES.splice(i, 1);
            else {
                if (this.MOVEMENT.DECELERATES) {
                    if (this.PARTICLES[i].MOVEMENT.VX > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX-VX < 0) 
                            this.PARTICLES[i].MOVEMENT.VX = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VX-=VX;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VY > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY-VY < 0) 
                            this.PARTICLES[i].MOVEMENT.VY = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VY-=VY;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VX < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX+VX > 0) 
                            this.PARTICLES[i].MOVEMENT.VX = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VX+=VX;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VY < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY+VY > 0) 
                            this.PARTICLES[i].MOVEMENT.VY = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VY+=VY;
                    }
                }
                
                this.PARTICLES[i].POS.X += this.PARTICLES[i].MOVEMENT.VX;
                this.PARTICLES[i].POS.Y += this.PARTICLES[i].MOVEMENT.VY;

                this.PARTICLES[i].TIMER.CURRENT++;

                if (this.PARTICLES[i].OPACITY > 0) 
                    this.PARTICLES[i].OPACITY-=1/this.PARTICLES[i].TIMER.STANDARD;
                if (this.PARTICLES[i].OPACITY < 0) 
                    this.PARTICLES[i].OPACITY = 0;
            }
        }
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {            
            for (let i = 0; i < this.AMOUNT;  i++) {
                if (this.PARTICLES.length >= lx.GAME.SETTINGS.LIMITERS.PARTICLES) 
                    break;
                
                this.PARTICLES.unshift({
                    POS: {
                        X: this.POS.X-this.SIZE.MAX/2+Math.random()*this.RANGE.X-Math.random()*this.RANGE.X,
                        Y: this.POS.Y-this.SIZE.MAX/2+Math.random()*this.RANGE.Y-Math.random()*this.RANGE.Y
                    },
                    SIZE: this.SIZE.MIN+Math.random()*(this.SIZE.MAX-this.SIZE.MIN),
                    MOVEMENT: {
                        VX: Math.random()*this.MOVEMENT.MIN_VX+Math.random()*this.MOVEMENT.MAX_VX,
                        VY: Math.random()*this.MOVEMENT.MIN_VY+Math.random()*this.MOVEMENT.MAX_VY
                    },
                    TIMER: {
                        STANDARD: this.DURATION,
                        CURRENT: 0
                    },
                    OPACITY: 1
                });
            }
            
            this.TIMER.CURRENT = 0;
            
            if (this.HIDES_AFTER_AMOUNT != undefined) {
                if (this.HIDES_AFTER_AMOUNT <= 0) {
                    this.Hide();
                    this.HIDES_AFTER_AMOUNT = undefined;
                } else this.HIDES_AFTER_AMOUNT--;
            }
        } else 
            this.TIMER.CURRENT++;
    };
};

/* Gameobject Object */

this.GameObject = function (sprite, x, y, w, h) {
    this.SPRITE = sprite;
    this.BUFFER_ID = -1;
    this.CLICK_ID = [];
    this.BUFFER_LAYER = 0;
    this.UPDATES = true;
    this.OPACITY = 1.0;
    
    this.POS = {
        X: x,
        Y: y
    };
    
    this.MOVEMENT = {
        VX: 0,
        VY: 0,
        VMAX_X: 2,
        VMAX_Y: 2,
        WEIGHT: 1.1,
        DECELERATES: true,
        UPDATE: function() {
            if (this.DECELERATES) {
                let DX = this.VMAX_X/(lx.GAME.PHYSICS.STEPS*this.WEIGHT),
                    DY = this.VMAX_Y/(lx.GAME.PHYSICS.STEPS*this.WEIGHT);

                if (this.VX > 0) 
                    if (this.VX-DX < 0) 
                        this.VX = 0;
                    else 
                        this.VX-=DX;
                if (this.VY > 0) 
                    if (this.VY-DY < 0) 
                        this.VY = 0;
                    else 
                        this.VY-=DY;

                if (this.VX < 0) 
                    if (this.VX+DX > 0) 
                        this.VX = 0;
                    else 
                        this.VX+=DX;
                if (this.VY < 0) 
                    if (this.VY+DY > 0) 
                        this.VY = 0;
                    else 
                        this.VY+=DX;
            }
        },
        APPLY: function(VX, VY) {
            if (VX > 0 && this.VX+VX <= this.VMAX_X || 
                VX < 0 && this.VX+VX >= -this.VMAX_X) 
                this.VX+=VX;
            else if (VX != 0) {
                if (this.VX+VX > this.VMAX_X) 
                    this.VX = this.VMAX_X;
                else if (this.VX+VX < -this.VMAX_X) 
                    this.VX = -this.VMAX_X;
            }
            
            if (VY > 0 && this.VY+VY <= this.VMAX_Y || 
                VY < 0 && this.VY+VY >= -this.VMAX_Y) 
                    this.VY+=VY;
            else if (VY != 0) {
                if (this.VY+VY > this.VMAX_Y) 
                    this.VY = this.VMAX_Y;
                else if (this.VY+VY < -this.VMAX_Y) 
                    this.VY = -this.VMAX_Y;
            }
        }
    };

    this.Sprite = function (sprite) {
        if (sprite == undefined) 
            return this.SPRITE;
        else 
            this.SPRITE = sprite;
        
        return this;
    };
    
    this.Identifier = function (ID) {
        if (ID == undefined) return this.ID;
        else this.ID = ID;
        
        return this;
    };
    
    this.Size = function(width, height) {
        if (width == undefined && height == undefined) 
            return this.SIZE;
        else {
            if (height == undefined)
                height = width;

            this.SIZE = {
                W: width,
                H: height
            };
        }
        
        return this;
    };
    
    this.Position = function(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };
    
    this.Movement = function(vx, vy) {
        if (vx == undefined || vy == undefined) 
        return {
            VX: this.MOVEMENT.VX,
            VY: this.MOVEMENT.VY
        };
        else {
            this.MOVEMENT.VX = vx;
            this.MOVEMENT.VY = vy;
        }
        
        return this;
    };
    
    this.Rotation = function(angle) {
        if (this.SPRITE == undefined &&
            this.ANIMATION == undefined) 
            return this;
        
        if (angle == undefined) {
            if (this.SPRITE != undefined &&
                this.ANIMATION == undefined)
                return this.SPRITE.Rotation();
            else if (this.ANIMATION != undefined)
                return this.ANIMATION.Rotation();
        }
        else {
            if (this.SPRITE != undefined &&
                this.ANIMATION == undefined)
                this.SPRITE.Rotation(angle);
            else if (this.ANIMATION != undefined)
                this.ANIMATION.Rotation(angle);
        }
        
        return this;
    };
    
    this.Clip = function(c_x, c_y, c_w, c_h) {
        if (this.SPRITE == undefined || this.SPRITE == null) 
            return -1;
        
        if (this.ANIMATION == undefined) {
            if (c_x == undefined || 
                c_y == undefined || 
                c_w == undefined || 
                c_h == undefined) 
                return this.SPRITE.Clip();
            
            else 
                this.SPRITE.Clip(c_x, c_y, c_w, c_h);   
        }
        else {
            if (c_x == undefined || c_y == undefined || c_w == undefined || c_h == undefined) 
                return this.ANIMATION.GET_CURRENT_FRAME().Clip();
            
            else 
                console.log('Clipping Error: Clipping while an animation is playing is not possible');
        }
        
        return this;
    };
    
    this.Show = function(layer) {
        if (this.BUFFER_ID != -1) 
            this.Hide();
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        if (this.COLLIDER != undefined) 
            this.COLLIDER.Enable();
        
        return this;
    };
    
    this.Hide = function() {
        if (this.BUFFER_ID == -1) 
            return;
        
        if (lx.GAME.BUFFER[this.BUFFER_LAYER] != undefined)
            lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined;
        
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        if (this.COLLIDER != undefined) 
            this.COLLIDER.Disable();
        
        return this;
    };
        
    this.Focus = function() {
        lx.GAME.FOCUS_GAMEOBJECT(this);  
        
        return this;
    };
    
    this.Opacity = function(opacity) {
        if (opacity == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = opacity;
        
        return this;
    };
    
    this.AddVelocity = function(vel_x, vel_y) {
        this.MOVEMENT.APPLY(vel_x, vel_y);
        
        return this;
    };
        
    this.MaxVelocity = function(max_vel_x, max_vel_y) {
        if (max_vel_x == undefined &&
            max_vel_y == undefined) 
            return {
                VX: this.MOVEMENT.VMAX_X,
                VY: this.MOVEMENT.VMAX_Y
            };
        else {
            this.MOVEMENT.VMAX_Y = this.MOVEMENT.VMAX_X = max_vel_x;
            
            if (max_vel_y != undefined)
                this.MOVEMENT.VMAX_Y = max_vel_y;
        }
        
        return this;
    };
    
    this.MovementDecelerates = function(decelerates) {
        if (decelerates != undefined)
            this.MOVEMENT.DECELERATES = decelerates;  
        else
            return this.MOVEMENT.DECELERATES;
        
        return this;
    };
    
    this.Weight = function(weight) {
        if (weight == undefined)
            return this.MOVEMENT.WEIGHT;
        else
            this.MOVEMENT.WEIGHT = weight;

        return this;
    };
    
    this.SetTopDownController = function(x_speed, y_speed, max_vel_x, max_vel_y) {    
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('W', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, -y_speed); });
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-x_speed, 0); });
        lx.OnKey('S', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, y_speed); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(x_speed, 0); });
        
        this.MaxVelocity(max_vel_x, max_vel_y);
        
        return this;
    };
    
    this.SetSideWaysController = function(speed, max_vel) {
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-speed, 0); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(speed, 0); });
        
        this.MaxVelocity(max_vel);
        
        return this;
    };
    
    this.CreateCollider = function(is_static, callback) {
        let pos = this.Position(),
            size = this.Size();

        this.COLLIDER = new lx.Collider(pos.X, pos.Y, size.W, size.H, is_static, callback);
        this.COLLIDER.OFFSET = {
            X: 0,
            Y: 0
        };
        this.COLLIDER.Enable();
        
        return this;
    };
    
    this.ApplyCollider = function(collider) {
        if (collider == undefined) return;
        
        if (collider.ENABLED) {
            collider.Disable();
        }
        
        this.COLLIDER = collider;
        this.COLLIDER.OFFSET = {
            X: collider.POS.X,
            Y: collider.POS.Y
        };
        this.COLLIDER.Enable();
        
        return this;
    };
    
    this.ClearCollider = function() {
        if (this.COLLIDER == undefined) return;
        
        this.COLLIDER.Disable();
        this.COLLIDER = undefined;
        
        return this;
    };
    
    this.ShowAnimation = function(animation) {
        this.ANIMATION = animation;
        
        return this;
    };
    
    this.ClearAnimation = function() {
        this.ANIMATION = undefined;
        
        return this;
    };
    
    this.ShowColorOverlay = function(color, duration) {
        if (this.ANIMATION != undefined) 
            this.ANIMATION.GET_CURRENT_FRAME().ShowColorOverlay(color, duration);
        else
            this.SPRITE.ShowColorOverlay(color, duration);

        return this;
    };
    
    this.HideColorOverlay = function() {
        this.SPRITE.HideColorOverlay();

        return this;
    };
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };
    
    this.Draws = function(callback) {
        this.DRAWS = callback;  
        
        return this;
    };
    
    this.ClearDraws = function() {
        this.DRAWS = undefined;  
        
        return this;
    };
    
    this.OnMouse = function(button, callback) {
        if (this.CLICK_ID[button] != undefined) {
            console.log(lx.GAME.LOG.TIMEFORMAT() + 'GameObject already has a click handler for button ' + button + '.');
            
            return this;
        } else 
            this.CLICK_ID[button] = lx.GAME.ADD_GO_MOUSE_EVENT(this, button, callback);
        
        return this;
    };
    
    this.RemoveMouse = function(button) {
        if (this.CLICK_ID[button] == undefined) return this;
        else lx.GAME.REMOVE_GO_MOUSE_EVENT(this.CLICK_ID[button]);
            
        return this;
    };

    this.ClearMouse = function() {
        for (let i = 0; i < this.CLICK_ID.length; i++)  
            this.RemoveMouse(i);
    };
    
    this.OnHover = function(callback) {
        if (this.ON_HOVER != undefined) {
            console.log(lx.GAME.LOG.TIMEFORMAT() + 'GameObject already has a mousehover handler.');

            return this;
        } else
            this.ON_HOVER = callback;

        return this;
    };
    
    this.OnHoverDraw = function(callback) {
        if (this.ON_HOVER_DRAW != undefined) {
            console.log(lx.GAME.LOG.TIMEFORMAT() + 'GameObject already has a mousehover draw handler.');

            return this;
        } else
            this.ON_HOVER_DRAW = callback;

        return this;
    };
    
    this.RemoveHover = function() {
        this.ON_HOVER = undefined;

        return this;
    };
    
    this.RemoveHoverDraw = function() {
        this.ON_HOVER_DRAW = undefined;

        return this;
    };
    
    this.RENDER = function() {  
        if (this.SPRITE == undefined || this.SPRITE == null) 
            return;
        
        if (lx.GAME.ON_SCREEN(this.POS, this.SIZE)) {
            if (this.ANIMATION == undefined) 
                this.SPRITE.RENDER(
                    lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), 
                    this.SIZE, 
                    this.OPACITY
                );
            else 
                this.ANIMATION.RENDER(
                    lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), 
                    this.SIZE, 
                    this.OPACITY
                );
            
            if (this.ON_HOVER_DRAW != undefined &&
                lx.GAME.GET_MOUSE_IN_BOX(this.POS, this.SIZE))
                this.ON_HOVER({
                    graphics: lx.CONTEXT.GRAPHICS,
                    position: this.POS,
                    size: this.SIZE
                });
            
            if (this.DRAWS != undefined) 
                this.DRAWS({
                    graphics: lx.CONTEXT.GRAPHICS,
                    position: this.POS,
                    size: this.SIZE
                });
        }
    };
    
    this.UPDATE = function() {
        if (this.ANIMATION != undefined) 
            this.ANIMATION.UPDATE();
        if (this.LOOPS != undefined) 
            this.LOOPS();
        if (this.ON_HOVER != undefined &&
            lx.GAME.GET_MOUSE_IN_BOX(this.POS, this.SIZE))
            this.ON_HOVER({
                position: this.POS,
                size: this.SIZE
            });

        this.MOVEMENT.UPDATE();

        this.POS.X += this.MOVEMENT.VX;
        this.POS.Y += this.MOVEMENT.VY;
        
        if (this.COLLIDER != undefined) 
            this.COLLIDER.POS = {
                X: this.POS.X+this.COLLIDER.OFFSET.X,
                Y: this.POS.Y+this.COLLIDER.OFFSET.Y
            };
    };
    
    if (w != undefined && h != undefined) 
        this.Size(w, h);

    else 
        console.log('GameObjectError: Created a GameObject without a specified size.');
};

/* Ray Object */

this.Ray = function(x, y) {
    this.POS = {
        X: x,
        Y: y
    };

    this.DIR = {
        X: 0,
        Y: 0
    };

    this.Position = function(x, y) {
        if (x != undefined && y != undefined)
            this.POS = {
                X: x,
                Y: y
            };
        else 
            return this.POS;
        
        return this;
    };

    this.Direction = function(x, y) {
        if (x != undefined && y != undefined) {
            this.DIR = {
                X: x - this.POS.X,
                Y: y - this.POS.Y
            };

            let MAGNITUDE = Math.sqrt(this.DIR.X*this.DIR.X + this.DIR.Y*this.DIR.Y);

            this.DIR.X /= MAGNITUDE;
            this.DIR.Y /= MAGNITUDE;
        } else 
            return this.DIR;
        
        return this;
    };

    this.Cast = function(target) {
        if (target.COLLIDER == undefined)
            return false;

        return this.CHECK_INTERSECTION_BOX(target.COLLIDER, false);
    };

    this.CastPoint = function(target) {
        if (target.COLLIDER == undefined)
            return false;

        return this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, true);
    };

    this.CastPoints = function(target) {
        if (target.COLLIDER == undefined)
            return false;

        return this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, false);
    };

    this.CastPointRadially = function(target, degrees) {
        let old_dir = this.DIR,
            points = [];
        
        for (let c = 0; c < 360; c+=degrees) {
            this.DIR = {
                X: Math.cos(c*Math.PI/180),
                Y: Math.sin(c*Math.PI/180)
            };
            
            let result = this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, true);
            
            if (result)
                points.push(result);
        };
        
        this.DIR = old_dir;
        
        return points;
    };

    this.CastPointsRadially = function(target, degrees) {
        let old_dir = this.DIR,
            points = [];
        
        for (let c = 0; c < 360; c+=degrees) {
            this.DIR = {
                X: Math.cos(c*Math.PI/180),
                Y: Math.sin(c*Math.PI/180)
            };
            
            let result = this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, false);
            
            if (result)
                points.push.apply(points, result);
        };
        
        this.DIR = old_dir;
        
        return points;
    };

    this.CastPointRadiallyMultiple = function(targets, degrees) {
        let old_dir = this.DIR,
            points = [];
        
        for (let c = 0; c < 360; c+=degrees) {
            this.DIR = {
                X: Math.cos(c*Math.PI/180),
                Y: Math.sin(c*Math.PI/180)
            };
            
            let results = [];
            
            for (let t = 0; t < targets.length; t++) {
                let result = this.CHECK_INTERSECTION_BOX(targets[t].COLLIDER, true, true);

                if (result)
                    results.push(result);
            }

            let closest = Infinity,
                closestPoint;

            for (let r = 0; r < results.length; r++) {
                let x = results[r].X-this.POS.X,
                    y = results[r].Y-this.POS.Y;

                let d = Math.sqrt(x*x + y*y);

                if (d < closest) {
                    closest = d;
                    closestPoint = results[r];
                }
            }
            
            if (closestPoint != undefined)
                points.push(closestPoint);
        };
        
        this.DIR = old_dir;
        
        return points;
    };

    this.GET_VECTOR = function() {
        return {
            X: this.POS.X,
            Y: this.POS.Y,
            X1: this.POS.X + this.DIR.X,
            Y1: this.POS.Y + this.DIR.Y
        };
    };

    this.CHECK_INTERSECTION_BOX = function(TARGET, GET_POSITIONS, GET_FIRST_POSITION) {
        let LINES = [],
            RESULT = false;

        if (TARGET.SIZE != undefined) {
            let LXT = { X: TARGET.POS.X, Y: TARGET.POS.Y, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y },
                LYL = { X: TARGET.POS.X, Y: TARGET.POS.Y, X1: TARGET.POS.X, Y1: TARGET.POS.Y+TARGET.SIZE.H },
                LXB = { X: TARGET.POS.X, Y: TARGET.POS.Y+TARGET.SIZE.H, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y+TARGET.SIZE.H },
                LYR = { X: TARGET.POS.X+TARGET.SIZE.W, Y: TARGET.POS.Y, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y+TARGET.SIZE.H };
            
            if (this.POS.X < TARGET.POS.X) {
                LINES.push(LYL);
                LYL = undefined;
            } else {
                LINES.push(LYR);
                LYR = undefined;
            }
            
            if (this.POS.Y < TARGET.POS.Y) {
                LINES.push(LXT);
                LXT = undefined;
            } else {
                LINES.push(LXB);
                LXB = undefined;
            }
            
            if (LYL == undefined)
                LINES.push(LYR);
            else if (LYR == undefined)
                LINES.push(LYL);
            
            if (LXB == undefined)
                LINES.push(LXT);
            else if (LXT == undefined)
                LINES.push(LXB);
        } else 
            return RESULT;

        for (let L = 0; L < LINES.length; L++) {
            let LINE = LINES[L];

            let LINE_RESULT = this.CHECK_INTERSECTION_LINE(LINE, GET_POSITIONS);
            
            if (LINE_RESULT) {
                if (GET_POSITIONS && !RESULT)
                    RESULT = [];
                else if (!GET_POSITIONS) {
                    RESULT = true;

                    break;
                }

                if (GET_POSITIONS) 
                    RESULT.push(LINE_RESULT);
            }
        }
        
        if (GET_POSITIONS && RESULT && GET_FIRST_POSITION)
            RESULT = RESULT[0];

        return RESULT;
    };

    this.CHECK_INTERSECTION_LINE = function(LINE, GET_POSITION) {
        let VECTOR = this.GET_VECTOR();
        
        let RESULT = false,
            DEN = (LINE.X-LINE.X1) * (VECTOR.Y-VECTOR.Y1) - (LINE.Y-LINE.Y1) * (VECTOR.X-VECTOR.X1);

        if (DEN === 0)
            return false;

        let T = ((LINE.X-VECTOR.X) * (VECTOR.Y-VECTOR.Y1) - (LINE.Y-VECTOR.Y) * (VECTOR.X-VECTOR.X1)) / DEN,
            U = -((LINE.X-LINE.X1) * (LINE.Y-VECTOR.Y) - (LINE.Y-LINE.Y1) * (LINE.X-VECTOR.X)) / DEN;

        if (T > 0 && T < 1 && U > 0) {
            if (GET_POSITION) {
                RESULT = {
                    X: LINE.X + T * (LINE.X1 - LINE.X),
                    Y: LINE.Y + T * (LINE.Y1 - LINE.Y)
                };

                if (lx.GAME.FOCUS != undefined)
                    RESULT = lx.GAME.TRANSLATE_FROM_FOCUS(RESULT);
            }
            else
                RESULT = true;
        }

        return RESULT;
    };
};

/* Scene Object */

this.Scene = function(callback) {
    this.SAVED_STATE_AVAILABLE = false;
    this.CALLBACK = callback;
    
    /** 
     * Saves the Scene's current state and content.
    */

    this.Save = function() {
        this.BUFFER = lx.GAME.BUFFER;
        this.UI = lx.GAME.UI;
        this.COLLIDERS = lx.GAME.COLLIDERS;
        this.FOCUS = lx.GAME.FOCUS;
        this.CONTROLLER_TARGET = lx.CONTEXT.CONTROLLER.TARGET;
        this.EVENTS = lx.GAME.EVENTS;
        this.LOOPS = lx.GAME.LOOPS;
        this.GO_MOUSE_EVENTS = lx.GAME.GO_MOUSE_EVENTS;
        this.LAYER_DRAW_EVENTS = lx.GAME.LAYER_DRAW_EVENTS;
        
        this.SAVED_STATE_AVAILABLE = true;
    };

    this.Restore = function() {
        if (!this.SAVED_STATE_AVAILABLE) {
            console.log(lx.GAME.LOG.TIMEFORMAT() + 'Scene could not be restored, there is no saved state available.');
            return;
        }
        
        lx.GAME.BUFFER = this.BUFFER;
        lx.GAME.UI = this.UI;
        lx.GAME.COLLIDERS = this.COLLIDERS;
        lx.GAME.FOCUS = this.FOCUS;
        lx.CONTEXT.CONTROLLER.TARGET = this.CONTROLLER_TARGET;
        lx.GAME.EVENTS = this.EVENTS;
        lx.GAME.LOOPS = this.LOOPS;
        lx.GAME.GO_MOUSE_EVENTS = this.GO_MOUSE_EVENTS;
        lx.GAME.LAYER_DRAW_EVENTS = this.LAYER_DRAW_EVENTS;
    };
};

/* Sound Object */

this.Sound = function (src, channel) {
    this.SRC = src;
    this.POS = { 
        X: 0, 
        Y: 0 
    };
    this.PLAY_ID = [];

    //Check channel
    
    if (channel != undefined) 
        this.CHANNEL = channel;
    else 
        this.CHANNEL = 0;
        
    this.Channel = function(channel) {
        if (channel != undefined) 
            this.CHANNEL = channel;
        else 
            return this.CHANNEL;
        
        return this;
    };

    this.Play = function (loops, delay) {
        if (this.PLAY_ID != undefined && 
            lx.GAME.AUDIO.SOUNDS[this.PLAY_ID] != undefined)
            return;
        
        this.PLAY_ID = 
            lx.GAME.AUDIO.ADD(
                this.SRC, 
                this.CHANNEL, 
                delay, 
                loops
            );
        
        return this;
    };

    this.PlaySpatial = function(loops, delay) {
        if (this.PLAY_ID != undefined && 
            lx.GAME.AUDIO.SOUNDS[this.PLAY_ID] != undefined)
            return;
        
        this.PLAY_ID = 
            lx.GAME.AUDIO.ADD_SPATIAL(
                this.POS, 
                this.SRC, 
                this.CHANNEL, 
                delay, 
                loops
            );
        
        return this;
    };

    this.Stop = function() {
        if (this.PLAY_ID != undefined)
            lx.GAME.AUDIO.REMOVE(this.PLAY_ID);  
        
        this.PLAY_ID = undefined;
        
        return this;
    };

    this.Position = function(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };
};

/* Sprite Object */

this.Sprite = function (source, c_x, c_y, c_w, c_h, cb) {
    this.CLIPPED_COLOR_OVERLAYS = {};
    this.ROTATION = 0;
    
    //Check if no clip but a 
    //callback is provided (compact callback)

    if (c_x != undefined && 
        typeof c_x === 'function') {
        cb = c_x;
        c_x = undefined;
    }
    
    //Set clip if specified

    if (c_x != undefined || 
        c_y != undefined || 
        c_w != undefined || 
        c_h != undefined) 
        this.CLIP = {
            X: c_x,
            Y: c_y,
            W: c_w,
            H: c_h
        };

    this.Size = function() {
        if (this.CLIP != undefined) 
            return {
                W: this.CLIP.W,
                H: this.CLIP.H
            };
        else 
            return {
                W: this.IMG.width,
                H: this.IMG.height
            };
    };

    this.Source = function(src) {
        if (src == undefined) {
            if (this.IMG.src == undefined) {
                console.log('SpriteSourceError - Sprite has no source.');
                return;
            }

            return this.IMG.src;
        }
        else {
            //Load image if the source is a string

            if (typeof src === 'string') {
                this.IMG = new Image();
                
                if (cb != undefined) {
                    let S = this;
                    this.IMG.onload = function() {
                        cb(S);
                    };
                }
                
                this.IMG.src = src;
            } 
            
            //Otherwise straight up accept it (for canvas usage)

            else 
                this.IMG = src;
        }
        
        return this;
    };
    
    //Set source

    this.Source(source);

    this.Clip = function(c_x, c_y, c_w, c_h) {
        if (c_x == undefined || 
            c_y == undefined || 
            c_w == undefined || 
            c_h == undefined) 
            return this.CLIP;
        else 
            this.CLIP = {
                X: c_x,
                Y: c_y,
                W: c_w,
                H: c_h
            };
        
        return this;
    };

    this.Rotation = function(angle) {
        if (angle == undefined) 
            return this.ROTATION;
        else 
            this.ROTATION = angle;
        
        return this;
    };

    this.Opacity = function(factor) {
        if (factor == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = factor;
        
        return this;
    };

    this.ShowColorOverlay = function(color, duration) {
        if (this.COLOR_OVERLAY == undefined && 
            color == undefined)
            return this;

        this.SET_COLOR_OVERLAY(color);

        this.SHOW_COLOR_OVERLAY = true;
        this.COLOR_OVERLAY_DURATION = duration;

        return this;
    };

    this.HideColorOverlay = function() {
        this.SHOW_COLOR_OVERLAY = false;

        return this;
    };
    
    this.RENDER = function(POS, SIZE, OPACITY, TARGET) {
        let CANVAS_SAVED = false;

        //Check size and specified drawing target
        
        if (SIZE == undefined) 
            SIZE = this.Size();
        if (TARGET == undefined)
            TARGET = lx.CONTEXT.GRAPHICS;

        //Check for opacity

        if (OPACITY != undefined ||
            this.OPACITY != 1) {
            if (OPACITY == undefined)
                OPACITY = this.OPACITY;
            
            lx.CONTEXT.GRAPHICS.save();
            CANVAS_SAVED = true;

            lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
        }

        //Check for color overlay

        let IMG = this.IMG;
        if (this.SHOW_COLOR_OVERLAY)
            IMG = this.COLOR_OVERLAY;

        //Draw respectively
        
        if (this.CLIP == undefined || this.SHOW_COLOR_OVERLAY) 
            //Full image (or color overlay)

            if (this.ROTATION === 0) 
                TARGET.drawImage(IMG, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                if (!CANVAS_SAVED) {
                    TARGET.save();
                    CANVAS_SAVED = true;
                }
                
                TARGET.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                TARGET.rotate(this.ROTATION);
                TARGET.drawImage(IMG, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        else 
            //Clipped image

            if (this.ROTATION === 0) 
                TARGET.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                if (!CANVAS_SAVED) {
                    TARGET.save();
                    CANVAS_SAVED = true;
                }
                
                TARGET.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                TARGET.rotate(this.ROTATION);
                TARGET.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        
        //Restore canvas if necessary

        if (CANVAS_SAVED)
            TARGET.restore();

        //Handle color overlay duration if needed

        if (TARGET == lx.CONTEXT.GRAPHICS &&
            this.COLOR_OVERLAY_DURATION != undefined)
        {
            this.COLOR_OVERLAY_DURATION--;

            if (this.COLOR_OVERLAY_DURATION <= 0)
                this.HideColorOverlay();
        }
    };

    this.SET_COLOR_OVERLAY = function(COLOR) {
        if (COLOR != undefined) {
            let SAVE_ID = COLOR;

            if (this.CLIP != undefined) {
                let ID = 'C'+COLOR+'X'+this.CLIP.X+'Y'+this.CLIP.Y+'W'+this.CLIP.W+'H'+this.CLIP.H;

                if (this.CLIPPED_COLOR_OVERLAYS[ID] != undefined) {
                    this.COLOR_OVERLAY = this.CLIPPED_COLOR_OVERLAYS[ID];

                    return;
                }
                else
                    SAVE_ID = ID;
            } else {
                if (this.COLOR_OVERLAY != undefined &&
                    this.COLOR_OVERLAY._SAVE_ID === COLOR)
                    return;

                SAVE_ID = COLOR;
            }

            let SIZE = this.Size();

            let COLOR_OVERLAY = document.createElement('canvas');
            
            COLOR_OVERLAY.width = SIZE.W;
            COLOR_OVERLAY.height = SIZE.H;

            let COLOR_OVERLAY_GFX = COLOR_OVERLAY.getContext('2d');

            COLOR_OVERLAY_GFX.fillStyle = COLOR;
            COLOR_OVERLAY_GFX.fillRect(0, 0, SIZE.W, SIZE.H);
            COLOR_OVERLAY_GFX.globalCompositeOperation = 'destination-atop';

            this.RENDER(
                { X: 0, Y: 0 }, 
                SIZE, 
                1, 
                COLOR_OVERLAY_GFX
            );

            if (SAVE_ID != undefined &&
                this.CLIP != undefined)
                this.CLIPPED_COLOR_OVERLAYS[SAVE_ID] = COLOR_OVERLAY;

            COLOR_OVERLAY._SAVE_ID = SAVE_ID;
            this.COLOR_OVERLAY = COLOR_OVERLAY;
        }

        return this;
    };
};

/* Richtext Object */

this.UIRichText = function(text_array, x, y, size, color, font) {
    this.TEXT = text_array;
    this.POS = {
        X: x,
        Y: y
    };
    this.ALIGN = 'left';
    this.LINE_HEIGHT = size/4;

    if (font != undefined) 
        this.FONT = font;
    else 
        this.FONT = 'Verdana';
    if (color != undefined) 
        this.COLOR = color;
    else 
        this.COLOR = 'whitesmoke';
    if (size != undefined) 
        this.SIZE = size;
    else 
        this.SIZE = 14;

    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    this.Hide = function() {
        if (this.UI_ID == undefined) return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };

    this.Size = function(size) {
        if (size == undefined) 
            return this.SIZE;
        else 
            this.SIZE = size;
        
        return this;
    };

    this.LineHeight = function(line_height) {
        if (line_height == undefined) 
            return this.LINE_HEIGHT;
        else 
            this.LINE_HEIGHT = line_height;
        
        return this;
    };

    this.Position = function(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };

    this.Text = function(text_array) {
        if (text_array != undefined) 
            this.TEXT = text_array;  
        else 
            return this.TEXT;
        
        return this;
    };

    this.TextLine = function(line, text) {
        if (line != undefined && text != undefined)
            this.TEXT[line] = text;
        else if (line != undefined) 
            return this.TEXT[line];
        
        return this;
    };

    this.Alignment = function(alignment) {
        if (alignment == undefined) 
            return this.ALIGN;
        else 
            this.ALIGN = alignment;  
        
        return this;
    };

    this.Color = function(color) {
        if (color == undefined) return this.COLOR;
        else this.COLOR = color;
        
        return this;
    };

    this.Font = function(font) {
        if (font == undefined) return this.FONT;
        else this.FONT = font;
        
        return this;
    };

    this.Follows = function(target) {
        if (target != undefined) this.TARGET = target;
        else return this.TARGET;
        
        return this;
    };

    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };
    
    this.RENDER = function() {
        lx.CONTEXT.GRAPHICS.save();
        lx.CONTEXT.GRAPHICS.font = this.SIZE + 'px ' + this.FONT;
        lx.CONTEXT.GRAPHICS.fillStyle = this.COLOR;
        lx.CONTEXT.GRAPHICS.textAlign = this.ALIGN;
        
        for (let i = 0; i < this.TEXT.length; i++) {
            let offset = i*this.LINE_HEIGHT+i*this.SIZE;
            
            if (this.TARGET != undefined) {
                if (lx.GAME.FOCUS != undefined) {
                    let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y });
                    lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], POS.X, POS.Y+offset);
                }
                else lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], this.TARGET.POS.X+this.POS.X, this.TARGET.POS.Y+this.POS.Y+offset);
            }
            else lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], this.POS.X, this.POS.Y+offset);
        }
        
        lx.CONTEXT.GRAPHICS.restore();
    };
    
    this.UPDATE = function() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};

/* Text Object */

this.UIText = function(text, x, y, size, color, font) {
    this.TEXT = text;
    this.POS = {
        X: x,
        Y: y
    };
    this.ALIGN = 'left';

    if (font != undefined) 
        this.FONT = font;
    else 
        this.FONT = 'Verdana';
    if (color != undefined) 
        this.COLOR = color;
    else 
        this.COLOR = 'whitesmoke';
    if (size != undefined) 
        this.SIZE = size;
    else 
        this.SIZE = 14;

    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    this.Hide = function() {
        if (this.UI_ID == undefined) return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };

    this.Size = function(size) {
        if (size == undefined) return this.SIZE;
        else this.SIZE = size;
        
        return this;
    };
    
    this.Position = function(x, y) {
        if (x == undefined || y == undefined) return this.POS;
        else this.POS = {
            X: x,
            Y: y
        };
        
        return this;
    };

    this.Text = function(text) {
        if (text != undefined) 
            this.TEXT = text;  
        else 
            return this.TEXT;
        
        return this;
    };

    this.Alignment = function(alignment) {
        if (alignment == undefined) return this.ALIGN;
        else this.ALIGN = alignment;  
        
        return this;
    };

    this.Color = function(color) {
        if (color == undefined) return this.COLOR;
        else this.COLOR = color;
        
        return this;
    };

    this.Font = function(font) {
        if (font == undefined) return this.FONT;
        else this.FONT = font;
        
        return this;
    };
    
    this.SetShadow = function(color, offset_x, offset_y) {
        this.SHADOW = {
            C: color,
            X: offset_x,
            Y: offset_y
        };
        
        return this;
    };
    
    this.ClearShadow = function() {
        this.SHADOW = undefined;
        
        return this;
    };

    this.Follows = function(target) {
        if (target != undefined) this.TARGET = target;
        else return this.TARGET;
        
        return this;
    };

    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };
    
    this.RENDER = function() {
        lx.CONTEXT.GRAPHICS.save();
        lx.CONTEXT.GRAPHICS.font = this.SIZE + 'px ' + this.FONT;
        lx.CONTEXT.GRAPHICS.fillStyle = this.COLOR;
        lx.CONTEXT.GRAPHICS.textAlign = this.ALIGN;
        
        if (this.SHADOW != undefined) {
            lx.CONTEXT.GRAPHICS.shadowColor = this.SHADOW.C;
            lx.CONTEXT.GRAPHICS.shadowOffsetX = this.SHADOW.X;
            lx.CONTEXT.GRAPHICS.shadowOffsetY = this.SHADOW.Y;
        }
        
        if (this.TARGET != undefined) {
            if (lx.GAME.FOCUS != undefined) {
                let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y });
                lx.CONTEXT.GRAPHICS.fillText(this.TEXT, POS.X, POS.Y);
            }
            else lx.CONTEXT.GRAPHICS.fillText(this.TEXT, this.TARGET.POS.X+this.POS.X, this.TARGET.POS.Y+this.POS.Y);
        }
        else lx.CONTEXT.GRAPHICS.fillText(this.TEXT, this.POS.X, this.POS.Y);
        
        lx.CONTEXT.GRAPHICS.restore();
    };
    
    this.UPDATE = function() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};

/* Texture Object */

this.UITexture = function(sprite, x, y, w, h) {
    this.SPRITE = sprite
    this.POS = {
        X: x,
        Y: y
    };
    if (w != undefined && h != undefined) this.SIZE = {
        W: w,
        H: h
    };

    this.Show = function() {
        if (this.UI_ID != undefined) 
            return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    this.Hide = function() {
        if (this.UI_ID == undefined) 
            return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };

    this.Size = function(width, height) {
        if (width == undefined) 
            return this.SIZE;
        else {
            if (height == undefined)
                height = width;

            this.SIZE = {
                W: width,
                H: height
            };
        }
        
        return this;
    };

    this.Position = function(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };

    this.Follows = function(target) {
        this.TARGET = target;
        
        return this;
    };

    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };
    
    this.RENDER = function() {
        if (this.TARGET != undefined) {
            let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y })

            if (typeof this.SPRITE === 'string')
            {
                lx.CONTEXT.GRAPHICS.save();
                lx.CONTEXT.GRAPHICS.fillStyle = this.SPRITE;
                lx.CONTEXT.GRAPHICS.fillRect(POS.X, POS.Y, this.SIZE.W, this.SIZE.H);
                lx.CONTEXT.GRAPHICS.restore();
            }
            else
                this.SPRITE.RENDER(POS, this.SIZE);
        }
        else {
            if (typeof this.SPRITE === 'string')
            {
                lx.CONTEXT.GRAPHICS.save();
                lx.CONTEXT.GRAPHICS.fillStyle = this.SPRITE;
                lx.CONTEXT.GRAPHICS.fillRect(this.POS.X, this.POS.Y, this.SIZE.W, this.SIZE.H);
                lx.CONTEXT.GRAPHICS.restore();
            }
            else
                this.SPRITE.RENDER(this.POS, this.SIZE);
        }
    };
    
    this.UPDATE = function() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};

};
};

/* Create Lynx2D instance */

const lx = new Lynx2D();