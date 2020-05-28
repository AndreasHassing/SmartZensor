export function AppError(outputElement) {
  this.outputElement = outputElement;
}

AppError.prototype.log = function log(message) {
  console.error(message);
  this.outputElement.innerHTML += `<br>${message}`;
};
