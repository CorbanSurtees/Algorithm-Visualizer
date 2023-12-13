const arrayContent = document.getElementById("arrayContent");
const lengthSlider = document.getElementById("rectangleSlider");
const lengthSliderValueLabel = document.getElementById("rectangleSliderValue");
const sortButton = document.getElementById("sortButton");
const automateCheckbox = document.getElementById("automateAlgorithm");
const speedSlider = document.getElementById("speedSlider");
const speedSliderValueLabel = document.getElementById("speedSliderValue");


var currentArray = [];
var sorting = false;
automatic = false;

document.addEventListener("DOMContentLoaded", function () {
  currentArray = generateRandomArray(10);
  generateRectangles(currentArray)
});

// Update rectangles when slider value changes
lengthSlider.addEventListener("input", function () {
  sorting = false;
  const rectangleCount = lengthSlider.value;
  lengthSliderValueLabel.textContent = rectangleCount;
  currentArray = generateRandomArray(rectangleCount)
  generateRectangles(currentArray)
});

// Event listener for the "Sort" button
sortButton.addEventListener("click", function () {
  if (!sorting) {
    sortArray();
  }
});

// Update speed when slider value changes
speedSlider.addEventListener("input", function () {
  const speed = speedSlider.value;
  if (speed === speedSlider.max) {
    speedSliderValueLabel.textContent = "Max";
  } else if (speed === speedSlider.min) {
    speedSliderValueLabel.textContent = "Min";
  } else {
    speedSliderValueLabel.textContent = speed;
  }
});


function generateRectangles(rectangles, selectedIndex, maxIndex) {
  // Clear existing rectangles
  arrayContent.innerHTML = "";
  const width = (arrayContent.offsetWidth)/(rectangles.length * 1.5);
  for (let i = 0; i < rectangles.length; i++) {
    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    rectangle.style.width = `${width}px`;
    rectangle.style.height = `${rectangles[i]}px`
    if (i === maxIndex) {
      rectangle.style.backgroundColor = "red";
    } else if (i === selectedIndex) {
      rectangle.style.backgroundColor = "green";
    }
    arrayContent.appendChild(rectangle);
  }
}

function generateRandomArray(length) {
  const randomArray = [];
  for (let i = 0; i < length; i++) {
      // Generate random numbers (you can customize this range as needed)
      const randomNumber = Math.floor(Math.random() * 200) + 50;
      randomArray.push(randomNumber);
  }
  return randomArray;
}

async function sortArray() {
  sorting = true;
  for (let j = 0; j < currentArray.length; j++) {
    await pause();
    currMax = 0;
    currMaxIndex = 0;
    for (let i = 0; i < currentArray.length-j; i++) {
      if (currentArray[i] > currMax) {
        currMax = currentArray[i]
        currMaxIndex = i;
      }
      generateRectangles(currentArray, i, currMaxIndex);
      await pause()
      if (!sorting) {
        return;
      }

    }
  
    generateRectangles(currentArray, -1, currMaxIndex);
    await pause()
    moveElementToEnd(currentArray, currMaxIndex);
    generateRectangles(currentArray, -1, currentArray.length-1);
  }
}

function moveElementToEnd(array, index) {
  if (index >= 0 && index < array.length) {
      const elementToMove = array.splice(index, 1)[0];
      array.push(elementToMove);
  } else {
      console.error("Invalid index");
  }
}

async function pause() {
  automatic = true;
  if (speedSlider.value === speedSlider.max) {
    return;
  }
  if (speedSlider.value === speedSlider.min) {
    automatic = false;
  }
  if (!automatic) {
    await waitForUserClick();
  } else {
    await delay(speedSlider.max - speedSlider.value)
  }
}

function delay(timeInMilliseconds) {
  return new Promise(resolve => setTimeout(resolve, timeInMilliseconds));
}

async function waitForUserClick() {
  return new Promise(resolve => {
    const buttonClicking = document.querySelector('#sortButton');

    if (buttonClicking) {
      buttonClicking.addEventListener("click", function handler() {
        buttonClicking.removeEventListener("click", handler);
        resolve();
      });
    }
  });
}
