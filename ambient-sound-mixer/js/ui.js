export class UI {
    constructor() {
        this.modal = null;
        this.resetButton = null;
        this.timerSelect = null;
        this.themeToogle = null;
        this.timerDisplay = null;
        this.playPauseButton = null;
        this.masterVolumeValue = null;
        this.masterVolumeSlider = null;
        this.soundCardsContainer = null;
        this.customPresetsContainer = null;
    }
    init() {
        this.modal = document.querySelector("#savePresetModal");
        this.resetButton = document.querySelector("#resetAll");
        this.timerSelect = document.querySelector("#timerSelect");
        this.themeToogle = document.querySelector("#themeToggle");
        this.timerDisplay = document.querySelector("#timerDisplay");
        this.playPauseButton = document.querySelector("#playPauseAll");
        this.masterVolumeValue = document.querySelector("#masterVolumeValue");
        this.masterVolumeSlider = document.querySelector("#masterVolume");
        this.soundCardsContainer = document.querySelector(".grid");
        this.customPresetsContainer = document.querySelector("#customPresets");
    }

    // Create sound card HTML
    createSoundCard(sound) {
        const card = document.createElement("div");
        card.className = "sound-card bg-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden transition-all duration-300";
        card.dataset.sound = sound.id;
        card.innerHTML = `
        <div class="flex flex-col h-full">
    <div class="flex items-center space-x-3">
        <div
            class="sound-icon-wrapper w-12 h-12 rounded-full bg-gradient-to-br ${sound.color} flex items-center justify-center">
            <i class="fas ${sound.icon} text-wihte text-xl">
            </i>
        </div>
        <div>
            <h3 class="font-semibold text-lg">${sound.name}</h3>
            <p class="text-xs opacity-70">${sound.description}</p>
        </div>
    </div>
    <button type="button"
        class="play-btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
        data-sound="${sound.id}">
        <i class="fas fa-play text-sm"></i>
    </button>
    <div class=" flex-1 flex flex-col justify-center">
        <div class="flex items-center space-x-3">
            <i class="fas fa-volume-low opacity-50"></i>
            <input type="range" class="volume-slider flex-1" min="0" max="100" value="0" data-sound="${sound.id}">
            <span class="volume-value text-sm w-8 text-right">0</span>
        </div>
        <div class="volume-bar mt-3">
            <div class="volume-bar-fill" style="width:0%"></div>
        </div>
    </div>
</div>`;
        return card;
    }
    // Render all sound cards
    renderSoundCards(sounds) {
        this.soundCardsContainer.innerHTML = "";
        sounds.forEach((sound) => {
            const card = this.createSoundCard(sound);
            this.soundCardsContainer.appendChild(card);

        });
    }
}