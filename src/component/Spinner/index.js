import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Spinner = (props, ref) => {
  const [show, setShowSpinner] = useState(true);

  useImperativeHandle(ref, () => ({
    toggleSpinner: () => setShowSpinner(!show),
  }));

  return (
    <Backdrop
      open={show}
      sx={{
        color: "#000",
        background: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" size={60} />
    </Backdrop>
  );
};

export default forwardRef(Spinner);
