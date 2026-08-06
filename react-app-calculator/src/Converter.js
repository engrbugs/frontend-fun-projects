const ids = {
  "÷": "divide",
  "×": "multiply",
  "—": "subtract",
  "+": "add",
  "=": "equals",
  ".": "decimal",
  Nan: "unused",
  AC: "all-clear",
  Backspace: "backspace",
};

export default function Converter(value) {
  return `button-${ids[value] || value}`;
}
