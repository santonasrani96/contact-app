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
  const [state, setState] = React.useState<FormAddDialogState>({
    open: props.isOpen,
    nextId: 0,
    firstName: "",
    lastName: "",
    inputValuePhoneNumber: "",
    inputNewValueListPhoneNumber: [],
    phoneNumbers: [], //phone
  });

  React.useEffect(() => {
    const phoneValues: Array<PhoneNumber> = [];

    phoneValues.push({
      number: state.inputValuePhoneNumber,
    });

    state.inputNewValueListPhoneNumber.forEach((item) => {
      phoneValues.push({
        number: item.number,
      });
    });

    setState((state) => {
      return {
        ...state,
        phoneNumbers: phoneValues.map((item) => ({
          number: item.number,
        })),
      };
    });

    // setPhone(
    //   phoneValues.map((item) => ({
    //     number: item.number,
    //   }))
    // );
    console.log("Form Add Dialog");
  }, [state.inputNewValueListPhoneNumber, state.inputValuePhoneNumber]);

  const doAddContact = useAddContactWithPhones();

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const increasePhoneNumber = () => {
    const currentId: number = state.nextId;
    const idAdded: number = currentId + 1;
    setState({ ...state, nextId: idAdded });

    const data: FormPhoneNumber = {
      id: state.nextId,
      number: "",
    };

    //   setNumbers((oldVal) => [...oldVal, data]);
    setState((state) => {
      return {
        ...state,
        inputNewValueListPhoneNumber:
          state.inputNewValueListPhoneNumber.concat(data),
      };
    });
  };

  const decreasePhoneNumber = (dataNumber: FormPhoneNumber) => {
    if (state.inputNewValueListPhoneNumber.length <= 0) {
      return;
    }

    const newNumber = [
      ...state.inputNewValueListPhoneNumber.slice(0, dataNumber.id),
      ...state.inputNewValueListPhoneNumber.slice(dataNumber.id + 1),
    ];
    setState({ ...state, inputNewValueListPhoneNumber: [] });
    setState((state) => {
      return {
        ...state,
        inputNewValueListPhoneNumber:
          state.inputNewValueListPhoneNumber.concat(newNumber),
      };
    });
  };

  const handleSetInput = (value: string, index: number) => {
    const inputNumber = [...state.inputNewValueListPhoneNumber];
    inputNumber[index].number = value;
    setState((state) => {
      return {
        ...state,
        inputNewValueListPhoneNumber: inputNumber,
      };
    });
    // setNumbers(inputNumber);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    // e.preventDefault();
    const isFirstNameInvalid: boolean = containsSpecialCharacters(
      state.firstName
    );
    const isLastNameInvalid: boolean = containsSpecialCharacters(
      state.lastName
    );

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
      first_name: state.firstName,
      last_name: state.lastName,
      phones: state.phoneNumbers,
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
      open={state.open}
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
                    value={state.firstName}
                    onChange={(e) =>
                      setState({ ...state, firstName: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <span>Last Name</span>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    value={state.lastName}
                    onChange={(e) =>
                      setState({ ...state, lastName: e.target.value })
                    }
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
                value={state.inputValuePhoneNumber}
                onChange={(e) =>
                  setState({ ...state, inputValuePhoneNumber: e.target.value })
                }
              />
              <Stack direction="column" spacing={2}>
                {state.inputNewValueListPhoneNumber.map((item, index) => (
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
                      value={state.inputNewValueListPhoneNumber[index].number}
                      onChange={(e) => handleSetInput(e.target.value, index)}
                      // onChange={(e) => setPhoneNumber(e.target.value)}
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
        <Button onClick={(e) => handleSubmit(e)} autoFocus variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormAddDialog;
