const input = document.querySelector("#input");
const keypad = document.querySelector('.keypad');
const inputArray = [];
const buttons = Array.from(document.querySelectorAll("button"));
let operationClicked = false;

// Define your operations as simple functions
const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;

let operation = null;
let firstNum = 0;
let secondNum = 0;

input.focus();

// focus display input on window laod
window.onload = () => {
  input.focus();
  input.value = 0;
};

input.addEventListener("keydown", (event) => {
  // Prevent the default input behavior
  event.preventDefault();

  // Ensures zero is overwritten on input
  if (input.value === "0") input.value = "";
  // if value already in the input is zero, set input to num. If not, concatenate key onto input
  if (!isNaN(event.key)) {
    let num = event.key;
    // if operation has already been selected, replace value, rather than concatenate
    if (operationClicked) {
      input.value = num;
      operationClicked = false;
    } else if (input.value !== "0") {
      input.value += num;
    } else {
      input.value = num;
    }
  }

  if (event.key === 'Escape') {
    input.value = 0;
    operation = null;
    firstNum = 0;
    secondNum = 0;
  }

  // since Enter key will only be pressed once user is ready, we can just store the secondNum now
  if (event.key == "Enter") {
    secondNum = parseFloat(input.value);
    switch (operation) {
      case "multiply":
        input.value = multiply(firstNum, secondNum);
        break;
      case "divide":
        input.value = divide(firstNum, secondNum);
        break;
      case "add":
        input.value = add(firstNum, secondNum);
        break;
      case "subtract":
        input.value = subtract(firstNum, secondNum);
        break;
    }
    operation = null;
  }

  let num = event.key;

  // get current full value
  let inputNum = parseFloat(input.value);

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
    firstNum = inputNum;
    operation = "subtract";
    operationClicked = true;
  }
});

buttons.forEach((i) => {
  i.addEventListener("click", () => {
      // if value already in the input is zero, set input to val. If not, concatenate key onto input
      let val = i.innerText;

      if (!isNaN(parseFloat(val))) {
        val = parseFloat(val);
        if (input.value === "0") input.value = "";
        // if operation has already been selected, replace value, rather than concatenate
        if (operationClicked) {
          input.value = val;
          operationClicked = false;
        } else if (input.value !== "0") {
          input.value += val;
        } else {
          input.value = val;
        }
      }

      // get current full value
      let inputNum = parseFloat(input.value);

      switch (val) {
        case "+":
          firstNum = inputNum;
          operation = "add";
          operationClicked = true;
          break;
        case "-":
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
        case "AC":
          input.value = 0;
          operation = null;
          firstNum = 0;
          secondNum = 0;
          break;
        case ".":
          input.value += val;
          break;
        case "=":
          secondNum = parseFloat(input.value);
          switch (operation) {
            case "multiply":
              input.value = multiply(firstNum, secondNum);
              break;
            case "divide":
              input.value = divide(firstNum, secondNum);
              break;
            case "add":
              input.value = add(firstNum, secondNum);
              break;
            case "subtract":
              input.value = subtract(firstNum, secondNum);
              break;
          }
          // after performing an operation and clicking equals, you should reset the firstNum and operation variables to prepare for the next calculation.
          operation = null;
          firstNum = parseFloat(input.value);
          break;
        default:
          break;
      }
    input.focus();
  });
});

/* --------------- First Try - Messy and Crappy (I'm rusty) --------------- */

// input.addEventListener("keydown", (event) => {
//   // checking if number, and if not preventing display of input
//   if (!isNaN(event.key) || event.key === '.') {
//     let num = event.key;
//     inputArray.push(num);
//   } else {
//     event.preventDefault();
//   }

//   // clear on escape key
//   if (event.key === 'Escape') {
//     input.value = 0;
//   }

//   let num = event.key;

//   // get current full value
//   let inputNum = parseFloat(input.value);

//   // multiplication key
//   if (num == '*') multiply(inputNum);

//   // division key 
//   if (num == '/') divide(inputNum);

//   // Addition key(s)
//   if (num == '+') add(inputNum);

//   // subtraction key(s)
//   if (num == '-') subtract(inputNum);
// });

// const multiply = (num) => {
//   const firstNum = num;
//   let secondNum = 0;
//   const multiplyArray = [];

  
//   input.addEventListener("keydown", (event) => {
//     if (input.value === "0") input.value = "";
//     if (!isNaN(event.key)) {
//       let num = event.key;
//       if (multiplyArray.length < 1) input.value = "";
//       // if not zero (to overwrite zero)
//       if (input.value !== "0") {
//         input.value += num;
//       } else {
//         input.value = num;
//       }
//       multiplyArray.push(num);
//     }

//     if (event.key == "Enter") {
//       secondNum = parseFloat(multiplyArray.join(""));
//       input.value = firstNum * secondNum;
//     }
//   });

//   keypad.addEventListener('click', (event) => {
//     let num = event.target.innerText;

//     if (!isNaN(parseFloat(num))) {
//       if (multiplyArray.length < 1) input.value = 0;
//       input.value = num;
//       multiplyArray.push(num);
//     }

//     if (num === '=') {
//       secondNum = parseFloat(multiplyArray.join(""));
//       input.value = firstNum * secondNum;
//     }
//   })
  
// }

// const divide = (num) => {
//   const firstNum = num;
//   let secondNum = 0;
//   const divideArray = [];


//   input.addEventListener("keydown", (event) => {
//     if (input.value === "0") input.value = "";
//     if (!isNaN(event.key)) {
//       let num = event.key;
//       if (divideArray.length < 1) input.value = "";
//       if (input.value !== "0") {
//         input.value += num;
//       } else {
//         input.value = num;
//       }
//       divideArray.push(num);
//     }

//     if (event.key == "Enter") {
//       secondNum = parseFloat(divideArray.join(""));
//       input.value = firstNum * secondNum;
//     }
//   });

//   keypad.addEventListener("click", (event) => {
//     let num = event.target.innerText;

//     if (!isNaN(parseFloat(num))) {
//       if (divideArray.length < 1) input.value = "";
//       input.value = num;
//       divideArray.push(num);
//     }

//     if (num === "=") {
//       secondNum = parseFloat(divideArray.join(""));
//       input.value = firstNum / secondNum;
//     }
//   });
// };

// const add = (num) => {
//   const firstNum = num;
//   let secondNum = 0;
//   const addArray = [];


//   input.addEventListener("keydown", (event) => {
//     if (input.value === "0") input.value = "";
//     if (!isNaN(event.key)) {
//       let num = event.key;
//       if (addArray.length < 1) input.value = "";
//       if (input.value !== "0") {
//         input.value += num;
//       } else {
//         input.value = num;
//       }
//       addArray.push(num);
//     }

//     if (event.key == "Enter") {
//       secondNum = parseFloat(addArray.join(""));
//       input.value = firstNum * secondNum;
//     }
//   });

//   keypad.addEventListener("click", (event) => {
//     let num = event.target.innerText;

//     if (!isNaN(parseFloat(num))) {
//       if (addArray.length < 1) input.value = "";
//       input.value = num;
//       addArray.push(num);
//     }

//     if (num === "=") {
//       secondNum = parseFloat(addArray.join(""));
//       input.value = firstNum + secondNum;
//     }
//   });
// };

// const subtract = (num) => {
//   const firstNum = num;
//   let secondNum = 0;
//   const subtractionArray = [];


//   input.addEventListener("keydown", (event) => {
//     if (input.value === "0") input.value = "";
//     if (!isNaN(event.key)) {
//       let num = event.key;
//       if (subtractionArray.length < 1) input.value = "";
//       if (input.value !== "0") {
//         input.value += num;
//       } else {
//         input.value = num;
//       }
//       subtractionArray.push(num);
//     }

//     if (event.key == "Enter") {
//       secondNum = parseFloat(subtractionArray.join(""));
//       input.value = firstNum * secondNum;
//     }
//   });

//   keypad.addEventListener("click", (event) => {
//     let num = event.target.innerText;

//     if (!isNaN(parseFloat(num))) {
//       if (subtractionArray.length < 1) input.value = "";
//       input.value = num;
//       subtractionArray.push(num);
//     }

//     if (num === "=") {
//       secondNum = parseFloat(subtractionArray.join(""));
//       input.value = firstNum - secondNum;
//     }
//   });
// };


// buttons.forEach(i => {
//   i.addEventListener('click', () => {
//     let val = parseFloat(i.innerText);
//     if (!isNaN(val)) {
//       if (input.value === "0") input.value = "";
//       input.value += val;
//     } else {
//       val = i.innerText;
//       switch (val) {
//         case '+':
//           add(input.value);
//           break;
//         case '-':
//           subtract(input.value);
//           break;
//         case '/':
//           divide(input.value);
//           break;
//         case '*':
//           multiply(input.value);
//           break;
//         case 'C':
//           input.value = 0;
//           break;
//         case 'AC':
//           input.value = 0;
//           break;
//         case '.':
//           input.value += val;
//           break;
//         default:
//           break;
//       }
//     }
//     input.focus();
//   })
// })