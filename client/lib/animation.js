const animation = {
    singleAnimations: ['attacking'],
    animate: function(target, statusEffectsMatrix)
    {
        //Check if valid

        if (target             === undefined ||
            target._animations === undefined ||
            target._direction  === undefined ||
            target._moving     === undefined ||
            target.Sprite()    === undefined)
            return;

        //Animate based on state

        if (target._moving) {
            //Check if walking or running

            if (statusEffectsMatrix['movementSpeedFactor'] <= 1) //Walking
                this.setAnimationState(target, 'walking');
            else                                                 //Running
                this.setAnimationState(target, 'running');
        } else                                                   //Idle
            this.setAnimationState(target, 'idle');

        //Increment timer

        target._animations.cur++;

        //Check if timer exceeds state speed

        let anim = target._animations[target._animations.state];
        if (target._animations.cur >= anim.speed) {
            target._animations.cur = 0;
            target._animations.frame++;

            //Check frame exceeding

            if (target._animations.frame >= anim.frames[target._direction].length) {
                target._animations.frame = 0;

                //Check if a single animation, if so
                //force to the idle state

                if (this.singleAnimations.indexOf(target._animations.state) !== -1)
                    this.setAnimationState(target, 'idle', true);
            }
        }

        //Set clip

        let sprite = target.Sprite();
        let frame = anim.frames[target._direction][target._animations.frame];

        sprite.CLIP.X = frame.x;
        sprite.CLIP.Y = frame.y;
    },
    setAnimationState: function(target, state, force) {
        //Check if valid

        if (target             === undefined ||
            target._animations === undefined)
            return;

        //If forced, always overwrite state

        if (force) {
            target._animations.cur = 0;
            target._animations.frame = 0;

            target._animations.state = state;
            return;
        }

        //Idle may never overwrite casting
        //or attacking

        if (state === 'idle' &&
            (target._animations.state === 'casting' ||
             target._animations.state === 'attacking'))
            return;

        //Walking and running may never overwrite
        //attacking

        if ((state === 'walking' || state === 'walking') &&
            target._animations.state === 'attacking')
            return;

        //If state differs or an attack follows up
        //another attack, clear the animation state

        if (target._animations.state !== state ||
            state === 'attacking') {
            target._animations.cur = 0;
            target._animations.frame = 0;
        }

        target._animations.state = state;
    }
};
