const animation = {
    animateMoving: function(target)
    {
        //Check if valid

        if (target._animation === undefined ||
            target._direction === undefined ||
            target._moving === undefined ||
            target.Sprite() === undefined)
            return;

        //Check facing direction

        if (target._animation.direction === 'horizontal')
            target.Sprite().CLIP.Y = target._direction*target.SIZE.H;
        else if (target._animation.direction === 'vertical')
            target.Sprite().CLIP.X = target._direction*target.SIZE.W;

        //Check if a forced frame is active
        //If so handle the forced frame

        if (target._animation.forced) {
            if (target._animation.forcedCur >= this.forceFrame.standard)
                this.forceFrame.reset(target);
            else
                target._animation.forcedCur++;

            return;
        }

        //Check if moving

        if (!target._moving && !target._animation.alwaysAnimate)
        {
            if (target._animation.direction === 'horizontal')
                target.Sprite().CLIP.X = 0;
            else if (target._animation.direction === 'vertical')
                target.Sprite().CLIP.Y = 0;

            return;
        }

        //Evaluate

        target._animation.cur++;

        if (target._animation.cur >= target._animation.speed)
        {
            //Horizontal animating

            if (target._animation.direction === 'horizontal')
            {
                target.Sprite().CLIP.X+=target.SIZE.W;

                if (target.Sprite().CLIP.X >= target.Sprite().IMG.width)
                    target.Sprite().CLIP.X = 0;
            }

            //Vertical animating

            else if (target._animation.direction === 'vertical')
            {
                target.Sprite().CLIP.Y+=target.SIZE.H;

                if (target.Sprite().CLIP.Y >= target.Sprite().IMG.height)
                    target.Sprite().CLIP.Y = 0;
            }

            //Reset

            target._animation.cur = 0;
        }
    },
    forceFrame:
    {
        start: function(target) {
            //Check if target is valid

            if (target == undefined)
                return;

            //If moving and no forced frame exists reset clip

            if (target._moving && !target._animation.forced) {
                if (target._animation.direction === 'horizontal')
                    target.Sprite().CLIP.X = 0;
                else if (target._animation.direction === 'vertical')
                    target.Sprite().CLIP.Y = 0;
            }

            //Set forced frame to true

            target._animation.forced = true;

            //Always use frame 0 if there is not any
            //animation available, otherwise always go
            //for the first frame (frame 1)

            let frame;
            
            if (target._animation.direction === 'horizontal') {
                if (target.Sprite().CLIP.X === 0)
                    frame = 1;
                else 
                    frame = 2;

                target.Sprite().CLIP.X += frame * target.SIZE.W;

                if (target.Sprite().CLIP.X >= target.Sprite().IMG.width)
                        target.Sprite().CLIP.X -= target.Sprite().IMG.width;
            }
            else if (target._animation.direction === 'vertical') {
                if (target.Sprite().CLIP.Y === 0)
                    frame = 1;
                else 
                    frame = 2;
                    
                target.Sprite().CLIP.Y += frame * target.SIZE.H;

                if (target.Sprite().CLIP.Y >= target.Sprite().IMG.height)
                        target.Sprite().CLIP.Y -= target.Sprite().IMG.height;
            }

            //Reset timer

            target._animation.forcedCur = 0;
        },
        reset: function(target) {
            //Set forced frame to false

            target._animation.forced = false;
        },
        standard: 12 //This influences the duration of the forced frame
    },
};
