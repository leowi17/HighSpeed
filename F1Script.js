document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("f1video");
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


  const fullQuizData = [
    { videoSrc: "Videos/pit-1.mp4", answers: ["7.68", "7.20", "6.93"], correctIndex: 1 },
    { videoSrc: "Videos/pit-2.mp4", answers: ["12.54", "11.32", "10.68"], correctIndex: 2 },
    { videoSrc: "Videos/pit-3.mp4", answers: ["1.81", "1.86", "1.98"], correctIndex: 1 },
    { videoSrc: "Videos/pit-4.mp4", answers: ["1.97", "2.34", "2.61"], correctIndex: 0 },
    { videoSrc: "Videos/pit-5.mp4", answers: ["11.20", "9.64", "10.68"], correctIndex: 0 },
    { videoSrc: "Videos/pit-6.mp4", answers: ["22.46", "24.31", "19.05"], correctIndex: 2 },
    { videoSrc: "Videos/pit-7.mp4", answers: ["9.02", "9.86", "10.34"], correctIndex: 0 },
    { videoSrc: "Videos/pit-8.mp4", answers: ["2.56", "2.03", "2.27"], correctIndex: 0 },
    { videoSrc: "Videos/pit-9.mp4", answers: ["4.32", "3.10", "3.78"], correctIndex: 1 },
    /*{ videoSrc: "Videos/pit-10.mp4", answers: ["11.20", "9.64", "10.68"], correctIndex: 0 },*/
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

  // Fortschrittsanzeige
  let progressDisplay = document.createElement("div");
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

  // Antwortbereich & Weiter-Button erst nach Video-Ende zeigen
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
  window.location.href = "F1Result.html"; // neue Seite
  return;
}

    const data = quizData[currentQuestion];
    currentQuestion++;

    // Video laden & abspielen
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

    // Antwortbereich und Weiter-Button verstecken bis Video fertig
    answerSection.style.display = "none";
    nextButton.style.display = "none";
  };

  // Erstes Video laden
  window.showNextVideo();
});