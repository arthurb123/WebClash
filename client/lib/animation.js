const animation = {
    animateMoving: function(target)
    {
        //Check if valid
        
        if (target._animation === undefined ||
            target._direction === undefined ||
            target._moving === undefined ||
            target.SPRITE === undefined)
            return;
        
        //Check if moving
        
        if (!target._moving)
        {
            if (target._animation.direction == 'horizontal')
                target.SPRITE.CLIP.X = 0;
            else if (target._animation.direction == 'vertical')
                target.SPRITE.CLIP.Y = 0;
            
            return;
        }
        
        //Check facing direction
        
        if (target._animation.direction == 'horizontal')
            target.SPRITE.CLIP.Y = target._direction*target.SIZE.H;
        else if (target._animation.direction == 'vertical')
            target.SPRITE.CLIP.X = target._direction*target.SIZE.W;
        
        //Evaluate
        
        target._animation.cur++;
        
        if (target._animation.cur >= target._animation.speed)
        {
            //Horizontal animating
            
            if (target._animation.direction == 'horizontal')
            {
                target.SPRITE.CLIP.X+=target.SIZE.W;
                
                if (target.SPRITE.CLIP.X >= target.SPRITE.IMG.width)
                    target.SPRITE.CLIP.X = 0;
            }
            
            //Vertical animating
            
            else if (target._animation.direction == 'vertical')
            {
                target.SPRITE.CLIP.Y+=target.SIZE.H;
                
                if (target.SPRITE.CLIP.Y >= target.SPRITE.IMG.height)
                    target.SPRITE.CLIP.Y = 0;
            }
            
            //Reset
            
            target._animation.cur = 0;
        }
    }
};