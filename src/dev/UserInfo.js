<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
=======
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
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
<<<<<<< HEAD
import SaveIcon from '@mui/icons-material/Save';
=======
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ReplayIcon from "@mui/icons-material/Replay";
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
import TextEdit from "./TextEdit";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";

const UserInfo = (props, ref) => {
  const nameRef = useRef(null);
<<<<<<< HEAD
  const [save, setSave] = useState(false)
  const HandleEditClick = () => {
    nameRef.current.toggleEdit(true);
    setSave(!save);
    
  }

  const SaveToDatabase = () => {
    setSave(!save);
    console.log("Thông tin mới là: ", nameRef.current.getData())
  }
=======
  const emailRef = useRef(null);
  const success = useRef(false);
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
    if (!sending && (sendMailStatus === 0 || sendMailStatus === 2)) {
      const email = emailRef.current.getData();
      const name = nameRef.current.getData();

      setEditMode(false); // turn off edit name and email
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false
      ) {
        console.log("invalid email!");
        return;
      }
      if (name === "") {
        console.error("name cannot empty!");
        return;
      }
      setSending(true); // toggle mail sending spinner
      // call api to send mail
      return new Promise((resolve, reject) => {
        console.log("sent email: ", name, " - ", email);
        success.current = Math.round(Math.random());
        setTimeout(() => {
          if (success.current == true) {
            console.log("sent email: ", name, " - ", email);
            setSendMailStatus(1);
            setSending(false);
            console.log(`email: ${email} - success`);
            resolve(true);
          }

          if (success.current == false) {
            setSendMailStatus(2);
            success.current = true;
            setSending(false);
            console.error(`email: ${email} - error`);
            // return Promise.resolve(false); // error
            resolve(false);
          }
        }, 1000);
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
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6



  return (
<<<<<<< HEAD
    <>
      {props.userInfo && (
        <ListItem alignItems="flex-start">

              {/*AVATAR  */}
            <ListItemAvatar>
              <Avatar
                alt="Travis Howard"
                src="https://i.stack.imgur.com/l60Hf.png"
              />
            </ListItemAvatar>

          {/* INFOR */}
          <ListItemText

            primary={
              <React.Fragment>
                <TextEdit firstVal={props.userInfo.name} ref={nameRef}/>
              </React.Fragment>
            }
            
            // change here with text edit
            secondary={ 
              <Typography sx={{ display: "inline" }} component="span" variant="caption" color="text.primary">
                {props.userInfo.email}
              </Typography>
            }
          />

          {/* EDIT AND GMAIL */}
          <ListItemIcon>

              <IconButton color ="info" >
                {save ? <SaveIcon onClick={SaveToDatabase}/> : <EditIcon onClick={HandleEditClick}/> }
              </IconButton>


              <IconButton>
                <EmailIcon color="warning" />
              </IconButton>

          </ListItemIcon>

        </ListItem>
      )}
    </>
=======
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={props.userInfo.name} src={props.userInfo.avatar} />
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
                : sendMailStatus === 2
                ? "error"
                : "success"
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
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
  );
};

export default forwardRef(UserInfo);
