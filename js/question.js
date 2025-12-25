/***********************
 * SAMPLE QUESTION DATA
 * (Later this will come
 * from js/data/algebra.js)
 ************************/
const questions = [
  {
    id: 1,
    text: "Solve: 2x² − 5x − 3 = 0",
    options: [
      "x = 3 or −½",
      "x = −3 or ½",
      "x = 1 or −3",
      "x = ½ or −3"
    ],
    correctIndex: 3,
    solution:
      "Factorise: (2x + 1)(x − 3) = 0. Therefore x = ½ or x = −3."
  }
];

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
 * LOAD QUESTION
 ************************/
function loadQuestion() {
  const q = questions[currentQuestionIndex];

  // Reset state
  selectedOptionIndex = null;
  hasChecked = false;

  // Reset UI
  optionsContainer.innerHTML = "";
  feedbackBox.classList.add("hidden");
  solutionBox.classList.add("hidden");
  nextArea.classList.add("hidden");
  checkBtn.classList.add("hidden");
  checkBtn.disabled = true;

  // Load question text
  questionText.textContent = q.text;

  // Load options
  q.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = optionText;

    btn.addEventListener("click", () => selectOption(index, btn));

    optionsContainer.appendChild(btn);
  });
}

/***********************
 * OPTION SELECTION
 ************************/
function selectOption(index, button) {
  if (hasChecked) return;

  // Clear previous selection
  document.querySelectorAll(".option").forEach(opt =>
    opt.classList.remove("selected")
  );

  // Set new selection
  selectedOptionIndex = index;
  button.classList.add("selected");

  // Show Check Answer button
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
  const isCorrect = selectedOptionIndex === q.correctIndex;

  // Show feedback
  feedbackBox.classList.remove("hidden");
  feedbackBox.classList.remove("correct", "wrong");

  if (isCorrect) {
    feedbackBox.classList.add("correct");
    feedbackText.textContent = "Correct ✔ Good work. Keep going.";
  } else {
    feedbackBox.classList.add("wrong");
    feedbackText.textContent = "Not quite. Let’s see how to solve it.";

    // Show solution immediately
    solutionBox.classList.remove("hidden");
    solutionText.textContent = q.solution;
  }

  // Lock options
  document.querySelectorAll(".option").forEach(opt =>
    opt.setAttribute("disabled", true)
  );

  // Show next button
  nextArea.classList.remove("hidden");
});

/***********************
 * NEXT QUESTION
 ************************/
nextArea.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    alert("End of questions for now 🙂");
  }
});

/***********************
 * INIT
 ************************/
loadQuestion();
