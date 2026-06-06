export class Timer {
    constructor(onComplete, onTick) {
        this.duration = 0;
        this.remaining = 0;
        this.intervalId = null;
        this.onComplete = onComplete;
        this.onTick = onTick;
        this.isRunning = false;
    }

    // Start timer with duration in minutes
    start(minutes) {
        if (minutes <= 0) {
            this.stop();
            return 
        }
            // Convert to seconds
            this.duration = minutes * 60;
           
            this.remaining = this.duration;
            console.log("Remaining are: ",this.remaining);
            this.isRunning = true;

            // Clear any existing interval
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            // Update display
            this.updateDisplay();
            // Start countdown
            this.intervalId = setInterval(() => {
                this.remaining--;
                this.updateDisplay();
                if (this.remaining <= 0) {
                    this.complete()
                }
            }, 1000);
        

        // Stop timer

    }

    // Stop timer
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;

        }
        this.duration = 0;
        this.remainig = 0;
        this.isRunning = false;
        this.updateDisplay();
    }

    // Timer completed
    complete() {
        this.stop();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    // Update the display

    updateDisplay() {
        const minutes = Math.floor(this.remaining) / 60;
        const seconds = this.remaining % 60;
        if (this.onTick) {
            this.onTick(minutes, seconds);
        }
    }

}