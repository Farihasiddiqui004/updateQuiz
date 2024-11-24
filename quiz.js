// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgkv36lm2z84j7VkJ1f1HBhoFKTw1grJQ",
    authDomain: "fir-project-1f34e.firebaseapp.com",
    projectId: "fir-project-1f34e",
    storageBucket: "fir-project-1f34e.firebasestorage.app",
    messagingSenderId: "80758509770",
    appId: "1:80758509770:web:dde625c66806260767e433",
    measurementId: "G-17FRFKYJZG"
};

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Questions Array
var questions = [
    {
        question: "What is the correct syntax to declare a variable in JavaScript?",
        opt1: "var variableName;",
        opt2: "let variableName;",
        opt3: "const variableName;",
        opt4: "All of the above",
        ans: "All of the above"
    },
    {
        question: "Which of the following is used to create an object in JavaScript?",
        opt1: "{}",
        opt2: "[]",
        opt3: "()",
        opt4: "< >",
        ans: "{}"
    },
    {
        question: "Which method is used to parse a string to an integer in JavaScript?",
        opt1: "parseInt()",
        opt2: "parseInteger()",
        opt3: "parseNumber()",
        opt4: "parseFloat()",
        ans: "parseInt()"
    },
    {
        question: "What will be the output of the following code?</br> console.log(1 + '1');",
        opt1: "2",
        opt2: "NaN",
        opt3: "11",
        opt4: "TypeError",
        ans: "11"
    }
    // Add more questions if needed...
];

var index = 0; // Current question index
var result = 0; // Score counter

// Render Questions
function renderQues() {
    var container = document.getElementById("container");
    var option = document.getElementsByName("option");

    // Calculate previous question's result
    for (var i = 0; i < option.length; i++) {
        if (option[i].checked) {
            if (questions[index - 1]?.ans === option[i].value) {
                result++;
            }
        }
    }

    // If no more questions, calculate result
    if (!questions[index]) {
        calculateResult();
        document.getElementById("result-container").style.display = "block";
        container.style.display = "none";
        return;
    }

    // Display question and options
    container.innerHTML = `
        <p class="question">${index + 1}. ${questions[index].question}</p><hr/>
        <div class="options">
            <label><input type="radio" name="option" value="${questions[index].opt1}"> ${questions[index].opt1}</label>
        </div>
        <div class="options">
            <label><input type="radio" name="option" value="${questions[index].opt2}"> ${questions[index].opt2}</label>
        </div>
        <div class="options">
            <label><input type="radio" name="option" value="${questions[index].opt3}"> ${questions[index].opt3}</label>
        </div>
        <div class="options">
            <label><input type="radio" name="option" value="${questions[index].opt4}"> ${questions[index].opt4}</label>
        </div>
        <button id="prev" class="m-2 btn btn-primary" onclick="previousQuestion()">Previous</button>
        <button id="next" class="m-2 btn btn-success" onclick="nextQuestion()">Next</button>
    `;

    // Disable Next button initially
    var nextButton = document.getElementById("next");
    nextButton.disabled = true;

    // Enable Next button when an option is selected
    var options = document.getElementsByName("option");
    for (var i = 0; i < options.length; i++) {
        options[i].addEventListener("change", function () {
            nextButton.disabled = false;
        });
    }

    // Update button text and states
    var prevButton = document.getElementById("prev");
    prevButton.disabled = index === 0;
    if (index === questions.length - 1) {
        nextButton.innerHTML = "Submit";
        nextButton.classList.add("btn-danger");
    }
}

// Calculate Result
function calculateResult() {
    var score = document.getElementById("score");
    var percentage = ((result / questions.length) * 100).toFixed(2);
    var getData = localStorage.getItem("userData");
    var parseData = JSON.parse(getData);

    // Save the result to Firebase
    const userId = encodeURIComponent(parseData.email);
    const resultRef = ref(db, `quizResults/${userId}`);
    set(resultRef, { name: parseData.name, score: result, percentage })
        .then(() => console.log("Result saved to Firebase"))
        .catch((error) => console.error("Error saving result:", error));

    // Display result feedback
    if (percentage >= 70) {
        score.innerHTML = `Congratulations, ${parseData.name}! You passed the test.<br>
        You answered ${result} out of ${questions.length} questions correctly.<br>
        Your score is ${percentage}%.`;
    } else {
        score.innerHTML = `Sorry, ${parseData.name}. You failed the test.<br>
        You answered ${result} out of ${questions.length} questions correctly.<br>
        Your score is ${percentage}%.`;
        score.style.color = "#dc3545";
    }
}

// Save Quiz Answers to Firebase
function saveQuizAnswers(answers) {
    try {
        const userId = encodeURIComponent(JSON.parse(localStorage.getItem("userData")).email);
        const answersRef = ref(db, `quizAnswers/${userId}`);
        const newAnswerRef = push(answersRef);
        set(newAnswerRef, answers)
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Answers Saved to Firebase!",
                    timer: 1500,
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error Saving Answers",
                    text: error.message,
                });
            });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Unexpected Error",
            text: error.message,
        });
    }
}

// Navigate to Next Question
function nextQuestion() {
    if (!document.querySelector('input[name="option"]:checked')) {
        Swal.fire({
            icon: "warning",
            title: "Please select an answer before proceeding!",
            timer: 1500,
        });
        return;
    }
    index++;
    renderQues();
}

// Navigate to Previous Question
function previousQuestion() {
    if (index > 0) {
        index--;
        renderQues();
    }
}

// Initialize Quiz
renderQues();
