const camera = {
    initialize: (target) => {
        //Create camera gameobject

        let go = new lx.GameObject(undefined, 0, 0, 0, 0);

        //Follow the target and focus
        
        go.Focus().Show();
            
        //Setup camera viewport retrieval

        go.GetViewport = () => {
            //Calculate scaled screen size

            let scaledWidth = lx.GetDimensions().width/lx.GAME.SCALE;
            let scaledHeight =  lx.GetDimensions().height/lx.GAME.SCALE;

            //Create viewport object

            let viewport = {
                X: target.Position().X+target.Size().W/2-scaledWidth/2,
                Y: target.Position().Y+target.Size().H/2-scaledHeight/2,
                W: scaledWidth,
                H: scaledHeight,
                safe: true,
                undersizedX: false,
                undersizedY: false
            };

            //Check for undersized maps

            if (viewport.W > tiled.size.width)
                viewport.undersizedX = true;
            if (viewport.H > tiled.size.height)
                viewport.undersizedY = true;

            //Check viewport bounds

            if (!viewport.undersizedX) {
                if (viewport.X <= tiled.offset.width) {
                    viewport.X = tiled.offset.width;
                    viewport.safe = false;
                }
                else if (viewport.X+viewport.W >= (tiled.offset.width+tiled.size.width)) {
                    viewport.X = (tiled.offset.width+tiled.size.width)-viewport.W;
                    viewport.safe = false;
                }
            }

            if (!viewport.undersizedY) {
                if (viewport.Y <= tiled.offset.height) {
                    viewport.Y = tiled.offset.height;
                    viewport.safe = false;
                }
                else if (viewport.Y+viewport.H >= (tiled.offset.height+tiled.size.height)) {
                    viewport.Y = (tiled.offset.height+tiled.size.height)-viewport.H;
                    viewport.safe = false;
                }
            }

            //Return viewport

            return viewport;
        };

        //Setup gameobject draw loop

        go.Draws(function() {
            //Check if the target is valid

            if (target.BUFFER_ID === -1)
                return;

            //Retrieve the current viewport

            let viewport = go.GetViewport();

            //Set camera position according to viewport
            
            go.Position(
                viewport.X+viewport.W/2,
                viewport.Y+viewport.H/2
            );
        });
    }
};