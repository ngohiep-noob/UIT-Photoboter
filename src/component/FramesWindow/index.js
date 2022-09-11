import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useContext,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  ImageList,
  ImageListItem,
} from "@mui/material";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ProcessContextDispatch } from "../../App";
import { FRAMES_PER_ROW } from "../../constant/constants";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const FramesWindow = ({ SetBannerUrl }, ref) => {
  const [open, setOpen] = useState(false);
  const bannerList = useRef([]);
  const dispatch = useContext(ProcessContextDispatch);

  useEffect(() => {
    fetch(process.env.REACT_APP_IMG_URL)
      .then((res) => res.json())
      .then((res) => {
        bannerList.current = res.files;
        console.log("banners", bannerList.current);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const HandleClose = () => {
    setOpen(false);
    dispatch.setStopCheckHand(false);
  };

  const HandleOpen = () => {
    setOpen(true);
  };

  const HandleSelectImage = (e) => {
    SetBannerUrl(e.target.alt);
    HandleClose();
  };

  useImperativeHandle(ref, () => ({
    Open: HandleOpen,
    Close: HandleClose,
  }));

  return (
    <>
      <BootstrapDialog
        open={open}
        onClose={HandleClose}
        maxWidth={"md"}
        fullWidth={true}
        sx={{ borderRadius: "20px" }}
      >
        <BootstrapDialogTitle onClose={HandleClose}>
          <b>{"Toàn khung hình đẹp, hãy chọn một cái nhé😊"}</b>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <ImageList
            sx={{
              width: 189 * FRAMES_PER_ROW,
              height:
                Math.ceil(bannerList.current.length / FRAMES_PER_ROW) * 189,
              margin: "0 auto",
            }}
            cols={FRAMES_PER_ROW}
            rowHeight={183}
          >
            {bannerList.current.map((imgName) => (
              <ImageListItem key={imgName}>
                <img
                  src={process.env.REACT_APP_IMG_URL + imgName}
                  alt={imgName}
                  loading="lazy"
                  onClick={HandleSelectImage}
                  crossOrigin
                  width={183}
                  height={183}
                  style={{ objectFit: "unset" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default forwardRef(FramesWindow);
