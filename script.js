const subjectInput = document.getElementById("subject");
const correctInput = document.getElementById("correct");
const wrongInput = document.getElementById("wrong");
const unansweredInput = document.getElementById("unanswered");

const addTestBtn = document.getElementById("addTestBtn");

const totalTestsEl = document.getElementById("totalTests");
const avgAccuracyEl = document.getElementById("avgAccuracy");
const negativeMarksEl = document.getElementById("negativeMarks");

const historyList = document.getElementById("historyList");

let tests = JSON.parse(localStorage.getItem("mockTests")) || [];


const ctx = document.getElementById("performanceChart");

const performanceChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Accuracy %",
            data: [],
            borderWidth: 3,
            tension: 0.3
        }]
    },
    options: {
        responsive: true
    }
});


// Load existing data
window.onload = () => {
    tests.forEach(test => {
        addHistory(test);
    });

    updateDashboard();
};


// Add test
addTestBtn.addEventListener("click", () => {

    const subject = subjectInput.value.trim();

    const correct = Number(correctInput.value);

    const wrong = Number(wrongInput.value);

    const unanswered = Number(unansweredInput.value);

    if (!subject) {
        alert("Enter subject");
        return;
    }

    const totalQuestions = correct + wrong + unanswered;

    const accuracy = totalQuestions === 0
        ? 0
        : ((correct / totalQuestions) * 100).toFixed(2);

    const negativeMarks = (wrong * 0.25).toFixed(2);

    const test = {
        subject,
        correct,
        wrong,
        unanswered,
        accuracy,
        negativeMarks,
        date: new Date().toLocaleDateString()
    };

    tests.push(test);

    localStorage.setItem("mockTests", JSON.stringify(tests));

    addHistory(test);

    updateDashboard();

    clearInputs();
});


// Add history item
function addHistory(test) {

    const li = document.createElement("li");

    li.innerHTML = `
        <strong>${test.subject}</strong><br>
        Accuracy: ${test.accuracy}%<br>
        Negative Marks: ${test.negativeMarks}<br>
        Date: ${test.date}
    `;

    historyList.prepend(li);
}


// Update dashboard
function updateDashboard() {

    totalTestsEl.innerText = tests.length;

    if (tests.length === 0) {
        avgAccuracyEl.innerText = "0%";
        negativeMarksEl.innerText = "0";
        return;
    }

    let totalAccuracy = 0;
    let totalNegative = 0;

    tests.forEach(test => {
        totalAccuracy += Number(test.accuracy);
        totalNegative += Number(test.negativeMarks);
    });

    const avgAccuracy = (totalAccuracy / tests.length).toFixed(2);

    avgAccuracyEl.innerText = `${avgAccuracy}%`;

    negativeMarksEl.innerText = totalNegative.toFixed(2);

    updateChart();
}


// Update chart
function updateChart() {

    performanceChart.data.labels = tests.map(
        (_, index) => `Test ${index + 1}`
    );

    performanceChart.data.datasets[0].data = tests.map(
        test => test.accuracy
    );

    performanceChart.update();
}


// Clear form
function clearInputs() {

    subjectInput.value = "";
    correctInput.value = "";
    wrongInput.value = "";
    unansweredInput.value = "";
}
