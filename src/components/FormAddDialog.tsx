import React from "react";
import { containsSpecialCharacters } from "../libraries/validator";

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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

// grapQL query hooks
import useAddContactWithPhones from "../hooks/useAddContactWithPhones";
import useGetContacts from "../hooks/useGetContacts";

// My components
import SnackbarItem from "./SnackbarItem";

const removeButton = css`
  padding: 1rem 0 0 0;
  display: flex;
  justify-content: end;
`;

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

const FormAddDialog: React.FC<FormAddDialogProp> = (
  props: FormAddDialogProp
) => {
  const configurationSnackbar: SnackbarConfigurationType = {
    isOpen: false,
    type: "success",
    duration: 3000,
    message: "Success",
  };

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
  const [snackbarConfiguration, setSnackbarConfiguration] =
    React.useState<SnackbarConfigurationType>(configurationSnackbar);
  const [errorInputFirstName, setErrorInputFirstName] =
    React.useState<boolean>(false);
  const [errorInputLastName, setErrorInputLastName] =
    React.useState<boolean>(false);
  const [errorInputPhoneNumber, setErrorInputPhoneNumber] =
    React.useState<boolean>(false);
  const [errorMessageInputFirstName, setErrorMessageInputFirstName] =
    React.useState<string>("");
  const [errorMessageInputLastName, setErrorMessageInputLastName] =
    React.useState<string>("");
  const [errorMessageInputPhoneNumber, setErrorMessageInputPhoneNumber] =
    React.useState<string>("");

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

    const currentNumbers = [...inputNewValueListPhoneNumber];
    const indexToRemove = currentNumbers.findIndex(
      (item) => item.id === dataNumber.id
    );

    if (indexToRemove !== -1) {
      currentNumbers.splice(indexToRemove, 1);

      setInputNewValueListPhoneNumber(currentNumbers);
    }
  };

  const handleSetInput = (value: string, index: number) => {
    const inputNumber = [...inputNewValueListPhoneNumber];
    inputNumber[index].number = value;
    setInputNewValueListPhoneNumber(inputNumber);
  };

  const { loading, error, data, refetch } = useGetContacts({
    limit: 10,
    offset: null,
    first_name: firstName,
    last_name: lastName,
  });

  const checkContactNameExists = (): boolean => {
    refetch();

    if (!loading && data && data.contact.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    const isFirstNameInvalid: boolean = containsSpecialCharacters(firstName);
    const isLastNameInvalid: boolean = containsSpecialCharacters(lastName);

    if (!firstName) {
      setErrorInputFirstName(true);
      setErrorMessageInputFirstName("Required");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "First Name is required",
      }));

      return;
    }

    if (!lastName) {
      setErrorInputLastName(true);
      setErrorMessageInputLastName("Required");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "Last Name is required",
      }));

      return;
    }

    if (!inputValuePhoneNumber) {
      setErrorInputPhoneNumber(true);
      setErrorMessageInputPhoneNumber("Required");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "Phone Number is required",
      }));

      return;
    }

    if (isFirstNameInvalid && !isLastNameInvalid) {
      setErrorInputFirstName(true);
      setErrorMessageInputFirstName("Contains special characters");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "First Name does not allow to use special characters",
      }));
      return;
    }

    if (!isFirstNameInvalid && isLastNameInvalid) {
      setErrorInputLastName(true);
      setErrorMessageInputLastName("Contains special characters");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "Last Name does not allow to use special characters",
      }));
      return;
    }

    if (isFirstNameInvalid && isLastNameInvalid) {
      setErrorInputFirstName(true);
      setErrorMessageInputFirstName("Contains special characters");
      setErrorInputLastName(true);
      setErrorMessageInputLastName("Contains special characters");
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message:
          "First Name and Last Name does not allow to use special characters",
      }));
      return;
    }

    const isNamesExists: boolean = checkContactNameExists();
    if (isNamesExists) {
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "warning",
        message: "Contact already exists",
      }));
      return;
    }

    try {
      const numberToInsert: PhoneNumber[] = [];
      phoneNumbers.forEach((phoneNumber: PhoneNumber) => {
        if (phoneNumber.number) {
          numberToInsert.push({
            number: phoneNumber.number,
          });
        }
      });
      await doAddContact({
        first_name: firstName,
        last_name: lastName,
        phones: numberToInsert,
      });

      props.onSubmit();
    } catch (error) {
      console.log("Failed to create contact ", error);
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "error",
        message: "Failed to create contact",
      }));
    }
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
          Add New Contact
        </DialogTitle>
        <DialogContent className={dialogBody}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item xs={6}>
                  <span>First Name</span>
                  <TextField
                    error={errorInputFirstName}
                    helperText={errorMessageInputFirstName}
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
                    error={errorInputLastName}
                    helperText={errorMessageInputLastName}
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
                error={errorInputPhoneNumber}
                helperText={errorMessageInputPhoneNumber}
                id="outlined-basic"
                fullWidth
                variant="outlined"
                value={inputValuePhoneNumber}
                onChange={(e) => setInputValuePhoneNumber(e.target.value)}
              />
              <Stack direction="column" spacing={1}>
                {inputNewValueListPhoneNumber.map((item, index) => (
                  <>
                    <div className={removeButton}>
                      <IconButton
                        key={index}
                        color="error"
                        onClick={() => decreasePhoneNumber(item)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </div>
                    <TextField
                      key={index}
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      value={inputNewValueListPhoneNumber[index].number}
                      onChange={(e) => handleSetInput(e.target.value, index)}
                    />
                  </>
                ))}
              </Stack>
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

export default FormAddDialog;
