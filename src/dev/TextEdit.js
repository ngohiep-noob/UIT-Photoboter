import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { TextField, Typography } from "@mui/material";

const TextEditor = (props, ref) => {
  const [edit, toggleEdit] = useState(false);
<<<<<<< HEAD
  const [data, setData] = useState(props.firstVal); //Name 

  useImperativeHandle(ref, () => ({
    toggleEdit: (val) => toggleEdit(!edit),
    getData: () => data,
=======
  const [data, setData] = useState(props.firstVal);

  useImperativeHandle(ref, () => ({
    toggleEdit: (value) => toggleEdit(value),
    getData: () => data,
    setData: (val) => setData(val),
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
  }));
  
  const HandleChange = (e) => {
    setData(e.target.value);
<<<<<<< HEAD
    
  }
=======
  };
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6

  

  // if click edit ~ change icon to save 
  return (
    <>
<<<<<<< HEAD
      {edit ? (<TextField label="name" variant="standard" onChange={HandleChange} value={data}/>)  
            : (<Typography variant="body1"> {data} </Typography>)
      }
=======
      {edit ? (
        <TextField
          label={props.label}
          onChange={HandleChange}
          size='small'
          value={data}
          sx={{my: 1}}
        />
      ) : (
        <Typography
          variant={props.label === "Name" ? "body1" : "caption"}
          color={props.label === "Name" ? "text.primary" : "text.secondary"}
          sx={{maxWidth: '400px'}}
        >
          {data}
        </Typography>
      )}
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
    </>
  );
};


export default forwardRef(TextEditor);
