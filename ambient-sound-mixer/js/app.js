import { sounds, defaultPrests } from "./soundData.js";
import { SoundManager } from "./soundManager.js";
import { UI } from "./ui.js";

class AmbientMixer {
    // Initialize dependiencies & default state
    constructor() {
        console.log("Initilaizing state...");
        this.soundManager = new SoundManager();
        this.ui = new UI();
        this.presetManager = null;
        this.timer = null;
        this.currentSoundState = {};
        this.isInitialized = false;
    }

    init() {
        try {
            // Initilaize UI
            this.ui.init();
            // Render sound cards using our saound data
            this.ui.renderSoundCards(sounds);
            //    Load all sounds files
            this.loadAllSounds();

            // Deploy events
            this.setEventListeners();

            this.isInitialized = true;
        } catch (error) {
            console.error(`Failed to initialize the application\n`, error);
        }
    }

    // All event listeners:

    setEventListeners() {
        document.addEventListener("click", async (e) => {
            // Check if a playbutton was clicked
            if (e.target.closest(".play-btn")) {
                const soundID = e.target.closest(".play-btn").dataset.sound;
                // console.log(soundID);
               await this.toggleSound(soundID);
            }

        });

        // Handle volume slider changes:
        document.addEventListener("input", (e)=>{
            
            if(e.target.classList.contains("volume-slider")){
                const soundId = e.target.dataset.sound;
                
                const volume = parseInt(e.target.value)
                this.setsoundVolume(soundId, volume);
                console.log(`sound Id is: ${soundId} \n sound volume is: ${volume}`);
            }
        })


    }

    // Load all sound files:

    loadAllSounds() {
        sounds.forEach((sound) => {
            const audioUrl = `audio/${sound.file}`;
            const success = this.soundManager.loadSound(sound.id, audioUrl);
            if (!success) {
                console.warn(`coundln't load sound: ${sound.name} from ${audioUrl}`);
            }

        });
    }

    // Toggle sounds
    async toggleSound(soundId){
        const audio = this.soundManager.audioElements.get(soundId);
        if(!audio){
            console.error(`Sound ${soundId} not found!`);
            return false;
        }
        if(audio.paused){
            // Get the current slider value
            const card = document.querySelector(`[data-sound="${soundId}"]`);
            const slider = card.querySelector(".volume-slider");
            let volume = parseInt(slider.value);

            // If hte slider is at 0, default to 50%
            if(volume === 0){
                volume=50;
                this.ui.updateVolumeDisplay(soundId, volume);
            }
            // Sound is off, turn it on
            this.soundManager.setVolume(soundId, volume);
            await this.soundManager.playSound(soundId);
            // @todo update play button
            this.ui.updateSoundPlayButton(soundId, true);

        }else{
            // Sound is on, shut it off!
            this.soundManager.pauseSound(soundId);
            // @todo Update play button
            this.ui.updateSoundPlayButton(soundId, false);
        }
    }
    // Set sound volume:
    setsoundVolume(soundId, volume){
        // Update sound volume in manager:
        this.soundManager.setVolume(soundId, volume);
        // Update display
        this.ui.updateVolumeDisplay(soundId, volume);
    }
}

// Initialize app when the DOM is ready!
document.addEventListener("DOMContentLoaded", () => {
    const app = new AmbientMixer();
    app.init();

    // Make app available for testing in browser
    window.app = app;
});