const camera = {
    initialize: (target) => {
        //Create camera gameobject

        let go = new lx.GameObject(
            undefined,
            -target.Size().W/2,
            -target.Size().H/2,
            1, 1
        );

        //Follow the target and focus
        
        go
            .Follows(target)
            .Focus()
            .Show(0);

        //Setup camera viewport retrieval

        go.GetViewport = () => {
            //Create viewport object

            let viewport = {
                X: target.Position().X-lx.GetDimensions().width/2/lx.GAME.SCALE,
                Y: target.Position().Y-lx.GetDimensions().height/2/lx.GAME.SCALE,
                W: lx.GetDimensions().width/lx.GAME.SCALE,
                H: lx.GetDimensions().height/lx.GAME.SCALE,
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

        //Setup gameobject update loop

        go.Loops(function() {
            //Retrieve the current viewport

            let viewport = this.GetViewport();

            //Check if the viewport is safe
            //and handle accordingly
            
            if (!viewport.safe) {
                if (go.TARGET != undefined)
                    go.StopFollowing()

                go.Position(
                    viewport.X+viewport.W/2+this.OFFSET.X,
                    viewport.Y+viewport.H/2+this.OFFSET.Y
                );
            }
            else if (go.TARGET == undefined) 
                go.Follows(target);
        });
    }
};