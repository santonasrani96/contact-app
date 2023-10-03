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
import { useQuery, gql, concat } from "@apollo/client";

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

  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [numbers, setNumbers] = React.useState<FormPhoneNumber[]>([]);
  //   const [nextId, setNextId] = React.useState(0);

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
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };
  const setDialogTitle = () => {
    console.log("ts");
    if (props.mode === "edit") {
      return "Edit Contact";
    } else {
      return "Add New Contact";
    }
  };

  const increasePhoneNumber = () => {
    const currentId: number = numbers.length;
    const idAdded: number = currentId + 1;

    const data: FormPhoneNumber = {
      id: idAdded,
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
        <DialogTitle id="alert-dialog-title">{setDialogTitle()}</DialogTitle>
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
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <span>Last Name</span>
                    <TextField
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
                  <div>
                    <IconButton color="primary" onClick={increasePhoneNumber}>
                      <AddIcon />
                    </IconButton>
                  </div>
                </div>
                {/* <TextField id="outlined-basic" fullWidth variant="outlined" /> */}
                {numbers.map((item, index) => (
                  <>
                    {item.id === 1 ? (
                      ""
                    ) : (
                      <IconButton
                        key={index}
                        color="primary"
                        onClick={() => decreasePhoneNumber(item)}
                      >
                        <RemoveIcon /> {item.id}
                      </IconButton>
                    )}
                    <TextField
                      key={index}
                      id="outlined-basic"
                      fullWidth
                      variant="outlined"
                      placeholder={`Phone Number ${item.id}`}
                      value={numbers[index].number}
                      onChange={(e) => handleSetInput(e.target.value, index)}
                      // onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </>
                ))}
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button autoFocus variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormDialog;
