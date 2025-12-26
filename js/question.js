/***********************
 * 
 * URL PARAMS
 ************************/
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    topic: params.get("topic"),
    subtopic: params.get("subtopic")
  };
}

const { topic, subtopic } = getQueryParams();

/* DEBUG (NOW SAFE) */
console.log("topic:", topic);
console.log("subtopic:", subtopic);
console.log("algebraQuestions:", window.algebraQuestions);
console.log("subtopic data:", window.algebraQuestions?.[subtopic]);


/***********************
 * STORAGE KEY
 ************************/
const STORAGE_KEY = `aprime_${topic}_${subtopic}_progress`;

/***********************
 * QUESTION SOURCE
 ************************/
let questions = [];

if (topic === "algebra" && window.algebraQuestions) {
  if (algebraQuestions[subtopic]) {
    questions = algebraQuestions[subtopic];
  }
}


if (!questions || questions.length === 0) {
  alert("No questions found for this topic.");
}

/***********************
 * STATE
 ************************/
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let hasChecked = false;

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

/***********************
 * PROGRESS
 ************************/
function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    currentQuestionIndex = data.currentQuestionIndex || 0;
  }
}

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ currentQuestionIndex })
  );
}

/***********************
 * LOAD QUESTION
 ************************/
function loadQuestion() {
  const q = questions[currentQuestionIndex];

  selectedOptionIndex = null;
  hasChecked = false;

  optionsContainer.innerHTML = "";
  feedbackBox.classList.add("hidden");
  solutionBox.classList.add("hidden");
  nextArea.classList.add("hidden");
  checkBtn.classList.add("hidden");
  checkBtn.disabled = true;

  questionText.textContent = q.question;

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

  const q = questions[currentQuestionIndex];
  const isCorrect = selectedOptionIndex === q.answer;

  feedbackBox.classList.remove("hidden", "correct", "wrong");

  if (isCorrect) {
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
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    localStorage.removeItem(STORAGE_KEY);
    alert("End of this practice set 👏🏽");
  }
});

/***********************
 * INIT
 ************************/
loadProgress();
loadQuestion();
