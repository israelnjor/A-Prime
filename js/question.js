/***********************
 * ALGEBRA FLOW
 ************************/
const algebraFlow = [
 "linear",
  "quadratic",
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
 * STORAGE KEYS
 ************************/
const STORAGE_KEY = `aprime_${topic}_${subtopic}_progress`;
const MASTERY_KEY = `aprime_mastery_${topic}_${subtopic}`;

/***********************
 * QUESTION SOURCE
 ************************/
let questions = [];

if (topic === "algebra" && window.algebraQuestions) {
  questions = window.algebraQuestions[subtopic] || [];
}

/***********************
 * SHUFFLE QUESTIONS (ONCE)
 ************************/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(questions);

/***********************
 * STATE
 ************************/
let currentIndex = 0;
let selectedOptionIndex = null;
let hasChecked = false;

let score = 0;
let attempted = 0;

let mastery = {
  attempted: 0,
  correct: 0
};

/***********************
 * DOM ELEMENTS
 ************************/
const questionText = document.querySelector(".question-text");
const optionsContainer = document.querySelector(".options");
const actionBtn = document.querySelector(".primary-btn");

const feedbackBox = document.querySelector(".feedback");
const feedbackText = document.querySelector(".feedback-text");
const solutionBox = document.querySelector(".solution");
const solutionText = document.querySelector(".solution-text");

const questionCountEl = document.getElementById("questionCount");
const progressBarEl = document.getElementById("progressBar");

const endScreen = document.getElementById("endScreen");
const endMessage = document.querySelector(".end-message");

const retryBtn = document.getElementById("retryBtn");
const continueBtn = document.getElementById("continueBtn");
const backBtn = document.getElementById("backBtn");


const whatsappBtn = document.getElementById("whatsappReport");

function updateWhatsAppLink() {
  if (!whatsappBtn) return;

  const q = questions[currentIndex];
  if (!q) return;

  const message = `
Hi Israel 👋🏽
I found a possible error with this question:

Topic: ${topic}
Subtopic: ${formatSubtopic(subtopic)}
Question: ${q.question}

Please, kindly check it🙏🏽
  `.trim();

  const encodedMessage = encodeURIComponent(message);

  whatsappBtn.href = `https://wa.me/233539032948?text=${encodedMessage}`;
}

/***********************
 * LOAD / SAVE PROGRESS
 ************************/
function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    currentIndex = data.currentIndex || 0;
    score = data.score || 0;
    attempted = data.attempted || 0;
  }
}

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ currentIndex, score, attempted })
  );
}

/***********************
 * LOAD / SAVE MASTERY
 ************************/
function loadMastery() {
  const saved = localStorage.getItem(MASTERY_KEY);
  if (saved) mastery = JSON.parse(saved);
}

function saveMastery() {
  localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery));
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

  actionBtn.textContent = "Check answer";
  actionBtn.disabled = true;
  actionBtn.classList.add("hidden");

  questionCountEl.textContent =
    `Question ${currentIndex + 1} of ${questions.length}`;

  progressBarEl.style.width =
    `${((currentIndex + 1) / questions.length) * 100}%`;

  q.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => selectOption(index, btn));
    optionsContainer.appendChild(btn);
    updateWhatsAppLink();

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

  actionBtn.classList.remove("hidden");
  actionBtn.disabled = false;
}

/***********************
 * SMART BUTTON
 ************************/
actionBtn.addEventListener("click", () => {
  if (!hasChecked) {
    checkAnswer();
  } else {
    goNext();
  }
});

/***********************
 * CHECK ANSWER
 ************************/
function checkAnswer() {
  if (selectedOptionIndex === null) return;

  hasChecked = true;
  attempted++;
  mastery.attempted++;

  const q = questions[currentIndex];
  const isCorrect = selectedOptionIndex === q.answer;

  feedbackBox.classList.remove("hidden", "correct", "wrong");

  if (isCorrect) {
    score++;
    mastery.correct++;
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

  actionBtn.textContent = "Continue →";

  saveProgress();
  saveMastery();
}

/***********************
 * NEXT QUESTION
 ************************/
function goNext() {
  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    localStorage.removeItem(STORAGE_KEY);
    showEndScreen();
  }
}

/***********************
 * HELPERS
 ************************/
function getNextSubtopic() {
  const index = algebraFlow.indexOf(subtopic);
  return algebraFlow[index + 1] || null;
}

function hasQuestions(sub) {
  return (
    window.algebraQuestions &&
    window.algebraQuestions[sub] &&
    window.algebraQuestions[sub].length > 0
  );
}

function formatSubtopic(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
const reportToggle = document.getElementById("reportToggle");
const reportBox = document.getElementById("reportBox");
const closeReport = document.getElementById("closeReport");

reportToggle.addEventListener("click", () => {
  reportBox.classList.toggle("hidden");
});

closeReport.addEventListener("click", () => {
  reportBox.classList.add("hidden");
});

/***********************
 * END SCREEN
 ************************/
function showEndScreen() {
  document.querySelector(".question-card").classList.add("hidden");
  optionsContainer.classList.add("hidden");
  document.querySelector(".action-area").classList.add("hidden");
  feedbackBox.classList.add("hidden");
  solutionBox.classList.add("hidden");

  const sessionPercent =
    Math.round((score / questions.length) * 100);

  const masteryPercent = mastery.attempted
    ? Math.round((mastery.correct / mastery.attempted) * 100)
    : 0;

  const nextSubtopic = getNextSubtopic();
  const nextExists = nextSubtopic && hasQuestions(nextSubtopic);

//   let message = `Well done 👏  
// You have successfully completed this set of questions
// You scored ${score} out of ${questions.length} (${sessionPercent}%).
// Your mastery so far is ${masteryPercent}%.`;

//   if (nextExists) {
//     message += `

// Next up: ${formatSubtopic(nextSubtopic)}.
// Take a breather, then continue when ready 💪🏽`;
//   } else {
//     message += `

// New questions are coming very soon 🔥  
// Next release: ${nextSubtopic ? formatSubtopic(nextSubtopic) : "New topic"}

// While you wait, this is a great chance to revisit earlier questions
// and push all your topics to 100% mastery 💯`;
//   }

endMessage.innerHTML = `
  <h3 style="margin-bottom:8px;">Well done 👏</h3>

  <p style="margin-bottom:12px;">
    You should be proud of yourself for finishing this set.
  </p>

  <p style="margin-bottom:12px;">
    You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>
    (${sessionPercent}%).<br/>
    Mastery so far: <strong>${masteryPercent}%</strong>
  </p>

  ${
    nextExists
      ? `
        <div style="margin-top:16px;">
          <p><strong>Next up:</strong> ${formatSubtopic(nextSubtopic)}</p>
          <p style="opacity:0.75;">Take a breather, then continue when ready 💪🏽</p>
        </div>
      `
      : `
        <div style="margin-top:16px;">
          <p><strong>New questions are coming very soon 🔥</strong></p>
          <p>
            Next release:
            <strong>${nextSubtopic ? formatSubtopic(nextSubtopic) : "New topic"}</strong>
          </p>
          <p style="opacity:0.75; margin-top:8px;">
            While you wait, revisit earlier questions and push all topics
            to <strong>100% mastery</strong> 💯
          </p>
        </div>
      `
  }
`;
  endScreen.classList.remove("hidden");

  // BUTTON VISIBILITY LOGIC
  if (nextExists) {
    continueBtn.classList.remove("hidden");
    continueBtn.disabled = false;
  } else {
    continueBtn.classList.add("hidden");
  }

  backBtn.classList.remove("hidden");
}

/***********************
 * END SCREEN BUTTONS
 ************************/
retryBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

continueBtn.addEventListener("click", () => {
  const next = getNextSubtopic();
  if (next) {
    window.location.href =
      `question.html?topic=algebra&subtopic=${next}`;
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
loadMastery();
loadQuestion();
