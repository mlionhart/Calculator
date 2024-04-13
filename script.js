const input = document.querySelector("#input");
const keypad = document.querySelector('.keypad');
const inputArray = [];
const buttons = Array.from(document.querySelectorAll("button"));
let operationClicked = false;
let enterBtn = false;
let afterDecimal = '';
let operation = null;
let firstNum = 0;
let secondNum = 0;
let hasDash = false;

const addCommas = (numStr) => {
  if (numStr.includes('.')) {
    let parts = numStr.toString().split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? "." + parts[1] : "";
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log(numStr);
    return integerPart + decimalPart;
  }

  if (numStr.includes(',')) {
    numStr = numStr.replace(/,/g, "");
  }

  if (numStr.includes('-')) {
    numStr = numStr.replace(/-/g, "");
    hasDash = true;
  }

  if (numStr.length > 9) {
    numStr =
      numStr.slice(0, numStr.length - 9) +
      "," +
      numStr.slice(numStr.length - 9, numStr.length - 6) +
      "," +
      numStr.slice(numStr.length - 6, numStr.length - 3) +
      "," +
      numStr.slice(numStr.length - 3);
  } else if (numStr.length > 6) {
    numStr =
      numStr.slice(0, numStr.length - 6) +
      "," +
      numStr.slice(numStr.length - 6, numStr.length - 3) +
      "," +
      numStr.slice(numStr.length - 3);
  } else if (numStr.length > 3) {
    numStr =
      numStr.slice(0, numStr.length - 3) +
      "," +
      numStr.slice(numStr.length - 3);
  }

  // put dash back on to number
  if (hasDash === true) {
    hasDash = false;
    return "-" + numStr;
  } else {
    return numStr;
  }
};

// operations functions
const add = (num1, num2) => {
  // Directly calculate the result of the addition
  let result = num1 + num2;

  // Pass the numerical result directly to the formatting function
  return formatNumber(result);
};

const subtract = (num1, num2) => {
  // Calculate the subtraction result directly
  let result = num1 - num2;

  // Use the formatNumber function to handle all formatting
  return formatNumber(result);
};

const multiply = (num1, num2) => {
  let result = num1 * num2;
  let resultStr = result.toString();

  // Normalize floating point precision to a maximum of 2 decimal places
  if (resultStr.includes(".")) {
    result = parseFloat(result.toFixed(2)); // round to two decimal places
    resultStr = result.toString().replace(/\.?0+$/, ""); // clean up trailing zeros
  }

  // Format the number with commas for readability
  return formatNumber(resultStr);
};

const divide = (num1, num2) => {
  if (num2 === 0) {
    return "Error"; // Prevent division by zero
  }

  let result = num1 / num2;
  let resultStr = result.toString();

  // Normalize floating point precision to a maximum of 2 decimal places
  if (resultStr.includes(".")) {
    result = parseFloat(result.toFixed(2)); // round to two decimal places
    resultStr = result.toString().replace(/\.?0+$/, ""); // clean up trailing zeros
  }

  // Format the number with commas for readability
  return formatNumber(resultStr);
};

function formatNumber(num) {
  // Ensure the input is treated as a number to handle formatting properly.
  let number = Number(num); // Convert the input to a number if it isn't already.

  // Check if the number is too large for standard display (you may adjust the length threshold).
  if (number.toString().length > 7 || Math.abs(number) >= 1e7) {
    // Use scientific notation for very large or small numbers.
    return number.toExponential(2);
  } else {
    // Convert the number to a string and format it with commas.
    let formattedNumber = number.toFixed(2).replace(/\.?0+$/, "");
    return addCommas(formattedNumber);
  }
}


input.focus();

// focus display input on window laod
window.onload = () => {
  input.focus();
  input.value = 0;
};

input.addEventListener("keydown", (event) => {
  // Prevent the default input behavior (prevent double input from being and input field)
  event.preventDefault();
  console.log(event.key);

  // Ensures zero is overwritten on input
  if (input.value === "0") input.value = "";
  // if value already in the input is zero, set input to num. If not, concatenate key onto input
  if (!isNaN(event.key) || event.key === '.') {
    enterBtn = false;
    let num = event.key;

    // period functionality
    if (num === '.') {
      if (operationClicked) {
        input.value = num;
        operationClicked = false;
      } else {
        // prevent period from inputing if already entered
        if (input.value.includes(".")) return;
        input.value += num;
      }
    }

    // if operation has already been selected, replace value, rather than concatenate, then set operationClicked back to false
    if (operationClicked) {
      input.value = num;
      operationClicked = false;
      // if no operation clicked, and full input value isn't single dot or zero, concatenate value
    } else if (input.value !== "0" && num !== '.') { 
      input.value += num;
      // if decimal is present in the input field, and no more than 3 digits exist to the LEFT of the decimal, add commas to the input value
      if (input.value.includes('.')) {
        if (input.value.split(0, input.value.indexOf('.')).length > 3) {
          input.value = addCommas(input.value);
        }
        // if no decimal is present in the input field, and no more than 3 digits, add commas
      } else {
        if (input.value.length > 3) {
          input.value = addCommas(input.value);
        }
      }
      // if no operation, and current num isn't a period, replace input value with current num
    } else {
      if (num !== '.') {
        input.value = num;
      }
    }
  }

  if (event.key === 'Escape') {
    input.value = 0;
    operation = null;
    operationClicked = false;
    enterBtn = false;
    firstNum = 0;
    secondNum = 0;
  }

  if (event.key === "Backspace") {
    if (input.value == 0 || input.value.length === 1) {
      input.value = 0;
    } else {
      input.value = addCommas(input.value.slice(0, -1));    
    }
  }

  // since Enter key will only be pressed once user is ready, we can just store the secondNum now
  if (event.key == "Enter") {
    secondNum = parseFloat(input.value.replace(/,/g, ""));
    switch (operation) {
      case "multiply":
        if (enterBtn === true) {
          input.value = input.value * secondNum;
        } 
        input.value = multiply(firstNum, secondNum);
        break;
      case "divide":
        if (enterBtn === true) {
          input.value = input.value / secondNum;
        }
        input.value = divide(firstNum, secondNum);
        break;
      case "add":
        if (enterBtn === true) {
          input.value = parseFloat(input.value) + secondNum;
        }
        input.value = add(firstNum, secondNum);
        break;
      case "subtract":
        if (enterBtn === true) {
          input.value = parseFloat(input.value) - secondNum;
        }
        input.value = subtract(firstNum, secondNum);
        break;
    }
    enterBtn = true;
    operation = null;
  }

  let num = event.key;

  // get current full value
  let inputNum = parseFloat(input.value.replace(/,/g, ""));

  // multiplication key
  if (num == "*") {
    firstNum = inputNum;
    operation = "multiply";
    operationClicked = true;
  }

  // division key
  if (num == "/") {
    firstNum = inputNum;
    operation = "divide";
    operationClicked = true;
  }

  // Addition key(s)
  if (num == "+") {
    firstNum = inputNum;
    operation = "add";
    operationClicked = true;
  }

  // subtraction key(s)
  if (num == "-") {
    if (input.value == 0) {
      input.value = num;
      return;
    } else if (operationClicked) {
      input.value = num;
      operationClicked = false;
      return;
    }
    firstNum = inputNum;
    operation = "subtract";
    operationClicked = true;
  }
});

function addEventListeners(button) {
  // Check if touch is supported, and use touch events only if supported.
  if ("ontouchstart" in window) {
    button.addEventListener("touchstart", handleInput);
  } else {
    button.addEventListener("click", handleInput);
  }
}

buttons.forEach(addEventListeners);

function handleInput(event) {
  let val = event.target.innerText;
  // if number
  if (!isNaN(parseFloat(val))) {
    enterBtn = false;
    val = parseFloat(val);
    // if value already in the input is zero, set input to val. If not, concatenate key onto input
    if (input.value === "0") input.value = "";
    // if operation has already been selected, replace value, rather than concatenate
    if (operationClicked) {
      input.value = val;
      operationClicked = false;
    } else if (input.value !== "0") {
      input.value += val;
      if (input.value.includes(".")) {
        if (input.value.split(0, input.value.indexOf(".")).length > 3) {
          input.value = addCommas(input.value);
        }
        // if no decimal is present in the input field, and no more than 3 digits, add commas
      } else {
        if (input.value.length > 3) {
          input.value = addCommas(input.value);
        }
      }
    } else {
      input.value = val;
    }

    if (enterBtn) {
      operation = null;
    }
  }

  // get current full value
  let inputNum = parseFloat(input.value.replace(/,/g, ""));

  switch (val) {
    case "+":
      firstNum = inputNum;
      operation = "add";
      operationClicked = true;
      break;
    case "-":
      // functionality to input negative numbers
      if (input.value == 0) {
        input.value = val;
        break;
      } else if (operationClicked) {
        input.value = val;
        operationClicked = false;
        break;
      }
      firstNum = inputNum;
      operation = "subtract";
      operationClicked = true;
      break;
    case "/":
      firstNum = inputNum;
      operation = "divide";
      operationClicked = true;
      break;
    case "*":
      firstNum = inputNum;
      operation = "multiply";
      operationClicked = true;
      break;
    case "C":
      input.value = 0;
      operation = null;
      firstNum = 0;
      secondNum = 0;
      break;
    case "":
      if (input.value == 0 || input.value.length === 1) {
        input.value = 0;
      } else {
        input.value = addCommas(input.value.slice(0, -1));
      }
      break;
    case ".":
      if (operationClicked) {
        input.value = val;
        operationClicked = false;
      } else {
        // prevent > one dot from being input
        if (input.value.includes(".")) break;
        input.value += val;
      }
      break;
    case "=":
      secondNum = parseFloat(input.value.replace(/,/g, ""));
      switch (operation) {
        case "multiply":
          if (enterBtn === true) {
            console.log(inputNum);
            input.value = input.value * inputNum;
            enterBtn = false;
          }
          input.value = multiply(firstNum, secondNum);
          break;
        case "divide":
          if (enterBtn === true) {
            input.value = input.value / secondNum;
            enterBtn = false;
          }
          input.value = divide(firstNum, secondNum);
          break;
        case "add":
          if (enterBtn === true) {
            input.value = parseFloat(input.value) + secondNum;
            enterBtn = false;
          }
          input.value = add(firstNum, secondNum);
          break;
        case "subtract":
          if (enterBtn === true) {
            input.value = parseFloat(input.value) - secondNum;
            enterBtn = false;
          }
          input.value = subtract(firstNum, secondNum);
          break;
      }
      // after performing an operation and clicking equals, you should reset the firstNum and operation variables to prepare for the next calculation.
      enterBtn = true;
      // operation = null;
      firstNum = parseFloat(input.value);
      break;
    default:
      break;
  }
  input.focus();
}

// prevent zoom on mobile devices
document.addEventListener(
  "dblclick",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);


