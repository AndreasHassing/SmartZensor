export class AppErrorLogger {
  private readonly outputElement: HTMLElement;

  constructor(outputElement: HTMLElement) {
    this.outputElement = outputElement;
  }

  public log(message: string) {
    console.error(message);
    this.outputElement.innerHTML += `<br>${message}`;
  }
}
