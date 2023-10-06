import React from "react";

// MaterialUI
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarItem: React.FC<SnackbarProp> = (props: SnackbarProp) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    props.onClose();
  };
  return (
    <Snackbar
      open={props.isOpen}
      autoHideDuration={3000}
      TransitionComponent={SlideTransition}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={props.type as AlertColor}
        sx={{ width: "100%" }}
      >
        {props.message ? props.message : "This is a message"}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarItem;
