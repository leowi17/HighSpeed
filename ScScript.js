document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("scvideo");
  const answerSection = document.getElementById("answerSection");
  const nextButton = document.getElementById("nextButton");
  const correctSound = new Audio("Sounds/correct.mp3");
  const wrongSound = new Audio("Sounds/wrong.mp3");

  // Funktion zum sauberen Sound-Abspielen
  function playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  // Fragenpool
  const fullQuizData = [
    { videoSrc: "Videos/sc-1.mp4", answers: ["6.23", "5.05", "6.73"], correctIndex: 1 },
    { videoSrc: "Videos/sc-2.mp4", answers: ["4.03", "5.46", "4.88"], correctIndex: 2 },
    { videoSrc: "Videos/sc-3.mp4", answers: ["4.53", "4.75", "5.12"], correctIndex: 1 },
    { videoSrc: "Videos/sc-4.mp4", answers: ["6.38", "7.21", "5.22"], correctIndex: 0 },
    { videoSrc: "Videos/sc-5.mp4", answers: ["6.19", "5.65", "6.73"], correctIndex: 0 },
    { videoSrc: "Videos/sc-6.mp4", answers: ["6.55", "6.89", "6.10"], correctIndex: 2 },
    { videoSrc: "Videos/sc-7.mp4", answers: ["5.11", "4.66", "5.44"], correctIndex: 0 },
  ];

  // Shuffle
  function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Zufällig 5 Fragen ziehen
  const quizData = shuffleArray(fullQuizData).slice(0, 5);
  let currentQuestion = 0;
  let correctCount = 0;
  const totalQuestions = quizData.length;
  localStorage.setItem("quizTotal", totalQuestions);

  // Fortschrittsanzeige unten links
  const progressDisplay = document.createElement("div");
  progressDisplay.id = "progressDisplay";
  progressDisplay.style.position = "fixed";
  progressDisplay.style.left = "10px";
  progressDisplay.style.bottom = "10px";
  progressDisplay.style.color = "#f3f3f4";
  progressDisplay.style.fontFamily = "'Formula1Regular', Arial, sans-serif";
  progressDisplay.style.fontSize = "18px";
  progressDisplay.style.lineHeight = "1.4";
  document.body.appendChild(progressDisplay);

  function updateProgress() {
    progressDisplay.textContent = `${correctCount} / ${totalQuestions}`;
    const progress = (currentQuestion / totalQuestions) * 100;
    const bar = document.getElementById("progressBar");
    if (bar) {
      bar.style.width = `${progress}%`;
    }
  }

  updateProgress();

  // Video toggle play/pause
  video.addEventListener("click", () => {
    if (video.paused) video.play();
    else video.pause();
  });

  // Antwortbereich nach Video-Ende anzeigen
  video.addEventListener("ended", () => {
    answerSection.style.display = "flex";
  });

  // Funktion für Play-Button
  window.playVideo = function () {
    video.play();
  };

  // Antwort-Button Klick
  window.markButton = function (clickedButton) {
    const buttons = document.querySelectorAll("#answerSection button");

    const isCorrect = clickedButton.getAttribute("data-correct") === "true";

    buttons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    clickedButton.classList.add("selected");
    
    if (isCorrect) {
      correctCount++;
      playSound(correctSound);
    } else {
      playSound(wrongSound);
    }

    // Buttons einfärben und deaktivieren
    buttons.forEach((btn) => {
      btn.disabled = true;
      if (btn.getAttribute("data-correct") === "true") {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }
    });

    updateProgress(); // Fortschritt aktualisieren
    nextButton.style.display = "inline-block";
  };

  // Weiter zur nächsten Frage
  window.showNextVideo = function () {
    if (currentQuestion >= totalQuestions) {
      localStorage.setItem("quizScore", correctCount);
      window.location.href = "ScResult.html";
      return;
    }

    const data = quizData[currentQuestion];
    currentQuestion++;

    // Video setzen
    const source = video.querySelector("source");
    source.src = data.videoSrc;
    video.load();
    video.play();

    // Antworten vorbereiten
    const buttons = document.querySelectorAll("#answerSection button");
    buttons.forEach((btn, index) => {
      btn.textContent = data.answers[index];
      btn.classList.remove("correct", "wrong");
      btn.disabled = false;

      if (index === data.correctIndex) {
        btn.setAttribute("data-correct", "true");
      } else {
        btn.removeAttribute("data-correct");
      }
    });

    // UI verstecken
    answerSection.style.display = "none";
    nextButton.style.display = "none";
  };

  // Erstes Video laden
  window.showNextVideo();
});
