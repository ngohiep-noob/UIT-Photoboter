import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TextField, Typography } from "@mui/material";

const TextEditor = (props, ref) => {
  const [edit, toggleEdit] = useState(false);
  const [data, setData] = useState(props.firstVal);

  useImperativeHandle(ref, () => ({
    toggleEdit: (value) => toggleEdit(value),
    getData: () => data,
    setData: (val) => setData(val),
  }));
  
  const HandleChange = (e) => {
    setData(e.target.value);
  };

  return (
    <>
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
    </>
  );
};


export default forwardRef(TextEditor);
