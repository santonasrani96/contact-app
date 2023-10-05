import React from "react";

// Emotion
import { css } from "@emotion/css";

// MaterialUI Components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const dialogTitle = css`
  background-color: #4267b2;
  color: white;
`;

const dialogBody = css`
  padding: 1rem 0;
`;

// COMPONENT HERE
const ConfirmDialog: React.FC<ConfirmDialogProp> = (
  props: ConfirmDialogProp
) => {
  const [open, setOpen] = React.useState(props.isOpen);

  const handleClose = () => {
    setOpen(false);
  };

  const handleYes = () => {
    props.onYes();
    handleClose();
  };

  const handleNo = () => {
    props.onNo();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" className={dialogTitle}>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className={dialogBody}
          >
            {props.message ? props.message : "Are you sure?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>No</Button>
          <Button variant="contained" onClick={handleYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
