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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

// grapQL query hooks
import useAddContactWithPhones from "../hooks/useAddContactWithPhones";

const formLabel = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

const FormAddDialog: React.FC<FormAddDialogProp> = (
  props: FormAddDialogProp
) => {
  const [open, setOpen] = React.useState<boolean>(props.isOpen);
  const [nextId, setNextId] = React.useState<number>(0);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [inputValuePhoneNumber, setInputValuePhoneNumber] =
    React.useState<string>("");
  const [inputNewValueListPhoneNumber, setInputNewValueListPhoneNumber] =
    React.useState<Array<FormPhoneNumber>>([]);
  const [phoneNumbers, setPhoneNumbers] = React.useState<Array<PhoneNumber>>(
    []
  );

  React.useEffect(() => {
    const phoneValues: Array<PhoneNumber> = [];

    phoneValues.push({
      number: inputValuePhoneNumber,
    });

    inputNewValueListPhoneNumber.forEach((item) => {
      phoneValues.push({
        number: item.number,
      });
    });

    setPhoneNumbers(
      phoneValues.map((item) => ({
        number: item.number,
      }))
    );

    console.log("Form Add Dialog");
  }, [inputNewValueListPhoneNumber, inputValuePhoneNumber]);

  const doAddContact = useAddContactWithPhones();

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const increasePhoneNumber = () => {
    const currentId: number = nextId;
    const idAdded: number = currentId + 1;
    setNextId(idAdded);

    const data: FormPhoneNumber = {
      id: nextId,
      number: "",
    };

    setInputNewValueListPhoneNumber((oldVal) => [...oldVal, data]);
  };

  const decreasePhoneNumber = (dataNumber: FormPhoneNumber) => {
    if (inputNewValueListPhoneNumber.length <= 0) {
      return;
    }

    const newNumber = [
      ...inputNewValueListPhoneNumber.slice(0, dataNumber.id),
      ...inputNewValueListPhoneNumber.slice(dataNumber.id + 1),
    ];
    setInputNewValueListPhoneNumber([]);
    setInputNewValueListPhoneNumber(newNumber);
  };

  const handleSetInput = (value: string, index: number) => {
    const inputNumber = [...inputNewValueListPhoneNumber];
    inputNumber[index].number = value;
    setInputNewValueListPhoneNumber(inputNumber);
  };

  const handleSubmit = () => {
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

    createContact();
  };

  const createContact = () => {
    doAddContact({
      first_name: firstName,
      last_name: lastName,
      phones: phoneNumbers,
    });
  };

  const containsSpecialCharacters = (value: string) => {
    const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (value.match(specialCharacters)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Add New Contact</DialogTitle>
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
                <div>
                  <IconButton color="primary" onClick={increasePhoneNumber}>
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
              <TextField
                id="outlined-basic"
                fullWidth
                variant="outlined"
                value={inputValuePhoneNumber}
                onChange={(e) => setInputValuePhoneNumber(e.target.value)}
              />
              <Stack direction="column" spacing={2}>
                {inputNewValueListPhoneNumber.map((item, index) => (
                  <>
                    <IconButton
                      key={index}
                      color="primary"
                      onClick={() => decreasePhoneNumber(item)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      key={index}
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      placeholder={`Phone Number ${item.id + 1}`}
                      value={inputNewValueListPhoneNumber[index].number}
                      onChange={(e) => handleSetInput(e.target.value, index)}
                    />
                  </>
                ))}
              </Stack>
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
  );
};

export default FormAddDialog;
