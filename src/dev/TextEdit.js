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
          variant="standard"
          onChange={HandleChange}
          value={data}
        />
      ) : (
        <Typography
          variant={props.label === "name" ? "body1" : "caption"}
          color={props.label === "name" ? "" : "text.primary"}
        >
          {data}
        </Typography>
      )}
    </>
  );
};

export default forwardRef(TextEditor);
