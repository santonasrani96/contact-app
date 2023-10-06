import React, { FC } from "react";

// Emotion
import styled from "@emotion/styled";
import { css } from "@emotion/css";

// React MaterialUI
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// My Components
import FormAddDialog from "./FormAddDialog";
import SnackbarItem from "../components/SnackbarItem";

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

  @media (max-width: 600px) {
    margin-top: 4.8rem;
  }
`;

const Header: FC<HeaderProp> = (props: HeaderProp) => {
  const configurationSnackbar: SnackbarConfigurationType = {
    isOpen: false,
    type: "success",
    duration: 3000,
    message: "Success",
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [snackbarConfiguration, setSnackbarConfiguration] =
    React.useState<SnackbarConfigurationType>(configurationSnackbar);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: true,
      type: "success",
      message: "Contact successfully created",
    }));
    handleCloseDialog();

    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: false,
    }));
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
      {!isDialogOpen ? (
        ""
      ) : (
        <FormAddDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />
      )}

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
    </div>
  );
};

export default Header;
