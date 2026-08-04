/* eslint-disable no-eval */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Converter from "./Converter";

const SVG = (props) => (
  // Thank you, https://squircley.app !!!
  <svg
    width="50px"
    height="50px"
    id={props.id}
    stroke={props.stroke}
    fill={props.fill}
    viewBox="0 0 150 150"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id={props.id}
      d="M 0, 75
      C 0, 18.75 18.75, 0 75, 0
      S 150, 18.75 150, 75
      131.25, 150 75, 150
      0, 131.25 0, 75"
    ></path>
  </svg>
);

function Numbers(props) {
  return (
    <div
      className="button-center"
      id={Converter(props.id)}
      onClick={props.numbers}
    >
      <SVG fill="#dfe4ea" id={props.id} />
      <a>{props.id}</a>
    </div>
  );
}

function Special(props) {
  var liClasses = (props.keyCode === "Backspace" ? "button-special-backspace " : "button-special ")
  + (props.id === "Nan" && "nan");
  return (
    <div
      className={liClasses}
      id={Converter(props.id)}
      onClick={props.skills}
    >
      <SVG stroke={props.id==="Backspace"?'':"#fab1a0"}
      fill={props.id==="Backspace"?'#dfe4ea':"#d63031"}
      id={props.keyCode} />
        <a>{props.keyCode === "Backspace" ?
        <i class="fas fa-backspace"></i>
         : props.id}</a>
    </div>
  );
}

function MathButton(props) {
  return (
    <div
      className={props.id === "=" ? "button-math-equals" : "button-math"}
      id={Converter(props.id)}
      onClick={props.function}
    >
      <SVG
        stroke={props.id === "=" ? "#c8d6e5" : ""}
        fill={props.id === "=" ? "#4185f4" : "#dfe4ea"}
        id={props.id}
      />
      <a>{props.id}</a>
    </div>
  );
}

function App() {
  const [currentDisplay, setCurrentDisplay] = useState("0");
  const [displayFormulaGS, setDisplayFormulaGS] = useState(
    String.fromCharCode(160)
  );
  const formulaGS = {
    get get() {
      return displayFormulaGS;
    },
    /**
     * @param {string} equation
     */
    set toDisplay(equation) {
      setDisplayFormulaGS(equation);
    },
    /**
     * @param {string} numberOrOperation
     */
    append: function (numberOrOperation, appendEqualsOnTheEnd = false) {
      const MAXCHAR = 28;
      var tempVal = displayFormulaGS;
      if (tempVal === String.fromCharCode(160)) {
        tempVal = "";
      }
      switch (numberOrOperation) {
        case "/":
          if (!this.isInMathOperation()) tempVal += "/";
          break;
        case "x":
          if (!this.isInMathOperation()) tempVal += "*";
          break;
        case "—":
          if (!this.isInMathOperation()) tempVal += "-";
          break;
        case "+":
          if (!this.isInMathOperation()) tempVal += "+";
          break;
        case "-":
        case "0.":
          break;
        default:
          let isNegative = numberOrOperation.substr(0, 1) === "-" && true;
          tempVal += `${isNegative ? "(" : ""}${numberOrOperation}${
            isNegative ? ")" : ""
          }`;
      }
      let cuttedTempVal;
      if (tempVal.length > MAXCHAR) {
        cuttedTempVal = "..." + tempVal.substr(tempVal.length - MAXCHAR);
      }
      setDisplayFormulaGS(
        (cuttedTempVal || tempVal) + (appendEqualsOnTheEnd ? "=" : "")
      );
      return tempVal;
    },
    undo: function () {
      setDisplayFormulaGS(
        displayFormulaGS.substr(0, displayFormulaGS.length - 1)
      );
    },
    clear: function () {
      setDisplayFormulaGS(String.fromCharCode(160));
    },
    hasEquals: function () {
      return displayFormulaGS.substr(displayFormulaGS.length - 1) === "=";
    },
    putEquals: function () {
      setDisplayFormulaGS(displayFormulaGS + "=");
    },
    isEmpty: displayFormulaGS === String.fromCharCode(160),
    isInMathOperation: function () {
      return /\+|\*|\/|-/.test(
        displayFormulaGS.substr(displayFormulaGS.length - 1)
      );
    },
  };

  const resetAll = useCallback(
    (e, displayScreen = "0", formulaDisplay = undefined) => {
      try {
        e.preventDefault();
      } catch (err) {}
      setCurrentDisplay(displayScreen);
      if (formulaDisplay) {
        formulaGS.toDisplay = formulaDisplay;
      } else {
        formulaGS.clear();
      }
    },
    [formulaGS]
  );

  const handleNumbers = useCallback(
    (e, def = undefined) => {
      let needReset = false;
      if (formulaGS.hasEquals()) {
        needReset = true;
        resetAll(e);
      }
      const value = def || e.target.innerText || e.target.id;
      switch (currentDisplay) {
        case "0":
          setCurrentDisplay(value);
          break;
        case "/":
        case "x":
        case "—":
        case "+":
          formulaGS.append(currentDisplay);
          setCurrentDisplay(value);
          break;
        default:
          setCurrentDisplay(needReset ? value : currentDisplay + value);
      }
      if (currentDisplay.length > 9) {
        maxLimitError();
      }
    },
    [currentDisplay, resetAll, formulaGS]
  );

  const mathematicsOperations = useCallback(
    (e, def = undefined) => {
      let needReset = formulaGS.hasEquals();
      let isNegative;
      try {
        isNegative = currentDisplay.substr(0, 1) === "-" && true;
      } catch (err) {
        isNegative = false;
      }
      if (!/LIMIT ERROR/.test(currentDisplay)) {
        let value = def || e.target.innerText || e.target.id;
        switch (value) {
          case "÷":
            if (needReset) {
              resetAll(e, "/", currentDisplay);
              return;
            }
            formulaGS.append(currentDisplay);
            setCurrentDisplay("/");
            break;
          case "×":
            if (needReset) {
              resetAll(e, "x", currentDisplay);
              return;
            }
            formulaGS.append(currentDisplay);
            setCurrentDisplay("x");
            break;
          case "+":
            if (needReset) {
              resetAll(e, "+", currentDisplay);
              return;
            }
            if (!/\+|x|\/|—/.test(currentDisplay)) {
              if (
                formulaGS.isInMathOperation &&
                /\+|x|\/|-/.test(currentDisplay)
              ) {
                formulaGS.undo();
              } else {
                formulaGS.append(currentDisplay);
              }
            }
            setCurrentDisplay("+");
            break;
          case "—":
            if (needReset) {
              resetAll(e, "—", currentDisplay);
              return;
            }
            if (/\+|x|\/|—/.test(currentDisplay)) {
              if (formulaGS.isInMathOperation) {
                formulaGS.append(currentDisplay);
              }
              setCurrentDisplay("-");
            } else if (isNegative) {
              // remove negativity
              if (currentDisplay === "-") {
                setCurrentDisplay("0");
              } else {
                setCurrentDisplay(
                  currentDisplay.substr(1, currentDisplay.length)
                );
              }
            } else {
              formulaGS.append(currentDisplay);
              setCurrentDisplay("—");
            }
            break;
          default:
        }
      }
    },
    [currentDisplay, resetAll, formulaGS]
  );

  function maxLimitError() {
    setCurrentDisplay("LIMIT ERROR");
  }

  const backSpace = useCallback((e) => {
    if (currentDisplay.length > 1) {
      setCurrentDisplay(currentDisplay.substr(0, currentDisplay.length - 1));
    } else {
      setCurrentDisplay("0");
    }
  },[currentDisplay]);

  const inputDot = useCallback(
    (e) => {
      e.preventDefault();
      if (formulaGS.hasEquals()) {
        resetAll(e);
      } else if (!/\.|LIMIT ERROR/.test(currentDisplay)) {
        setCurrentDisplay(currentDisplay + ".");
      }
    },
    [formulaGS, currentDisplay, resetAll]
  );

  const evaluate = useCallback(
    (e) => {
      const MAXCHAR = 9;
      e.preventDefault();
      if (formulaGS.hasEquals()) {
        return;
      }
      if (!/LIMIT ERROR/.test(currentDisplay)) {
        try {
          let answer = eval(formulaGS.append(currentDisplay, true));
          if (answer > 999999999) {
            maxLimitError();
            return;
          }
          setCurrentDisplay(
            ("" + answer).length > MAXCHAR
              ? ("" + answer).substr(0, MAXCHAR)
              : "" + answer
          );
        } catch (err) {
          maxLimitError();
          return;
        }
      }
    },
    [formulaGS, currentDisplay]
  );

  const handleKeyPress = useCallback(
    (e) => {
      let el;
      console.log(e.key);
      switch (e.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          el = document.getElementById(e.key);
          el.classList.toggle("button-center-active");
          handleNumbers("", e.key);
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break; // "+"
        case "/":
        case "\\":
          el = document.getElementById("÷");
          el.classList.toggle("button-center-active");
          mathematicsOperations("", "÷");
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case "x":
        case "*":
          el = document.getElementById("×");
          el.classList.toggle("button-center-active");
          mathematicsOperations("", "×");
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case "-":
          el = document.getElementById("—");
          el.classList.toggle("button-center-active");
          mathematicsOperations("", "—");
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case "+":
        case "=":
          el = document.getElementById("+");
          el.classList.toggle("button-center-active");
          mathematicsOperations("", "+");
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case "Enter":
          el = document.getElementById("=");
          el.classList.toggle("button-center-active");
          evaluate(e);
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case ",":
        case ".":
          el = document.getElementById(e.key);
          el.classList.toggle("button-center-active");
          inputDot(e);
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case "Escape":
          el = document.getElementById(e.key);
          el.classList.toggle("button-center-active");
          resetAll(e);
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        case "Backspace":
          el = document.getElementById(e.key);
          el.classList.toggle("button-center-active");
          backSpace();
          setTimeout(() => el.classList.toggle("button-center-active"), 280);
          break;
        default:
      }
    },
    [handleNumbers, mathematicsOperations, evaluate, inputDot, resetAll, backSpace]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    // returned function will be called on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="calculator">
      <div id="equation" className="equation">
        {displayFormulaGS}
      </div>
      <div id="display" className="display">
        {currentDisplay}
      </div>
      <div className="divider-2">
        <span></span>{" "}
      </div>
      <Special id="AC" skills={resetAll} keyCode="Escape" />
      <Special id="Nan" />
      <Special id="Backspace" skills={backSpace} keyCode="Backspace" />
      <MathButton id="÷" function={mathematicsOperations} keyCode="÷" />
      <Numbers id="7" numbers={handleNumbers} />
      <Numbers id="8" numbers={handleNumbers} />
      <Numbers id="9" numbers={handleNumbers} />
      <MathButton id="×" function={mathematicsOperations} keyCode="×" />
      <Numbers id="4" numbers={handleNumbers} />
      <Numbers id="5" numbers={handleNumbers} />
      <Numbers id="6" numbers={handleNumbers} />
      <MathButton id="—" function={mathematicsOperations} keyCode="—" />
      <Numbers id="1" numbers={handleNumbers} />
      <Numbers id="2" numbers={handleNumbers} />
      <Numbers id="3" numbers={handleNumbers} />
      <MathButton id="+" function={mathematicsOperations} keyCode="+" />
      <Numbers id="." numbers={inputDot} />
      <Numbers id="0" numbers={handleNumbers} />
      <Special id="Nan" />
      <MathButton id="=" function={evaluate} keyCode="=" />
    </div>
  );
}

export default App;
