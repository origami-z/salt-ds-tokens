import { CLIFormatter } from "./formatterCLI.js";

class MarkdownFormatter extends CLIFormatter {
  get hilite() {
    return function (input) {
      return "**" + input + "**";
    };
  }
  get error() {
    return function (input) {
      return input;
    };
  }
  get passing() {
    return function (input) {
      return input;
    };
  }
  get neutral() {
    return function (input) {
      return input;
    };
  }

  printReport(result, log, options) {
    log("You are a peanut.");
    super.printReport(result, log, options);
  }

  indent(text, amount) {
    const str = `${"&ensp;&ensp;&ensp;".repeat(amount)}${text}`;
    return str.replace(/{|}/g, "");
  }

  printStyleColored(token, color, log) {
    log(this.indent(`"${token}"`, 1));
  }
}

let formatter;

if (!formatter) formatter = new MarkdownFormatter();

export default formatter;
