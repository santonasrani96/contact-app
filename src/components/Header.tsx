import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import { useMutation, gql } from "@apollo/client";

const ADD_CONTACT_WITH_PHONES = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

const titlePage = css`
  font-size: 2rem;
  font-weight: 500;
  color: #6c757d;
`;

const Line = styled.hr`
  color: #6c757d;
  width: 100%;
  margin: 2rem 0;
`;

const headerPage = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

const formLabel = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

type PropType = {
  title: string;
  children?: React.ReactNode;
};

type FormPhoneNumber = {
  id: number;
  number: string;
};

type PhoneNumber = {
  number: string;
};

const Header: FC<PropType> = (props: PropType) => {
  const [open, setOpen] = React.useState(false);
  const [nextId, setNextId] = React.useState(0);
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [numbers, setNumbers] = React.useState<FormPhoneNumber[]>([]);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<PhoneNumber[]>([]);

  const [createContact, { loading, error, data }] = useMutation(
    ADD_CONTACT_WITH_PHONES,
    {
      variables: {
        first_name: firstName,
        last_name: lastName,
        phones: phone,
      },
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const increasePhoneNumber = () => {
    const currentId: number = nextId;
    const idAdded: number = currentId + 1;
    setNextId(idAdded);

    const data: FormPhoneNumber = {
      id: nextId,
      number: "",
    };

    setNumbers((oldVal) => [...oldVal, data]);
  };

  const decreasePhoneNumber = (dataNumber: FormPhoneNumber) => {
    if (numbers.length <= 0) {
      return;
    }

    const newNumber = [
      ...numbers.slice(0, dataNumber.id),
      ...numbers.slice(dataNumber.id + 1),
    ];
    setNumbers([]);
    setNumbers(newNumber);
  };

  const handleSetInput = (value: string, index: number) => {
    const inputNumber = [...numbers];
    inputNumber[index].number = value;
    setNumbers(inputNumber);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    // e.preventDefault();
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

  React.useEffect(() => {
    const phoneValues: Array<PhoneNumber> = [];

    phoneValues.push({
      number: phoneNumber,
    });

    numbers.forEach((item) => {
      phoneValues.push({
        number: item.number,
      });
    });

    setPhone(
      phoneValues.map((item) => ({
        number: item.number,
      }))
    );
  }, [numbers, phoneNumber]);

  const containsSpecialCharacters = (value: string) => {
    const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (value.match(specialCharacters)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <div className={headerPage}>
        <div className={titlePage}>{props.title}</div>
        <div>
          {props.title.toLowerCase() === "contact" ? (
            <Button variant="contained" onClick={handleClickOpen}>
              <AddIcon />
              &nbsp;Add Contact
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <Line />

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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Stack direction="column" spacing={2}>
                  {numbers.map((item, index) => (
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
                        value={numbers[index].number}
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
          <Button
            onClick={(e) => handleSubmit(e)}
            autoFocus
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;
