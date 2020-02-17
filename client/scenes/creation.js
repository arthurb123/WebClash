let playerCharacters;

const creationScene = new lx.Scene(function() {
    //Character creation page (Lynx2D) code goes here

    //Create tilesheets for all player characters

    let maxHeight = 0,
        scale = (game.isMobile ? properties.mobileRenderScale : properties.computerRenderScale);
    
    for (let p = 0; p < playerCharacters.length; p++) {
        let char = playerCharacters[p];
        char.width  *= scale;
        char.height *= scale;

        //Wait for sprite to load, when done
        //create a tilesheet from the loaded sprite
        //This tilesheet will then be converted to
        //an animation for easier usage

        new lx.Sprite(char.src, function(sprite) {
            if (char.animation.direction === 'horizontal')
                char.sprite = lx.CreateHorizontalTileSheet(sprite, char.width/scale, char.height/scale);
            else
                char.sprite = lx.CreateVerticalTileSheet(sprite, char.width/scale, char.height/scale);

            char.animation = new lx.Animation(char.sprite[0], char.animation.speed);
        });

        //Set max height based on the largest
        //character, this affects the canvas
        //height

        if (char.height > maxHeight)
            maxHeight = char.height;
    }
    //Create current character

    let currentCharacter = 0;

    //Set view innerHTML

    view.dom.innerHTML += 
        '<div id="creation_box" class="box" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding-bottom: 10px;">' +
            '<p class="header">Character Creation</p>' +
            '<canvas class="inner-box" id="creation_canvas" style="margin: 14px 0px 8px 0px;"></canvas><br>' +
        '</div>';

    //Grab canvas and set the height
    //based on the previously calculated
    //max height

    let canvas = document.getElementById('creation_canvas'),
        gfx = canvas.getContext('2d');

    canvas.height = maxHeight+20;
    canvas.width = 200;

    gfx.imageSmoothingEnabled = lx.GAME.SETTINGS.AA;

    //Add characters update loop,
    //this is used for animating
    //the currently selected character

    lx.Loops(function() {
        if (playerCharacters[currentCharacter].animation.UPDATE != undefined)
            playerCharacters[currentCharacter].animation.UPDATE();
    });

    //Add characters drawing loop

    lx.OnLayerDraw(0, function() {
        gfx.clearRect(0, 0, canvas.width, canvas.height);

        let pos = { 
            x: canvas.width/2-playerCharacters[currentCharacter].width/2,
            y: canvas.height/2
        };

        let spacing = 20;

        //Draw characters

        for (let p = currentCharacter; p < playerCharacters.length; p++) {
            let char = playerCharacters[p];

            if (char.animation.GET_CURRENT_FRAME == undefined)
                continue;

            char.animation.GET_CURRENT_FRAME().RENDER({
                X: pos.x,
                Y: pos.y-char.height/2
            }, {
                W: char.width,
                H: char.height
            }, (p === currentCharacter ? 1 : .5), gfx);

            pos.x += char.width + spacing;
        }

        pos = { 
            x: canvas.width/2-playerCharacters[currentCharacter].width/2,
            y: canvas.height/2
        };

        for (let p = currentCharacter-1; p >= 0; p--) {
            let char = playerCharacters[p];

            if (char.animation.GET_CURRENT_FRAME == undefined)
                continue;

            pos.x -= char.width + spacing;

            char.animation.GET_CURRENT_FRAME().RENDER({
                X: pos.x,
                Y: pos.y-char.height/2
            }, {
                W: char.width,
                H: char.height
            }, (p === currentCharacter ? 1 : .5), gfx);
        }
    });

    let creation_box = document.getElementById('creation_box');

    //Add next and previous buttons

    //Previous button

    let button = document.createElement('button');
    button.innerHTML = '◀';
    button.style.fontSize = '12px';

    button.addEventListener('click', function() {
        playerCharacters[currentCharacter].FRAME = 0;

        currentCharacter--;

        if (currentCharacter < 0)
            currentCharacter = playerCharacters.length-1;
    });

    creation_box.appendChild(button);

    //Next button

    button = document.createElement('button');
    button.innerHTML = '▶';
    button.style.fontSize = '12px';

    button.addEventListener('click', function() {
        playerCharacters[currentCharacter].FRAME = 0;

        currentCharacter++;

        if (currentCharacter >= playerCharacters.length)
            currentCharacter = 0;
    });

    creation_box.appendChild(button);

    //Append two breaks

    creation_box.appendChild(document.createElement('br'));
    creation_box.appendChild(document.createElement('br'));

    //Add create button

    button = document.createElement('button');
    button.innerHTML = 'Create Character';

    button.addEventListener('click', function() {
        channel.emit('CLIENT_CREATE_CHARACTER', currentCharacter);
    });

    creation_box.appendChild(button);
});