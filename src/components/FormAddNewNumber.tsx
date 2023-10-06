import React from "react";

// Emotion
import { css } from "@emotion/css";

// React MaterialUI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

// grapQL query hooks
import useGetContact from "../hooks/useGetContact";
import useAddNumberToContact from "../hooks/useAddNumberToContact";

// My components
import SnackbarItem from "./SnackbarItem";

const formLabel = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

const dialogTitle = css`
  background-color: #4267b2;
  color: white;
`;

const dialogBody = css`
  margin: 2rem 0;
`;

const FormAddNewNumber: React.FC<FormAddNewNumberProp> = (
  props: FormAddNewNumberProp
) => {
  const configurationSnackbar: SnackbarConfigurationType = {
    isOpen: false,
    type: "success",
    duration: 3000,
    message: "Success",
  };

  const [open, setOpen] = React.useState<boolean>(props.isOpen);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [snackbarConfiguration, setSnackbarConfiguration] =
    React.useState<SnackbarConfigurationType>(configurationSnackbar);
  const [errorPhoneNumber, setErrorPhoneNumber] =
    React.useState<boolean>(false);
  const [errorMessagePhoneNumber, setErrorMessagePhoneNumber] =
    React.useState<string>("");

  const { data } = useGetContact({
    id: props.item.id,
  });

  React.useEffect(() => {
    if (data && data.contact_by_pk) {
      setFirstName(data.contact_by_pk.first_name);
      setLastName(data.contact_by_pk.last_name);
    } else {
      setFirstName(props.item.first_name);
      setLastName(props.item.last_name);
    }
  }, [data, props]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const doAddNewNumberToContact = useAddNumberToContact();

  const handleSubmit = async () => {
    updateContactFavorite();

    if (!phoneNumber) {
      setErrorPhoneNumber(true);
      setErrorMessagePhoneNumber("Required");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "Phone Number is required",
      }));
      return;
    }

    try {
      if (data && data.contact_by_pk) {
        await doAddNewNumberToContact({
          contact_id: props.item.id,
          phone_number: phoneNumber,
        });
      }

      props.onSubmit("add_new_number");
    } catch (error) {
      console.log("Failed to update contact ", error);
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "error",
        message: "Failed to update contact",
      }));
    }
  };

  const updateContactFavorite = () => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];
    if (favorites.length > 0) {
      const indexToUpdate = favorites.findIndex(
        (favorite: ContactItem) => favorite.id === props.item.id
      );

      if (indexToUpdate !== -1) {
        favorites[indexToUpdate].phones.push({
          number: phoneNumber,
        });
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" className={dialogTitle}>
          Add New Number
        </DialogTitle>
        <DialogContent className={dialogBody}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item xs={6}>
                  <span>First Name</span>
                  <TextField
                    disabled
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    value={firstName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <span>Last Name</span>
                  <TextField
                    disabled
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    value={lastName}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className={formLabel}>
                <div>Phone Number</div>
              </div>
              <TextField
                error={errorPhoneNumber}
                helperText={errorMessagePhoneNumber}
                sx={{ marginTop: "1rem" }}
                id="outlined-basic"
                fullWidth
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {!snackbarConfiguration.isOpen ? (
        ""
      ) : (
        <SnackbarItem
          isOpen={snackbarConfiguration.isOpen}
          message={snackbarConfiguration.message}
          type={snackbarConfiguration.type}
          onClose={handleCloseSnackbar}
        />
      )}
    </>
  );
};

export default FormAddNewNumber;
