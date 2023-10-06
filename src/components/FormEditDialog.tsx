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

// grapQL query hooks
import useGetContact from "../hooks/useGetContact";
import useEditContact from "../hooks/useEditContact";
import useEditPhoneNumber from "../hooks/useEditPhoneNumber";
import useAddContactWithPhones from "../hooks/useAddContactWithPhones";
import useGetContacts from "../hooks/useGetContacts";

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
  const [oldFirstName, setOldFirstName] = React.useState<string>("");
  const [oldLastName, setOldLastName] = React.useState<string>("");
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

  const { data } = useGetContact({
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
      setOldFirstName(data.contact_by_pk.first_name);
      setOldLastName(data.contact_by_pk.last_name);
    } else {
      props.item.phones.forEach((item: PhoneNumber, index: number) => {
        numbers.push({
          id: index + 1,
          number: item.number,
        });
      });

      setInputValueListPhoneNumber(numbers);
      setFirstName(props.item.first_name);
      setLastName(props.item.last_name);
      setOldFirstName(props.item.first_name);
      setOldLastName(props.item.last_name);
    }
  }, [data, props]);

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

  const {
    loading,
    data: _data,
    refetch,
  } = useGetContacts({
    limit: 10,
    offset: null,
    first_name: firstName,
    last_name: lastName,
  });

  const doAddContact = useAddContactWithPhones();

  const handleSetInput = (value: string, index: number) => {
    const numbers = [...inputValueListPhoneNumber];
    numbers[index].number = value;
    setInputValueListPhoneNumber(numbers);
  };

  const checkContactNameExists = (): boolean => {
    let result = false;
    if (firstName !== oldFirstName || lastName !== oldLastName) {
      refetch();

      if (!loading && _data && _data.contact.length > 0) {
        result = true;
      } else {
        result = false;
      }
    }

    return result;
  };

  const handleSubmit = async () => {
    updateContactFavorite();
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
      if (data && data.contact_by_pk) {
        await doEditContact({
          id: props.item.id,
          first_name: firstName,
          last_name: lastName,
        });

        for (const index in oldNumbers) {
          const oldNumber = oldNumbers[index];
          if (phoneNumbers[index].number) {
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
        }
      }

      props.onSubmit("edit");
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
        favorites[indexToUpdate].first_name = firstName;
        favorites[indexToUpdate].last_name = lastName;
        favorites[indexToUpdate].phones = phoneNumbers;
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
          Edit Contact
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
              </div>
              {inputValueListPhoneNumber.map((item, index) => (
                <>
                  <TextField
                    sx={index === 0 ? {} : { marginTop: "1rem" }}
                    key={index}
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    value={inputValueListPhoneNumber[index].number}
                    onChange={(e) => handleSetInput(e.target.value, index)}
                  />
                </>
              ))}
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

export default FormEditDialog;
