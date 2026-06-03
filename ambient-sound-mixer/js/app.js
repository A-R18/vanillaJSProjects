import { sounds, defaultPrests } from "./soundData.js";
import { SoundManager } from "./soundManager.js";
import {UI} from "./ui.js";

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

           
            this.isInitialized = true;
        } catch (error) {
            console.error(`Failed to initialize the application\n`, error);
        }
    }

    // Load all sound files

    loadAllSounds() {
        sounds.forEach((sound) => {
            const audioUrl = `audio/${sound.file}`;
            const success = this.soundManager.loadSound(sound.id, audioUrl);
            if (!success) {
                console.warn(`coundln't load sound: ${sound.name} from ${audioUrl}`);
            }

        });
    }
}

// Initialize app when the DOM is ready!
document.addEventListener("DOMContentLoaded", () => {
    const app = new AmbientMixer();
    app.init();

    // Make app available for testing in browser
    window.app = app;
})