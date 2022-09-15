import welcome from "../audio/welcome.mp3";
import thankyou from "../audio/thankyou1.mp3";
import instruction from "../audio/instruction.mp3";
import makefriend from "../audio/makefriend.mp3";
import sorry from "../audio/sorry.mp3";
import question from "../audio/question.mp3";
import ctn from "../audio/continue.mp3";
import confirm from "../audio/confirm.mp3";
import changeframe from '../audio/changeframe.mp3'
import inputEmail from '../audio/inputEmail.mp3'
let audio = new Audio();
const PlayAudio = (type) => {
  switch (type) {
    case "welcome":
      if (audio.paused) {
        audio.src = welcome;
        audio.play();
      }
      break;

    case "sorry":
      if (audio.paused) {
        audio.src = sorry;
        audio.play();
      }
      break;

    case "inputEmail":
      if (audio.paused) {
        audio.src = inputEmail;
        audio.play();
      }
      break;

    case "thankyou":
      if (audio.paused) {
        audio.src = thankyou;
        audio.play();
      }
      break;

    case "instruction":
      if (audio.paused) {
        audio.src = instruction;
        audio.play();
      }
      break;

    case "makefriend":
      if (audio.paused) {
        audio.src = makefriend;
        audio.play();
      }
      break;

    case "question":
      if (audio.paused) {
        audio.src = question;
        audio.play();
      }
      break;

    case "confirm":
      if (audio.paused) {
        audio.src = confirm;
        audio.play();
      }
      break;

    case "continue":
      if (audio.paused) {
        audio.src = ctn;
        audio.play();
      }
      break;

      case 'changeframe':
        if (audio.paused) {
          audio.src = changeframe;
          audio.play();
        }
        break;

    default:
      break;
  }
};

export default PlayAudio;
