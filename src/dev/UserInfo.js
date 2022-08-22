import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import TextEdit from "./TextEdit";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";

const UserInfo = (props) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const cacheRef = useRef({
    email: props.userInfo.email,
    name: props.userInfo.name,
  });
  const [sending, setSending] = React.useState(false);
  const [sendMailSuccess, setSendMailSuccess] = React.useState(false);
  const [disableEdit, setDisableEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const buttonSx = {
    ...(sendMailSuccess && {
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

  const handleSendMailClick = () => {
    if (!sending) {
      setSendMailSuccess(false); 
      setSending(true); // toggle mail sending spinner 
      // call api to send mail
      setEditMode(false); // turn off edit name and email
      setDisableEdit(true); // disable edit button(fade)
      window.setTimeout(() => {
        setSendMailSuccess(true);
        setSending(false);
      }, 2000);
    }
  };

  useEffect(() => {
    nameRef.current.toggleEdit(editMode);
    emailRef.current.toggleEdit(editMode);
  }, [editMode]);

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Travis Howard" src="https://i.stack.imgur.com/l60Hf.png" />
      </ListItemAvatar>

      <ListItemText
        primary={
          <React.Fragment>
            <TextEdit
              firstVal={props.userInfo.name}
              ref={nameRef}
              label={"name"}
            />
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <TextEdit
              firstVal={props.userInfo.email}
              ref={emailRef}
              label={"email"}
            />
          </React.Fragment>
        }
      />

      <ListItemIcon>
        {(editMode) && (
          <IconButton
            color="error"
            onClick={HandleCloseEditClick}
            sx={{ m: 0, position: "relative" }}
          >
            <Fab color="error" size="small">
              <ClearIcon />
            </Fab>
          </IconButton>
        )}

        <IconButton
          color="info"
          onClick={HandleOpenEditClick}
          sx={{ m: 0, position: "relative" }}
        >
          <Fab color="info" size="small" disabled={disableEdit}>
            {(editMode) ? <CheckIcon /> : <EditIcon />}
          </Fab>
        </IconButton>

        <IconButton sx={{ m: 0, position: "relative" }}>
          <Fab
            disabled={sendMailSuccess}
            aria-label="save"
            color="warning"
            sx={buttonSx}
            onClick={handleSendMailClick}
            size="small"
          >
            {sendMailSuccess ? <CheckIcon /> : <EmailIcon />}
          </Fab>
          {sending && (
            <CircularProgress
              size={52}
              sx={{
                color: green[500],
                position: "absolute",
                top: 3,
                left: 2,
                zIndex: 1,
              }}
            />
          )}
        </IconButton>
      </ListItemIcon>
    </ListItem>
  );
};

export default UserInfo;
