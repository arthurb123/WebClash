const audio = {
    playBGM: function(src) {
        if (this.currentBGM != undefined)
            this.currentBGM.Stop();

        this.currentBGM = cache.getAudio(src, 0);

        //TEMPORARY
        lx.ChannelVolume(0, 0.45);
        //TEMPORARY

        this.currentBGM.Play();
    },
    setBGMVolume: function(volume) {
        lx.ChannelVolume(0, volume);

        if (this.currentBGM != undefined)
            this.playBGM(this.currentBGM.SRC);
    },

    playSound: function(src) {
        let sound = cache.getAudio(src, 1);

        sound.Play();
    },
    playSoundAtPosition: function(src, pos) {
        let sound = cache.getAudio(src, 1);

        sound.Position(pos.X, pos.Y);
        sound.PlaySpatial();
    },

    getHitSoundFromTarget: function(target) {
        let result;

        if (target._sounds != undefined && target._sounds.hitSounds)
            result = target._sounds.hitSounds[Math.round(Math.random()*(target._sounds.hitSounds.length-1))].src;

        return result;
    }
};
