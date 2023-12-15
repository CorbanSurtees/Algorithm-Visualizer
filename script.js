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
    // selectionSort();
    bubbleSort();
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


function generateRectangles(rectangles, green=[], red=[]) {
  // Clear existing rectangles
  arrayContent.innerHTML = "";
  const width = (arrayContent.offsetWidth)/((rectangles.length+1) * 5);
  for (let i = 0; i < rectangles.length; i++) {
    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    rectangle.style.width = `${width}px`;
    rectangle.style.height = `${rectangles[i]}px`
    if (red.includes(i)) {
      rectangle.style.background = "red";
    } else if (green.includes(i)) {
      rectangle.style.background = "green";
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

async function selectionSort() {
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
      generateRectangles(currentArray, [i], [currMaxIndex]);
      await pause()
      if (!sorting) {
        return;
      }

    }
  
    generateRectangles(currentArray, [-1], [currMaxIndex]);
    await pause()
    swap(currentArray, currMaxIndex, currentArray.length-j-1);
    generateRectangles(currentArray, [-1], [currentArray.length-j-1]);~
  }
  sorting = false;
}

async function bubbleSort() {
  for (let i = 0; i < currentArray.length; i++) {
    for (let j = 0; j < currentArray.length-i-1; j++) {
      generateRectangles(currentArray, [j, j+1])
      await pause();
      if(currentArray[j] > currentArray[j+1]) {
        console.log(j + " : " + (j+1))
        swap(currentArray, j, j+1);
        generateRectangles(currentArray, [], [j, j+1])
        console.log("gonna wait?")
        await pause();
        console.log("idk")
      }
    }
  }
  generateRectangles(currentArray);
}

function swap(array, a, b) {
  if (a >= 0 && a < array.length && b >= 0 && b< array.length) {
    var t = array[a];
    array[a] = array[b];
    array[b] = t;
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
