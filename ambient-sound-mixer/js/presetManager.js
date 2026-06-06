export class presetManager {
  constructor() {
    this.customPresets = this.loadCustomPresets();
  }

  //  Load presets from localStorage:
  loadCustomPresets() {
    const stored = localStorage.getItem("ambientMixerPresets");
    return stored ? JSON.parse(stored) : {};
  }

  // Load custom preset by ID
  loadPreset(presetId) {
    return this.customPresets[presetId] || null;
  }

  // Save custom presets to localStorage:
  saveCustomPresets() {
    localStorage.setItem(
      "ambientMixerPresets",
      JSON.stringify(this.customPresets),
    );
  }

  // Save current mix as preset:
  savePreset(name, soundStates) {
    const presetId = `custom-${Date.now() * Math.floor(Math.random() + 1)}`;
    // Create preset object with only active sounds:
    const preset = {
      name,
      sounds: {},
    };
    for (const [soundId, volume] of Object.entries(soundStates)) {
      if (volume > 0) {
        preset.sounds[soundId] = volume;
      }
    }
    this.customPresets[presetId] = preset;
    this.saveCustomPresets();
    return presetId;
  }

  // check if preset name already exists
  presetNAmeExists(name) {
    return Object.values(this.customPresets).some(
      (preset) => preset.name === name,
    );
  }

  // Delete a custom preset
  deletePreset(presetId) {
    try {
      if (this.customPresets[presetId]) {
        delete this.customPresets[presetId];
        this.saveCustomPresets();
        return true;
      }
      return false;
    } catch (error) {
      console.log(`Error in delete preset fun is: \n ${error}`);
    }
  }
}
