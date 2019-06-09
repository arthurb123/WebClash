const UIBox = function(parent, id, x, y, width, height) {
    this.parent = parent;
    this.id = id;

    this.position = { x: x, y: y };
    this.size = { width: width, height: height };

    this.minSize = { width: 1, height: 1 };
    this.maxSize = { width: Infinity, height: Infinity };
    this.resizable = true;

    //Setup box

    this.element = document.createElement('div');
    this.element.id = id;
    this.element.classList.add('box');
    this.element.style.position = 'fixed';
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
    this.element.style.width = (width == undefined ? 'auto' : width + 'px');
    this.element.style.height = (height == undefined ? 'auto' : height + 'px');

    this.startingPercentages = {
        x: x/lx.GetDimensions().width,
        y: y/lx.GetDimensions().height
    };
    this.startingSize = {
        width: width,
        height: height
    };

    //Append box

    view.dom.appendChild(this.element);

    //Get the complete style and setup padding

    let computedStyle = getComputedStyle(this.element);
    this.padding = parseInt(computedStyle.padding);

    //Create box content

    let content = document.createElement('div');
    content.style.width = '100%';
    content.style.height = '100%';

    //Append box content

    this.element.appendChild(content);
    this.content = content;
    
    //Setup event listeners

    let mouseDown = false,
        loopId,
        oldMouse;

    let borderVerticalType,
        borderHorizontalType;

    let box = this;
    this.element.addEventListener('mousedown', function(e) { box.mouseDown(e) });
    this.element.addEventListener('mouseup', function() { box.mouseUp(); });

    //Box functions

    this.reset = function() {
        this.set(
            this.startingPercentages.x, 
            this.startingPercentages.y,
            this.startingSize.width,
            this.startingSize.height
        );
    };

    this.set = function(xp, yp, width, height) {
        this.position.x = xp*lx.GetDimensions().width;
        this.position.y = yp*lx.GetDimensions().height;

        if (this.size.width != undefined)
            this.size.width = width;
        if (this.size.height != undefined)
            this.size.height = height;

        this.reposition();
        this.resize();

        this.save();
    };

    this.setContent = function(innerHTML) {
        this.content.innerHTML = innerHTML;
    };

    this.setResizable = function(resizable) {
        this.resizable = resizable;
    };

    this.setMinimumSize = function(width, height) {
        this.minSize = {
            width: width,
            height: height
        };
    };

    this.setMaximumSize = function(width, height) {
        this.maxSize = {
            width: width,
            height: height
        };
    };

    this.setTextAlign = function(alignment) {
        this.content.style.textAlign = alignment;
    };

    this.mouseDown = function(e) {
        if (!ui.editMode || e.button !== 0)
            return;

        mouseDown = true; 

        oldMouse = { X: e.pageX, Y: e.pageY };

        borderVerticalType = this.checkBorderVertical(oldMouse.X, oldMouse.Y);
        borderHorizontalType = this.checkBorderHorizontal(oldMouse.X, oldMouse.Y);

        loopId = lx.GAME.ADD_LOOPS(this.mouseMove);
    };

    this.mouseUp = function() {
        mouseDown = false; 

        lx.GAME.LOOPS[loopId] = undefined;
    };

    this.mouseMove = function() {
        if (!mouseDown) 
            return;

        let mouse = lx.CONTEXT.CONTROLLER.MOUSE.POS;

        let dx = mouse.X - oldMouse.X,
            dy = mouse.Y - oldMouse.Y;

        //Resize from border type if possible

        if (borderVerticalType !== 'none' ||
            borderHorizontalType !== 'none') {
            if (borderVerticalType === 'top') {
                box.position.y += dy;

                if (box.size.height-dy >= box.minSize.height &&
                    box.size.height-dy <= box.maxSize.height)
                    box.size.height -= dy;
                else
                    mouseDown = false;
            }
            else if (borderVerticalType === 'bottom') 
                if (box.size.height+dy >= box.minSize.height &&
                    box.size.height+dy <= box.maxSize.height)
                    box.size.height += dy;
                else
                    mouseDown = false;

            if (borderHorizontalType === 'left') {
                box.position.x += dx;

                if (box.size.width-dx >= box.minSize.width &&
                    box.size.width-dx <= box.maxSize.width)
                    box.size.width -= dx;
                else
                    mouseDown = false;
            }
            else if (borderHorizontalType === 'right') 
                if (box.size.width+dx >= box.minSize.width &&
                    box.size.width+dx <= box.maxSize.width)
                    box.size.width += dx;
                else
                    mouseDown = false;

            box.resize();
        }

        //Move element if necessary

        if (borderVerticalType === 'none' &&
            borderHorizontalType === 'none') {
            box.position.x += dx;
            box.position.y += dy;
        }

        box.reposition();
        box.save();

        //Set old mouse

        oldMouse = mouse;
    };

    this.reposition = function(width, height) {
        if (width == undefined)
            width = lx.GetDimensions().width;
        if (height == undefined)
            height = lx.GetDimensions().height;

        if (this.position.x < 0) {
            this.position.x = 0;
            mouseDown = false;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
            mouseDown = false;
        }

        if (this.position.x + this.size.width > width) {
            this.position.x = width - this.size.width;
            mouseDown = false;
        }
        if (this.position.y + this.size.height > height) {
            this.position.y = height - this.size.height;
            mouseDown = false;
        }

        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    };

    this.resize = function() {
        this.element.style.width = this.size.width + 'px';
        this.element.style.height = this.size.height + 'px';
    };

    this.save = function(width, height) {
        if (width == undefined)
            width = lx.GetDimensions().width;
        if (height == undefined)
            height = lx.GetDimensions().height;

        ui.setBox(
            this.parent,
            this.position.x/width,
            this.position.y/height,
            this.size.width,
            this.size.height
        );
    };

    this.checkBorderVertical = function(x, y) {
        //Check if resizing is even possible

        if (this.minSize.height === this.maxSize.height ||
            !this.resizable)
            return 'none';

        //Top border

        if (x >= this.position.x && x <= this.position.x+this.size.width+this.padding*2 &&
            y >= this.position.y && y <= this.position.y+this.padding)
            return 'top';

        //Bottom border

        if (x >= this.position.x && x <= this.position.x+this.size.width+this.padding*2 &&
            y >= this.position.y+this.size.height+this.padding && y <= this.position.y+this.size.height+this.padding*2)
            return 'bottom';

        return 'none';
    };

    this.checkBorderHorizontal = function(x, y) {
        //Check if resizing is even possible

        if (this.minSize.width === this.maxSize.width ||
            !this.resizable)
            return 'none';

        //Left border

        if (x >= this.position.x && x <= this.position.x+this.padding &&
            y >= this.position.y && y <= this.position.y+this.size.height+this.padding*2)
            return 'left';

        //Right border

        if (x >= this.position.x+this.size.width+this.padding && x <= this.position.x+this.size.width+this.padding*2 &&
            y >= this.position.y && y <= this.position.y+this.size.height+this.padding*2)
            return 'right';

        return 'none';
    };

    this.checkAnchors = function(width, height) {
        let anchors = {
            right: false,
            bottom: false,
            rightCentered: false,
            bottomCentered: false
        };

        let boxWidth = this.size.width,
            boxHeight = this.size.height;

        if (boxWidth == undefined) 
            boxWidth = this.element.offsetWidth;
        if (boxHeight == undefined)
            boxHeight = this.element.offsetHeight;

        if (this.position.x+boxWidth/2 >= width/2)
            anchors.right = true;

        if (this.position.y+boxHeight/2 >= height/2)
            anchors.bottom = true;

        if (this.position.x+boxWidth/4 <= width/2 && 
            this.position.x+boxWidth*.75 >= width/2)
            anchors.horizontalCentered = true;

        if (this.position.y+boxHeight/4 <= height/2 && 
            this.position.y+boxHeight*.75 >= height/2)
            anchors.verticalCentered = true;

        return anchors;
    };

    //Setup Lynx2D on resize event

    lx.OnResize(function(data) {
        let anchors = box.checkAnchors(data.oldWidth, data.oldHeight);

        let boxWidth = box.size.width,
            boxHeight = box.size.height;

        if (boxWidth == undefined) 
            boxWidth = box.element.offsetWidth;
        if (boxHeight == undefined)
            boxHeight = box.element.offsetHeight;

        if (anchors.right) 
            box.position.x += data.dx;
        if (anchors.bottom) 
            box.position.y += data.dy;
            
        if (anchors.horizontalCentered)
            box.position.x = data.width/2-boxWidth/2;
        if (anchors.verticalCentered)
            box.position.y = data.height/2-boxHeight/2;

        box.reposition(data.width, data.height);
        box.save(data.width, data.height);
    });
};