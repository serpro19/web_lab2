// Model
class TimerModel {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.running = false;
        this.paused = false;
        this.interval = null;
    }

    start() {
        this.startTime = new Date();
        this.running = true;
        this.paused = false;
        this.interval = setInterval(() => {
            timerController.updateView();
        }, 1000);
    }

    pause() {
        this.paused = true;
        clearInterval(this.interval);
    }

    resume() {
        this.paused = false;
        this.interval = setInterval(() => {
            timerController.updateView();
        }, 1000);
    }

    stop() {
        this.endTime = new Date();
        this.running = false;
        clearInterval(this.interval);
    }

    getTimeElapsed() {
        if (!this.startTime) return 0;
        if (this.running) {
            return (new Date() - this.startTime) / 1000;
        }
        return (this.endTime - this.startTime) / 1000;
    }

    getSession() {
        return {
            start: this.startTime.toLocaleTimeString(),
            end: this.endTime ? this.endTime.toLocaleTimeString() : 'In Progress',
            duration: this.formatTime(this.getTimeElapsed())
        };
    }

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}

// Controller
class TimerController {
    constructor(model) {
        this.model = model;
    }

    start() {
        this.model.start();
        this.updateView();
    }

    pause() {
        this.model.pause();
        this.updateView();
    }

    resume() {
        this.model.resume();
        this.updateView();
    }

    stop() {
        this.model.stop();
        this.updateView();
        this.saveSession();
    }

    updateView() {
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.textContent = this.model.formatTime(this.model.getTimeElapsed());
    }

    saveSession() {
        const session = this.model.getSession();
        const sessionHistory = document.getElementById('session-history');
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${session.start} - ${session.end} (${session.duration})`;
        sessionHistory.appendChild(li);
    }
}

// View
const timerModel = new TimerModel();
const timerController = new TimerController(timerModel);

document.getElementById('start-btn').addEventListener('click', () => {
    timerController.start();
});

document.getElementById('pause-btn').addEventListener('click', () => {
    timerController.pause();
});

document.getElementById('resume-btn').addEventListener('click', () => {
    timerController.resume();
});

document.getElementById('stop-btn').addEventListener('click', () => {
    timerController.stop();
});

