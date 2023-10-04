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
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
          mode="add"
        />
      )}
    </div>
  );
};

export default Header;
