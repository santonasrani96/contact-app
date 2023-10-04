import React, { FC } from "react";

// Emotion
import styled from "@emotion/styled";
import { css } from "@emotion/css";

// React MaterialUI
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// My Components
import FormAddDialog from "./FormAddDialog";

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

const Header: FC<HeaderProp> = (props: HeaderProp) => {
  const [state, setState] = React.useState<HeaderState>({
    isDialogOpen: false,
    // nextId: 0,
    // inputValuePhoneNumber: "", // phoneNumber
    // inputNewValueListPhoneNumber: [], // numbers
    // firstName: "",
    // lastName: "",
    // phoneNumbers: [], //phone
  });
  // const [open, setOpen] = React.useState(false);
  // const [nextId, setNextId] = React.useState(0);
  // const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  // const [numbers, setNumbers] = React.useState<FormPhoneNumber[]>([]);
  // const [firstName, setFirstName] = React.useState<string>("");
  // const [lastName, setLastName] = React.useState<string>("");
  // const [phone, setPhone] = React.useState<PhoneNumber[]>([]);

  // const [createContact, { loading, error, data }] = useMutation(
  //   ADD_CONTACT_WITH_PHONES,
  //   {
  //     variables: {
  //       first_name: state.firstName,
  //       last_name: state.lastName,
  //       phones: state.phoneNumbers,
  //     },
  //   }
  // );

  const handleOpenDialog = () => {
    setState({ ...state, isDialogOpen: true });
  };

  const handleCloseDialog = () => {
    setState({ ...state, isDialogOpen: false });
  };

  return (
    <div>
      <div className={headerPage}>
        <div className={titlePage}>{props.title}</div>
        <div>
          {props.title.toLowerCase() === "contact" ? (
            <Button variant="contained" onClick={handleOpenDialog}>
              <AddIcon />
              &nbsp;Add Contact
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <Line />
      <FormAddDialog
        isOpen={state.isDialogOpen}
        onClose={handleCloseDialog}
        mode="add"
      />
    </div>
  );
};

export default Header;
