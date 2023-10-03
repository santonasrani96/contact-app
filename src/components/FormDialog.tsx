import React from "react";

// dialog components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import { css } from "@emotion/css";
import { useQuery, gql, useMutation } from "@apollo/client";

const EDIT_CONTACT = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

const EDIT_PHONE_NUMBER = gql`
  mutation EditPhoneNumber(
    $pk_columns: phone_pk_columns_input!
    $new_phone_number: String!
  ) {
    update_phone_by_pk(
      pk_columns: $pk_columns
      _set: { number: $new_phone_number }
    ) {
      contact {
        id
        last_name
        first_name
        created_at
        phones {
          number
        }
      }
    }
  }
`;

const GET_CONTACT_BY_ID = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;

const formLabel = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

type FormDialogProps = {
  isOpen: boolean;
  onClose: Function;
  mode: string;
  item: ContactItem;
};

type PhoneItem = {
  number: string;
};

type ContactItem = {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: Array<PhoneItem>;
};

type PhoneNumber = {
  number: string;
};

type FormPhoneNumber = {
  id: number;
  number: string;
};

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const [open, setOpen] = React.useState(props.isOpen);
  const { loading, error, data } = useQuery(GET_CONTACT_BY_ID, {
    variables: { id: props.item.id },
  });
  const [editContact] = useMutation(EDIT_CONTACT);
  const [editPhoneNumber] = useMutation(EDIT_PHONE_NUMBER);

  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [numbers, setNumbers] = React.useState<FormPhoneNumber[]>([]);
  const [phone, setPhone] = React.useState<PhoneNumber[]>([]);
  const [oldNumber, setOldNumber] = React.useState<PhoneNumber[]>(
    props.item.phones
  );

  const [dialogTitle, setDialogTitle] = React.useState<string>("");

  React.useEffect(() => {
    setNumbers([]);
    setFirstName("");
    setLastName("");
    if (data && data.contact_by_pk) {
      setFirstName(data.contact_by_pk.first_name);
      setLastName(data.contact_by_pk.last_name);

      data.contact_by_pk.phones.forEach((item: PhoneNumber, index: number) => {
        setNumbers((oldVal) => [
          ...oldVal,
          {
            id: index + 1,
            number: item.number,
          },
        ]);
      });
    }

    if (props.mode === "edit") {
      console.log("ts");
      setDialogTitle("Edit Contact");
    } else {
      setDialogTitle("Add New Contact");
    }
  }, [data, props.mode]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleSetInput = (value: string, index: number) => {
    const inputNumber = [...numbers];
    inputNumber[index].number = value;
    setNumbers(inputNumber);
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

    setEditContact();
    setEditPhoneNumber();

    alert("disimpan");
  };

  const setEditPhoneNumber = () => {
    oldNumber.forEach((old: PhoneNumber, index: number) => {
      editPhoneNumber({
        variables: {
          pk_columns: {
            number: old.number,
            contact_id: props.item.id,
          },
          new_phone_number: phone[index].number,
        },
      });
    });
  };

  const setEditContact = () => {
    editContact({
      variables: {
        id: props.item.id,
        _set: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
  };

  React.useEffect(() => {
    const phoneValues = numbers.map((item) => ({
      number: item.number,
    }));

    setPhone(phoneValues);
  }, [numbers]);

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
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
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
                {numbers.map((item, index) => (
                  <>
                    <TextField
                      sx={index === 0 ? {} : { marginTop: "1rem" }}
                      key={index}
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      placeholder={`Phone Number ${item.id}`}
                      value={numbers[index].number}
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

export default FormDialog;
