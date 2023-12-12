const arrayContent = document.getElementById("arrayContent");
const slider = document.getElementById("rectangleSlider");
const sliderValueLabel = document.getElementById("sliderValue");
const sortButton = document.getElementById("sortButton");
const automateCheckbox = document.getElementById("automateAlgorithm");

var currentArray = [];
var sorting = false;

document.addEventListener("DOMContentLoaded", function () {
  currentArray = generateRandomArray(10);
  generateRectangles(currentArray)
});

// Update rectangles when slider value changes
slider.addEventListener("input", function () {
  sorting = false;
  const rectangleCount = slider.value;
  sliderValueLabel.textContent = rectangleCount;
  currentArray = generateRandomArray(rectangleCount)
  generateRectangles(currentArray)
});

// Event listener for the "Sort" button
sortButton.addEventListener("click", function () {
  if (!sorting) {
    sortArray();
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
    if (!automateCheckbox.checked) {
      await waitForUserClick();
    } else {
      await delay(100)
    }
    currMax = 0;
    currMaxIndex = 0;
    for (let i = 0; i < currentArray.length-j; i++) {
      if (currentArray[i] > currMax) {
        currMax = currentArray[i]
        currMaxIndex = i;
      }
      generateRectangles(currentArray, i, currMaxIndex);
      if (!automateCheckbox.checked) {
        await waitForUserClick();
      } else {
        await delay(100)
      }
      if (!sorting) {
        return;
      }

    }
  
    generateRectangles(currentArray, -1, currMaxIndex);
    if (!automateCheckbox.checked) {
      await waitForUserClick();
    } else {
      await delay(100)
    }
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

function pauseFor(timeInMilliseconds) {
  console.log("paused")
  const start = Date.now();
  while (Date.now() - start < timeInMilliseconds) {
    // Keep the loop running until the specified time has passed
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
