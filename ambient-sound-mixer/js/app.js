import { sounds, defaultPrests } from "./soundData.js";
import { SoundManager } from "./soundManager.js";
import { presetManager } from "./presetManager.js";
import { UI } from "./ui.js";
import { Timer } from "./timer.js";

class AmbientMixer {
    // Initialize dependiencies & default state
    constructor() {
        console.log("Initilaizing state...");
        this.soundManager = new SoundManager();
        this.ui = new UI();
        this.presetManager = new presetManager();
        this.timer = new Timer(
            () => this.onTimerComplete(),
            (minutes, seconds) => this.ui.updateTimerDisplay(minutes, seconds)
        );
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

            // Load cutom presets in UI
            this.loadCustomPresetsUI();

            // Initialize sound states after loading sounds
            sounds.forEach((sound) => {
                this.currentSoundState[sound.id] = 0;

            });

            this.isInitialized = true;
        } catch (error) {
            console.error(`Failed to initialize the application\n`, error);
        }
    }

    // All event listeners:

    setEventListeners() {
        // Handle all clicks with event delegation:
        document.addEventListener("click", async (e) => {
            // Check if a playbutton was clicked
            if (e.target.closest(".play-btn")) {
                const soundID = e.target.closest(".play-btn").dataset.sound;
                // console.log(soundID);
                await this.toggleSound(soundID);
            }

            // Check if delete button was clicked
            if (e.target.closest(".delete-preset")) {
                e.stopPropagation();
                const presetId = e.target.closest(".delete-preset").dataset.preset;
                this.deleteCustomPreset(presetId);
                return;
            }

            // Check if a default preset button was clicked
            if (e.target.closest(".preset-btn")) {
                const presetKey = e.target.closest(".preset-btn").dataset.preset;
                // console.log(presetKey);
                this.loadPreset(presetKey);
            }


            // Check if a default preset button was clicked
            if (e.target.closest(".custom-preset-btn")) {
                const presetKey = e.target.closest(".custom-preset-btn").dataset.preset;
                // console.log(presetKey);
                this.loadPreset(presetKey, true);
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
                // console.log("playPauseButton clicked!");
                this.toggleAllSounds();
            });
        }

        // Handle the reset button
        if (this.ui.resetButton) {
            this.ui.resetButton.addEventListener("click", () => {
                // console.log("reset button clicked!");

                this.resetAll();
            });
        }

        // Save preset button

        const saveButton = document.getElementById("savePreset");
        if (saveButton) {
            saveButton.addEventListener("click", (e) => {
                this.showSavePresetModal();
            });
        }

        // Confirm save preset button

        const confirmSaveButton = document.getElementById("confirmSave");
        if (confirmSaveButton) {
            confirmSaveButton.addEventListener("click", (e) => {
                this.saveCurrentPreset();
            });
        }
        // Cancel save preset button

        const cancelSaveButton = document.getElementById("cancelSave");
        if (cancelSaveButton) {
            cancelSaveButton.addEventListener("click", (e) => {
                this.ui.hideModal();
            });
        }

        // Close modal if backdrop is clicked:
        if (this.ui.modal) {
            this.ui.modal.addEventListener("click", (e) => {
                if (e.target === this.ui.modal) {
                    this.ui.hideModal();
                }
            });
        }

        // Timer select

        const timerSelect = document.getElementById("timerSelect");
        if (timerSelect) {
            timerSelect.addEventListener("change", (e) => {
                const minutes = parseInt(e.target.value);
                console.log("Minutes are: \n", minutes);
                // const minutes = 0.2;
                if (minutes > 0) {
                    this.timer.start(minutes);
                    console.log(`Tmer started for ${minutes} minutes`);
                } else {
                    this.timer.stop();
                }
            });
        }

        // Theme toggle
        if (this.ui.themeToogle) {
            this.ui.themeToogle.addEventListener("click", () => {
                this.ui.toggleTheme();
            })
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

            // Set current sound state 
            this.currentSoundState[soundId] = volume;
            // Sound is off, turn it on
            this.soundManager.setVolume(soundId, volume);
            await this.soundManager.playSound(soundId);
            // @todo update play button
            this.ui.updateSoundPlayButton(soundId, true);

        } else {
            // Sound is on, shut it off!
            this.soundManager.pauseSound(soundId);
            this.currentSoundState[soundId] = 0;
            // @todo Update play button
            this.ui.updateSoundPlayButton(soundId, false);
            // Set current sound state to 0 when paused
            this.currentSoundState[soundId] = 0;
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
        // Set sound volume in state
        this.currentSoundState[soundId] = volume;


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

        // Reset Timer
        this.timer.stop();
        if (this.ui.timerSelect) {
            this.ui.timerSelect.value = "0"
        }
        // Reset active state:
        this.ui.setActivePreset(null);
 
        // Reset sound states
        sounds.forEach((sound) => {
            this.currentSoundState[sound.id] = 0;
        });

        // Reset UI
        this.ui.resetUI();

    }

    // Load a preset config:
    loadPreset(presetKey, custom = false) {
        let preset;

        if (custom) {
            preset = this.presetManager.loadPreset(presetKey);
        } else {

            preset = defaultPrests[presetKey];
        }

        if (!preset) {
            console.error(`Preset ${presetKey} not found`)
            return;
        }
        // First stop all sounds
        this.soundManager.stopAll();
        // reset all volumes to 0
        sounds.forEach((sound) => {
            this.currentSoundState[sound.id] = 0;
            this.ui.updateVolumeDisplay(sound.id, 0);
            this.ui.updateSoundPlayButton(sound.id, false);

        });

        // Apply the preset volumes
        for (const [soundId, volume] of Object.entries(preset.sounds)) {
            // Set volume state
            this.currentSoundState[soundId] = volume;
            this.ui.updateVolumeDisplay(soundId, volume);

            // Calculate effective volume   
            const effectiveVolume = (volume * this.masterVolume) / 100;
            // Get audio element and set value:
            const audio = this.soundManager.audioElements.get(soundId);
            if (audio) {
                audio.volume = effectiveVolume / 100;
                // Play sound
                audio.play();
                this.ui.updateSoundPlayButton(soundId, true);

            }
        }
        // Update main play button and state
        this.soundManager.isplaying = true;
        this.ui.updateMainPlayButton(true);

        // Set active preset

        if (presetKey) {
            this.ui.setActivePreset(presetKey);
        }

    }

    // Show save preset modal
    showSavePresetModal() {
        // check if any sounds are active:
        const hasActiveSounds = Object.values(this.currentSoundState).some(v => v > 0);
        if (!hasActiveSounds) {
            alert("No active sounds for preset");
            return;
        }
        this.ui.showModal();
    }

    // Save the current preset

    saveCurrentPreset() {
        const nameInput = document.getElementById("presetName");
        const name = nameInput.value.trim();
        if (!name) {
            alert("Please enter a preest name");
            return;
        }
        if (this.presetManager.presetNAmeExists()) {
            alert(`A preset with the name ${name} already exists`);
            return;
        }
        const presetId = this.presetManager.savePreset(name, this.currentSoundState);

        // Add custom preset button to UI
        this.ui.addCustomPreset(name, presetId);

        this.ui.hideModal();
        console.log(`Preset "${name}" saved successfully with ID: ${presetId} `);
    }
    // Load custom preset buttons in UI
    loadCustomPresetsUI() {
        const customPresets = this.presetManager.customPresets;
        for (const [presetId, preset] of Object.entries(customPresets)) {
            this.ui.addCustomPreset(preset.name, presetId);

        }

    }

    // Delete custom preset
    deleteCustomPreset(presetId) {
        try {
            
            if (this.presetManager.deletePreset(presetId)) {
                this.ui.removeCustomPreset(presetId);
                console.log(`Preset ${presetId} deleted!`);
            }
        } catch (error) {
            console.error(`Error in deleting preset:  ${error}`);
        }
    }


    // Timer complete callback
    onTimerComplete() {
        try {
            // stop all sounds
            this.soundManager.pauseAll();
            this.ui.updateMainPlayButton(false);

            // Update the individual buttons
            sounds.forEach((sound) => {
                this.ui.updateSoundPlayButton(sound.id, false);
            });
            // Reset timer dropdown

            const timerSelect = document.getElementById("timerSelect");
            if (timerSelect) {
                timerSelect.value = "0";
            }
            // Clear and hide timer display
            if (this.ui.timerDisplay) {
                this.ui.timerDisplay.textContent = "";
                this.ui.timerDisplay.classList.add("hidden");
            }
        } catch (error) {
            console.log(`Error is: ${error}`);
        }
    }
}

// Initialize app when the DOM is ready!
document.addEventListener("DOMContentLoaded", () => {
    const app = new AmbientMixer();
    app.init();

    // Make app available for testing in browser
    window.app = app;
});