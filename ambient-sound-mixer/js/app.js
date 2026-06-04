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
        this.masterVolume = 100;
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
        document.addEventListener("input", (e) => {

            if (e.target.classList.contains("volume-slider")) {
                const soundId = e.target.dataset.sound;

                const volume = parseInt(e.target.value)
                this.setsoundVolume(soundId, volume);
                // console.log(`sound Id is: ${soundId} \n sound volume is: ${volume}`);
            }
        });

        // Handle master volume slider
        const masterVolumeSlider = document.getElementById("masterVolume"); 
        if (masterVolumeSlider) {
            masterVolumeSlider.addEventListener("input", (e) => {
                const volume = parseInt(e.target.value);
                this.setMasterVolume(volume);
            });
        }

        // Handle master play/pause button:
        if (this.ui.playPauseButton) {
            this.ui.playPauseButton.addEventListener("click", () => {
                console.log("playPauseButton clicked!");
                this.toggleAllSounds();
            });
        }

        // Handle the reset button
        if (this.ui.resetButton) {
            this.ui.resetButton.addEventListener("click", () => {
                console.log("reset button clicked!");

                this.resetAll();
            });
        }

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
    async toggleSound(soundId) {
        const audio = this.soundManager.audioElements.get(soundId);
        if (!audio) {
            console.error(`Sound ${soundId} not found!`);
            return false;
        }
        if (audio.paused) {
            // Get the current slider value
            const card = document.querySelector(`[data-sound="${soundId}"]`);
            const slider = card.querySelector(".volume-slider");
            let volume = parseInt(slider.value);

            // If the slider is at 0, default to 50%
            if (volume === 0) {
                volume = 50;
                this.ui.updateVolumeDisplay(soundId, volume);
            }
            // Sound is off, turn it on
            this.soundManager.setVolume(soundId, volume);
            await this.soundManager.playSound(soundId);
            // @todo update play button
            this.ui.updateSoundPlayButton(soundId, true);

        } else {
            // Sound is on, shut it off!
            this.soundManager.pauseSound(soundId);
            // @todo Update play button
            this.ui.updateSoundPlayButton(soundId, false);
        }
        // Update main play button state
        this.updateMainPlayButtonState();
    }

    // Toggle all sounds 
    toggleAllSounds() {

        if (this.soundManager.isplaying) {
            // Toggle sounds off
            this.soundManager.pauseAll();
            this.ui.updateMainPlayButton(false);
            sounds.forEach((sound) => {
                this.ui.updateSoundPlayButton(sound.id, false);
            });
        } else {
            // Toggle sounds on
            for (const [soundId, audio] of this.soundManager.audioElements) {
                const card = document.querySelector(`[data-sound=${soundId}]`);
                const slider = card?.querySelector(".volume-slider");

                if (slider) {
                    let volume = parseInt(slider.value);
                    if (volume === 0) {
                        volume = 50;
                        slider.value = 50
                        this.ui.updateVolumeDisplay(soundId, 50);
                    }

                    this.currentSoundState[soundId] = volume;
                    const effectiveVolume = (volume * this.masterVolume) / 100;
                    audio.volume = effectiveVolume / 100;
                    this.ui.updateSoundPlayButton(soundId, true);
                }
            }
            // Play all sounds:
            this.soundManager.playAll();
            this.ui.updateMainPlayButton(true);
        }
    }


    // Set sound volume:
    setsoundVolume(soundId, volume) {
        //    Calculate effective volume with master volume
        const effectiveVolume = (volume * this.masterVolume) / 100;
        // Update the sond volume  with scaled volume
        const audio = this.soundManager.audioElements.get(soundId);
        if (audio) {
            audio.volume = effectiveVolume / 100;
        }

        // Update display
        this.ui.updateVolumeDisplay(soundId, volume);


        // Sync sounds
        this.updateMainPlayButtonState();
    }
    // Set master volume:
    setMasterVolume(volume) {
        this.masterVolume = volume;

        // Update the display:
        const masterVolumeValue = document.getElementById("masterVolumeValue");
        if (masterVolumeValue) {
            masterVolumeValue.textContent = `${volume}%`;
        }
        // Apply master volume to all currelty playing sounds

        this.applyMasterVolumeToAll();

    }
    // Apply master volume to all playing sounds
    applyMasterVolumeToAll() {
        for (const [soundId, audio] of this.soundManager.audioElements) {
            if (!audio.paused) {
                const card = document.querySelector(`[data-sound="${soundId}"]`);
                const slider = card?.querySelector(".volume-slider");
                if (slider) {
                    const individualVolume = parseInt(slider.value);
                    // Calculate effective volume (individual * master / 100)
                    const effectiveVolume = (individualVolume * this.masterVolume) / 100;

                    // Apply to the actual audio element   
                    audio.volume = effectiveVolume / 100;
                }
            }
        }
    }

    // Update main play button based on individual sounds:
    updateMainPlayButtonState() {
        // Check if any sounds are playing:
        let anySoundsPlaying = false;
        for (const [soundId, audio] of this.soundManager.audioElements) {
            if (!audio.paused) {
                anySoundsPlaying = true;
                break;
            }

        }
        // Update the main button and internal state 
        this.soundManager.isplaying = anySoundsPlaying;
        this.ui.updateMainPlayButton(anySoundsPlaying);

    }

    // Rest everything to default state:
    resetAll() {
        // Stop all sounds
        this.soundManager.stopAll();

        // Reset master volume
        this.masterVolume = 100;

        // Reset UI
        this.ui.resetUI();
        console.log("All sounds and settings reset");
    }

}

// Initialize app when the DOM is ready!
document.addEventListener("DOMContentLoaded", () => {
    const app = new AmbientMixer();
    app.init();

    // Make app available for testing in browser
    window.app = app;
});