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

const formLabel = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

const FormEditDialog: React.FC<FormEditDialogProp> = (
  props: FormEditDialogProp
) => {
  const [state, setState] = React.useState<FormEditDialogState>({
    open: props.isOpen,
    firstName: "",
    lastName: "",
    inputValueListPhoneNumber: [], //numbers
    phoneNumbers: [], //phone
    oldNumbers: props.item.phones,
  });

  const { loading, error, data } = useGetContact({
    id: props.item.id,
  });

  const doEditContact = useEditContact();
  const doEditPhoneNumber = useEditPhoneNumber();

  // React.useEffect(() => {
  //   const phoneValues = state.inputValueListPhoneNumber.map((item) => ({
  //     number: item.number,
  //   }));

  //   setState({ ...state, phoneNumbers: phoneValues });
  // }, [state]);

  React.useEffect(() => {
    // setState((state) => {
    //   return {
    //     ...state,
    //     inputValueListPhoneNumber: [],
    //   };
    // });
    // setState({ ...state, firstName: "" });
    // setState({ ...state, lastName: "" });
    setState((prevState) => {
      if (data && data.contact_by_pk) {
        // setState({ ...state, firstName: data.contact_by_pk.first_name });
        // setState({ ...state, lastName: data.contact_by_pk.last_name });
        const numbers: Array<FormPhoneNumber> = [];
        data.contact_by_pk.phones.forEach(
          (item: PhoneNumber, index: number) => {
            numbers.push({
              id: index + 1,
              number: item.number,
            });
          }
        );

        const phoneValues = state.inputValueListPhoneNumber.map((item) => ({
          number: item.number,
        }));

        return {
          ...prevState,
          inputValueListPhoneNumber: numbers,
          firstName: data.contact_by_pk.first_name,
          lastName: data.contact_by_pk.last_name,
          phoneNumbers: phoneValues,
        };
        // setState((state) => {
        //   return {
        //     ...state,
        //     inputValueListPhoneNumber: numbers,
        //   };
        // });
      }

      return prevState;
    });
    // if (data && data.contact_by_pk) {
    //   setState({ ...state, firstName: data.contact_by_pk.first_name });
    //   setState({ ...state, lastName: data.contact_by_pk.last_name });
    //   const numbers: Array<FormPhoneNumber> = [];

    //   data.contact_by_pk.phones.forEach((item: PhoneNumber, index: number) => {
    //     numbers.push({
    //       id: index + 1,
    //       number: item.number,
    //     });
    //   });
    //   setState((state) => {
    //     return {
    //       ...state,
    //       inputValueListPhoneNumber: numbers,
    //     };
    //   });
    // }

    console.log("Form Edit Dialog");

    // const phoneValues = state.inputValueListPhoneNumber.map((item) => ({
    //   number: item.number,
    // }));

    // setState((state) => {
    //   return {
    //     ...state,
    //     phoneNumbers: phoneValues,
    //   };
    // });
  }, [data, props.mode, state]);

  const handleClose = () => {
    setState({ ...state, open: false });
    props.onClose();
  };

  const handleSetInput = (value: string, index: number) => {
    const numbers = [...state.inputValueListPhoneNumber];
    numbers[index].number = value;
    setState((state) => {
      return {
        ...state,
        inputValueListPhoneNumber: numbers,
      };
    });
  };

  const handleSubmit = () => {
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

    setEditContact();
    setEditPhoneNumber();

    alert("disimpan");
  };

  const setEditPhoneNumber = () => {
    state.oldNumbers.forEach((old: PhoneNumber, index: number) => {
      doEditPhoneNumber({
        number: old.number,
        contact_id: props.item.id,
        new_phone_number: state.phoneNumbers[index].number,
      });
    });
  };

  const setEditContact = () => {
    doEditContact({
      id: props.item.id,
      first_name: state.firstName,
      last_name: state.lastName,
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
    <>
      <Dialog
        open={state.open}
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
                </div>
                {state.inputValueListPhoneNumber.map((item, index) => (
                  <>
                    <TextField
                      sx={index === 0 ? {} : { marginTop: "1rem" }}
                      key={index}
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      placeholder={`Phone Number ${item.id}`}
                      value={state.inputValueListPhoneNumber[index].number}
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
    </>
  );
};

export default FormEditDialog;
