import React from "react";

// Emotion
import { css } from "@emotion/css";

// React MaterialUI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

// grapQL query hooks
import useGetContact from "../hooks/useGetContact";
import useEditContact from "../hooks/useEditContact";
import useEditPhoneNumber from "../hooks/useEditPhoneNumber";

// My components
import SnackbarItem from "./SnackbarItem";

const formLabel = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

const FormEditDialog: React.FC<FormEditDialogProp> = (
  props: FormEditDialogProp
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
  const [inputValueListPhoneNumber, setInputValueListPhoneNumber] =
    React.useState<Array<FormPhoneNumber>>([]);
  const [phoneNumbers, setPhoneNumbers] = React.useState<Array<PhoneNumber>>(
    []
  );
  const [oldNumbers, setOldNumbers] = React.useState<Array<PhoneNumber>>(
    props.item.phones
  );
  const [snackbarConfiguration, setSnackbarConfiguration] =
    React.useState<SnackbarConfigurationType>(configurationSnackbar);

  const { loading, error, data } = useGetContact({
    id: props.item.id,
  });

  const doEditContact = useEditContact();
  const doEditPhoneNumber = useEditPhoneNumber();

  React.useEffect(() => {
    let numbers: Array<FormPhoneNumber> = [];
    if (data && data.contact_by_pk) {
      data.contact_by_pk.phones.forEach((item: PhoneNumber, index: number) => {
        numbers.push({
          id: index + 1,
          number: item.number,
        });
      });

      setInputValueListPhoneNumber(numbers);
      setFirstName(data.contact_by_pk.first_name);
      setLastName(data.contact_by_pk.last_name);
    }

    console.log("Form Edit Dialog");
  }, [data]);

  React.useEffect(() => {
    let phoneValues: PhoneNumber[] = [];
    if (inputValueListPhoneNumber.length > 0) {
      phoneValues = inputValueListPhoneNumber.map((item) => ({
        number: item.number,
      }));
    }
    setPhoneNumbers(phoneValues);
  }, [inputValueListPhoneNumber]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleSetInput = (value: string, index: number) => {
    const numbers = [...inputValueListPhoneNumber];
    numbers[index].number = value;
    setInputValueListPhoneNumber(numbers);
  };

  const handleSubmit = async () => {
    const isFirstNameInvalid: boolean = containsSpecialCharacters(firstName);
    const isLastNameInvalid: boolean = containsSpecialCharacters(lastName);

    if (isFirstNameInvalid && !isLastNameInvalid) {
      alert("First Name does not allow to use special characters");
      return;
    }

    if (!isFirstNameInvalid && isLastNameInvalid) {
      alert("Last Name does not allow to use special characters");
      return;
    }

    if (isFirstNameInvalid && isLastNameInvalid) {
      alert(
        "First Name and Last Name does not allow to use special characters"
      );
      return;
    }

    try {
      await doEditContact({
        id: props.item.id,
        first_name: firstName,
        last_name: lastName,
      });

      for (const index in oldNumbers) {
        const oldNumber = oldNumbers[index];
        try {
          await doEditPhoneNumber({
            number: oldNumber.number,
            contact_id: props.item.id,
            new_phone_number: phoneNumbers[index].number,
          });
        } catch (error) {
          console.log("Failed to update number in contact ", error);
          setSnackbarConfiguration((state) => ({
            ...state,
            isOpen: true,
            type: "error",
            message: "Failed to update number in contact",
          }));
        }
      }

      props.onSubmit();
    } catch (error) {
      console.log("Failed to update contact ", error);
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "error",
        message: "Failed to update contact",
      }));
    }

    // setEditContact();
    // setEditPhoneNumber();

    // alert("disimpan");
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  // const setEditPhoneNumber = () => {
  //   oldNumbers.forEach((old: PhoneNumber, index: number) => {
  //     doEditPhoneNumber({
  //       number: old.number,
  //       contact_id: props.item.id,
  //       new_phone_number: phoneNumbers[index].number,
  //     });
  //   });
  // };

  // const setEditContact = () => {
  //   doEditContact({
  //     id: props.item.id,
  //     first_name: firstName,
  //     last_name: lastName,
  //   });
  // };

  const containsSpecialCharacters = (value: string) => {
    const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (value.match(specialCharacters)) {
      return true;
    } else {
      return false;
    }
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
        <DialogTitle id="alert-dialog-title">Edit Contact</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container rowSpacing={3}>
              <Grid item xs={12}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={6}>
                    <span>First Name</span>
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <span>Last Name</span>
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div className={formLabel}>
                  <div>Phone Number</div>
                </div>
                {inputValueListPhoneNumber.map((item, index) => (
                  <>
                    <TextField
                      sx={index === 0 ? {} : { marginTop: "1rem" }}
                      key={index}
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      placeholder={`Phone Number ${item.id}`}
                      value={inputValueListPhoneNumber[index].number}
                      onChange={(e) => handleSetInput(e.target.value, index)}
                    />
                  </>
                ))}
              </Grid>
            </Grid>
          </DialogContentText>
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

export default FormEditDialog;
