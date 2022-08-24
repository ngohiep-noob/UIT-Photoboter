import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ReplayIcon from "@mui/icons-material/Replay";
import TextEdit from "./TextEditable";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import SendMail from "./SendMail";
import Fab from "@mui/material/Fab";
import { ProcessContextState } from "../../App";

const UserInfo = (props, ref) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const context = useContext(ProcessContextState).current;
  const cacheRef = useRef({
    email: props.userInfo.email,
    name: props.userInfo.name,
  });
  const [sending, setSending] = React.useState(false);
  // 0: undefined(unsent) | 1: success | 2: fail
  const [sendMailStatus, setSendMailStatus] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const buttonSx = {
    ...(sendMailStatus === 1 && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const HandleOpenEditClick = () => {
    setEditMode(!editMode);
    cacheRef.current = {
      name: nameRef.current.getData(),
      email: emailRef.current.getData(),
    };
  };

  const HandleCloseEditClick = () => {
    setEditMode(!editMode);
    nameRef.current.setData(cacheRef.current.name);
    emailRef.current.setData(cacheRef.current.email);
  };

  const handleSendMail = () => {
    // sendMailStatus === 0 or 2 ==> first send or resend mail
    if(sendMailStatus === 1) {
      return new Promise((resolve, reject) => resolve(true));
    }
    if (!sending && (sendMailStatus === 0 || sendMailStatus === 2)) {
      const email = emailRef.current.getData();
      const name = nameRef.current.getData();

      setEditMode(false); // turn off edit name and email
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false
      ) {
        console.log("invalid email!");
        return new Promise((resolve, reject) => resolve(false));
      }
      if (name === "") {
        console.error("name cannot empty!");
        return new Promise((resolve, reject) => resolve(false));
      }
      setSending(true); // toggle mail sending spinner
      // call api to send mail
      return new Promise((resolve, reject) => {
        SendMail({
          recipient: email,
          imgBase64: context.finalImageRef.current,
          title: `🤖 UIT photoboter xin tặng ${name} một tấm hình`,
          textContent: "Người trong hình thật xinh đẹp 🥰",
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.status === "success") {
              console.log("sent mail: ", res);
              setSendMailStatus(1);
              setSending(false);
              resolve(true);
            }
            if (res.status === "error") {
              console.log("send mail fail: ", res);
              setSendMailStatus(2);
              setSending(false);
              resolve(false);
            }
          })
          .catch((err) => {
            console.error(err);
            console.log("send mail fail: ", err);
            setSendMailStatus(2);
            setSending(false);
            resolve(false);
          });
      });
    }
  };

  useImperativeHandle(ref, () => ({
    handleSendMail,
  }));

  useEffect(() => {
    nameRef.current.toggleEdit(editMode);
    emailRef.current.toggleEdit(editMode);
  }, [editMode]);

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={props.userInfo.name} src={props.userInfo.avatar} sx={{width: 56, height: 56}}/>
      </ListItemAvatar>

      <ListItemText
        primary={
          <React.Fragment>
            <TextEdit
              firstVal={props.userInfo.name}
              ref={nameRef}
              label={"Name"}
            />
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <TextEdit
              firstVal={props.userInfo.email}
              ref={emailRef}
              label={"Email"}
            />
          </React.Fragment>
        }
        sx={{margin: '6px 15px 6px 15px'}}
      />

      <ListItemIcon>
        {editMode && (
          <Fab
            color="error"
            size="small"
            onClick={HandleCloseEditClick}
            sx={{ m: 1, position: "relative" }}
          >
            <ClearIcon />
          </Fab>
        )}

        <Fab
          color="info"
          size="small"
          disabled={sendMailStatus === 1 || sending} // send mail success or in sending process
          onClick={HandleOpenEditClick}
          sx={{ m: 1, position: "relative" }}
        >
          {editMode ? <CheckIcon /> : <EditIcon />}
        </Fab>

        <Box sx={{ m: 1, position: "relative" }}>
          <Fab
            disabled={sendMailStatus === 1} // send success
            aria-label="save"
            color={
              sendMailStatus === 0
                ? "warning"
                : (sendMailStatus === 2
                ? "error"
                : "success")
            }
            onClick={handleSendMail}
            sx={{ ...buttonSx }}
            size="small"
          >
            {sendMailStatus === 0 ? (
              <EmailIcon />
            ) : sendMailStatus === 1 ? (
              <CheckIcon />
            ) : (
              <ReplayIcon />
            )}
          </Fab>
          {sending && (
            <CircularProgress
              size={53}
              sx={{
                color: green[500],
                position: "absolute",
                top: -6,
                left: -7,
                zIndex: 1,
              }}
            />
          )}
        </Box>
      </ListItemIcon>
    </ListItem>
  );
};

export default forwardRef(UserInfo);
