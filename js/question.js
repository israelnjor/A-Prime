const algebraFlow = [
  "quadratic",
  "linear",
  "simultaneous",
  "inequalities"
];

/***********************
 * URL PARAMS (MUST BE FIRST)
 ************************/
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    topic: params.get("topic"),
    subtopic: params.get("subtopic")
  };
}

const { topic, subtopic } = getQueryParams();

/***********************
 * DEBUG LOGS
 ************************/
console.log("topic:", topic);
console.log("subtopic:", subtopic);
console.log("algebraQuestions:", window.algebraQuestions);

/***********************
 * STORAGE KEYS
 ************************/
const STORAGE_KEY = `aprime_${topic}_${subtopic}_progress`;

/***********************
 * QUESTION SOURCE
 ************************/
let questions = [];

if (topic === "algebra" && window.algebraQuestions) {
  questions = window.algebraQuestions[subtopic] || [];
}

if (!questions.length) {
  alert("No questions found for this topic.");
  console.error("Missing questions for:", topic, subtopic);
}

/***********************
 * SHUFFLE (RANDOMIZATION)
 ************************/
function shuffleQuestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Shuffle ONCE per session
shuffleQuestions(questions);

/***********************
 * STATE
 ************************/
let currentIndex = 0;
let selectedOptionIndex = null;
let hasChecked = false;
let score = 0;

/***********************
 * DOM ELEMENTS
 ************************/
const questionText = document.querySelector(".question-text");
const optionsContainer = document.querySelector(".options");
const checkBtn = document.querySelector(".primary-btn");
const feedbackBox = document.querySelector(".feedback");
const feedbackText = document.querySelector(".feedback-text");
const solutionBox = document.querySelector(".solution");
const solutionText = document.querySelector(".solution-text");
const nextArea = document.querySelector(".next-area");
const endScreen = document.getElementById("endScreen");
const retryBtn = document.getElementById("retryBtn");
const continueBtn = document.getElementById("continueBtn");
const backBtn = document.getElementById("backBtn");


const questionCountEl = document.getElementById("questionCount");
const progressBarEl = document.getElementById("progressBar");

/***********************
 * PROGRESS STORAGE
 ************************/
function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    currentIndex = data.currentIndex || 0;
    score = data.score || 0;
  }
}

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentIndex,
      score
    })
  );
}

/***********************
 * LOAD QUESTION
 ************************/
function loadQuestion() {
  const q = questions[currentIndex];
  if (!q) return;

  selectedOptionIndex = null;
  hasChecked = false;

  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";

  feedbackBox.classList.add("hidden");
  solutionBox.classList.add("hidden");
  nextArea.classList.add("hidden");
  checkBtn.classList.add("hidden");
  checkBtn.disabled = true;

  // Question counter
  questionCountEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;

  // Progress bar
  const progress = ((currentIndex + 1) / questions.length) * 100;
  progressBarEl.style.width = `${progress}%`;

  q.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;

    btn.addEventListener("click", () => selectOption(index, btn));
    optionsContainer.appendChild(btn);
  });
}

/***********************
 * OPTION SELECTION
 ************************/
function selectOption(index, button) {
  if (hasChecked) return;

  document.querySelectorAll(".option")
    .forEach(opt => opt.classList.remove("selected"));

  selectedOptionIndex = index;
  button.classList.add("selected");

  checkBtn.classList.remove("hidden");
  checkBtn.disabled = false;
}

/***********************
 * CHECK ANSWER
 ************************/
checkBtn.addEventListener("click", () => {
  if (selectedOptionIndex === null) return;

  hasChecked = true;

  const q = questions[currentIndex];
  const isCorrect = selectedOptionIndex === q.answer;

  feedbackBox.classList.remove("hidden", "correct", "wrong");

  if (isCorrect) {
    score++;
    feedbackBox.classList.add("correct");
    feedbackText.textContent = "Correct ✔ Keep going.";
  } else {
    feedbackBox.classList.add("wrong");
    feedbackText.textContent = "Not quite. Let’s see how to solve it.";
    solutionBox.classList.remove("hidden");
    solutionText.textContent = q.solution;
  }

  document.querySelectorAll(".option")
    .forEach(opt => opt.disabled = true);

  nextArea.classList.remove("hidden");
  saveProgress();
});

/***********************
 * NEXT QUESTION
 ************************/
nextArea.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    localStorage.removeItem(STORAGE_KEY);
    showEndScreen();
  }
});

// Helper: Get next subtopic
function getNextSubtopic() {
  const index = algebraFlow.indexOf(subtopic);
  return algebraFlow[index + 1] || null;
}

function showEndScreen() {
  document.querySelector(".question-card").classList.add("hidden");
  optionsContainer.classList.add("hidden");
  document.querySelector(".action-area").classList.add("hidden");
  feedbackBox.classList.add("hidden");
  solutionBox.classList.add("hidden");
  nextArea.classList.add("hidden");

  endScreen.classList.remove("hidden");
}

retryBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

continueBtn.addEventListener("click", () => {
  const next = getNextSubtopic();
  if (next) {
    window.location.href = `question.html?topic=algebra&subtopic=${next}`;
  } else {
    window.location.href = "algebra.html";
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "algebra.html";
});


/***********************
 * INIT
 ************************/
loadProgress();
loadQuestion();
