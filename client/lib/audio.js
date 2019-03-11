const audio = {
    //Main Audio

    setMainVolume: function(volume) {
        //Set BGM and sound volume

        this.actualMainVolume = volume;

        this.setBGMVolume(this.actualBGMVolume*volume, false);
        this.setSoundVolume(this.actualSoundVolume*volume, false);
    },

    //BGM

    playBGM: function(src) {
        if (this.currentBGM != undefined)
            this.currentBGM.Stop();

        if (src == undefined || src === '')
          return;

        this.currentBGM = cache.getAudio(src, 0);

        this.currentBGM.Play(0, true);
    },
    setBGMVolume: function(volume, sets) {
        lx.ChannelVolume(0, volume);

        if (sets == undefined || sets)
            this.actualBGMVolume = volume;

        if (this.currentBGM != undefined)
            this.playBGM(this.currentBGM.SRC);
    },

    //Sounds

    playSound: function(src) {
        let sound = cache.getAudio(src, 1);

        sound.Play();
    },
    playSoundAtPosition: function(src, pos) {
        let sound = cache.getAudio(src, 1);

        sound.Position(pos.X, pos.Y);
        sound.PlaySpatial();
    },
    setSoundVolume: function(volume, sets) {
        lx.ChannelVolume(1, volume);

        if (sets == undefined || sets)
            this.actualSoundVolume = volume;
    },

    getHitSoundFromTarget: function(target) {
        let result;

        if (target._sounds != undefined && target._sounds.hitSounds)
            result = target._sounds.hitSounds[Math.round(Math.random()*(target._sounds.hitSounds.length-1))].src;

        return result;
    }
};
