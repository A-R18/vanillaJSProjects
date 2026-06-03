export class SoundManager {
    constructor() {
        this.audioElements = new Map();
        this.isplaying = false;

    }
    // Load a sound file
    loadSound(soundId, filePath) {
        try {
            const audio = new Audio();
            audio.src = filePath;
            audio.loop = true;
            audio.preload = "metadata";
            // Add sound to audio elements map

            this.audioElements.set(soundId, audio);
            return true;
        } catch (error) {
            console.log(`Failed to Load sound ${soundId}`);
            return false;
        }
    }

    // Play a specific sound

    async playSound(soundId) {
        const audio = this.audioElements.get(soundId);
        if (audio) {
            try {
                await audio.play();
                console.log(`Playing: ${soundId}`);
                return true;
            } catch (error) {
                console.error(`Failed to play ${soundId} \n`,error);
                return false;
            }
        }
    }

    // Pause a specific sound:
     pauseSound (soundId) {
      try {
          const audio = this.audioElements.get(soundId);
        console.log("hit pause fun!");
        if(audio && !audio.paused){
            audio.pause();
            console.log(`paused: ${soundId}`);
        }
      } catch (error) {
        console.error(`Error in pausing sound! \n`, error);
      }
    }

    // Set volume for a specific sound (0-100)

    setVolume(soundId, volume){
        const audio = this.audioElements.get(soundId);
        if(!audio){
            console.error(`Sound ${soundId} not found!`);
            return false
        }
        // Convert 0-100 to 0-1
        audio.volume = volume/100;
        console.log(`Volume for ${soundId}: ${volume}`);
        return true;
    }

}


