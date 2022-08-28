import welcome from "../audio/welcome.mp3";
import thankyou from "../audio/thankyou1.mp3";
import instruction from "../audio/instruction.mp3";
import makefriend from "../audio/makefriend.mp3";
import sorry from "../audio/sorry.mp3";
import question from "../audio/question.mp3";
import ctn from "../audio/continue.mp3";
import confirm from "../audio/confirm.mp3";

const PlayAudio = (type) => {
  switch (type) {
    case "welcome":
      new Audio(welcome).play();
      break;

    case "sorry":
      new Audio(sorry).play();
      break;

    case "thankyou":
      new Audio(thankyou).play();
      break;

    case "instruction":
      new Audio(instruction).play();
      break;

    case "makefriend":
      new Audio(makefriend).play();
      break;

    case "question":
      new Audio(question).play();
      break;
      
    case "confirm":
      new Audio(confirm).play();
      break;

    case "continue":
      new Audio(ctn).play();
      break;

    default:
      break;
  }
};

export default PlayAudio;
