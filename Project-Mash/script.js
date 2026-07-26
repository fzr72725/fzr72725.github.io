const playButtons = document.querySelectorAll(".track-play");
let activeAudio = null;
let activeButton = null;

function resetButton(button) {
    if (!button) return;
    button.textContent = "▶";
    button.classList.remove("is-playing");
    button.setAttribute("aria-label", button.getAttribute("aria-label").replace(/^Pause/, "Play"));
}

playButtons.forEach((button) => {
    const audio = new Audio(button.dataset.audioSrc);
    audio.preload = "none";

    audio.addEventListener("ended", () => {
        resetButton(button);
        if (activeAudio === audio) {
            activeAudio = null;
            activeButton = null;
        }
    });

    audio.addEventListener("error", () => {
        resetButton(button);
        button.classList.add("has-error");
        button.setAttribute("aria-label", "Audio unavailable");
    });

    button.addEventListener("click", () => {
        button.classList.remove("has-error");
        if (activeAudio === audio && !audio.paused) {
            audio.pause();
            resetButton(button);
            activeAudio = null;
            activeButton = null;
            return;
        }

        if (activeAudio) {
            activeAudio.pause();
            resetButton(activeButton);
        }

        audio.play().then(() => {
            activeAudio = audio;
            activeButton = button;
            button.textContent = "■";
            button.classList.add("is-playing");
            button.setAttribute("aria-label", button.getAttribute("aria-label").replace(/^Play/, "Pause"));
        }).catch(() => {
            resetButton(button);
            button.classList.add("has-error");
            button.setAttribute("aria-label", "Audio unavailable");
        });
    });
});
