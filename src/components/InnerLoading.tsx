import React from "react";

// MaterialUI
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const InnerLoading: React.FC<InnerLoadingProp> = (props: InnerLoadingProp) => {
  const [open, setOpen] = React.useState(props.isOpen);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default InnerLoading;
