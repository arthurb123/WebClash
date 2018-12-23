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
            target.SPRITE.CLIP.X = 0;
            
            return;
        }
        
        //Check facing direction
        
        target.SPRITE.CLIP.Y = target._direction*target.SIZE.H;
        
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
            
            target._animation.cur = 0;
        }
    }
};