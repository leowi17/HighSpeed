document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("biavideo");
  const answerSection = document.getElementById("answerSection");
  const nextButton = document.getElementById("nextButton");
  const correctSound = new Audio("Sounds/correct.mp3");
  const wrongSound = new Audio("Sounds/wrong.mp3");

  function playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  const fullQuizData = [
    { videoSrc: "Videos/bia-1.mp4", answers: ["7.68", "7.13", "6.93"], correctIndex: 1 },
    { videoSrc: "Videos/bia-2.mp4", answers: ["9.50", "10.32", "8.09"], correctIndex: 2 },
    { videoSrc: "Videos/bia-3.mp4", answers: ["8.35", "9.12", "7.99"], correctIndex: 1 },
    { videoSrc: "Videos/bia-4.mp4", answers: ["7.24", "8.34", "7.67"], correctIndex: 0 },
    { videoSrc: "Videos/bia-5.mp4", answers: ["6.19", "5.35", "6.89"], correctIndex: 0 }
  ];

  function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

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

  video.addEventListener("click", () => {
    if (video.paused) video.play();
    else video.pause();
  });

  video.addEventListener("ended", () => {
    answerSection.style.display = "flex";
  });

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

    updateProgress();
    nextButton.style.display = "inline-block";
  };

  window.showNextVideo = function () {
    if (currentQuestion >= totalQuestions) {
      localStorage.setItem("quizScore", correctCount);
      window.location.href = "BiaResult.html";
      return;
    }

    const data = quizData[currentQuestion];
    currentQuestion++;

    const source = video.querySelector("source");
    source.src = data.videoSrc;
    video.load();
    video.play();

    const buttons = document.querySelectorAll("#answerSection button");
    buttons.forEach((btn, index) => {
      btn.textContent = data.answers[index];
      btn.classList.remove("correct", "wrong", "selected");
      btn.disabled = false;

      if (index === data.correctIndex) {
        btn.setAttribute("data-correct", "true");
      } else {
        btn.removeAttribute("data-correct");
      }
    });

    answerSection.style.display = "none";
    nextButton.style.display = "none";
  };

  window.showNextVideo();
});