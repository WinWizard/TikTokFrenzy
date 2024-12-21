const steps = document.querySelectorAll("#steps-list .step");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const stepIndicator = document.getElementById("step-indicator");

let currentStep = 0;

function updateSteps() {
    // Update active step
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    // Update step indicator
    stepIndicator.textContent = `0${currentStep + 1}/04`;
}

// Event listener for previous button
prevBtn.addEventListener("click", () => {
    currentStep = (currentStep === 0) ? steps.length - 1 : currentStep - 1;
    updateSteps();
});

// Event listener for next button
nextBtn.addEventListener("click", () => {
    currentStep = (currentStep + 1) % steps.length;
    updateSteps();
});

// Initialize the steps on page load
updateSteps();