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

        if (src == undefined || src === '') {
            this.currentBGM = undefined;
            return;
        }

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

        if (sound.PLAY_ID != undefined)
            sound.PLAY_ID = undefined;

        sound.Play();
    },
    playSoundAtPosition: function(src, pos) {
        let sound = cache.getAudio(src, 1);

        if (sound.PLAY_ID != undefined)
            sound.PLAY_ID = undefined;

        sound.Position(pos.X, pos.Y);
        sound.PlaySpatial();
    },
    setSoundVolume: function(volume, sets) {
        lx.ChannelVolume(1, volume);

        if (sets == undefined || sets)
            this.actualSoundVolume = volume;
    },

    getRandomSound: function(sounds) {
        let result;

        if (sounds != undefined && sounds.length > 0)
            result = sounds[Math.round(Math.random()*(sounds.length-1))].src;

        return result;
    },
    getHitSoundFromTarget: function(target) {
        if (target._sounds != undefined && target._sounds.hitSounds != undefined)
            return this.getRandomSound(target._sounds.hitSounds);
    }
};
