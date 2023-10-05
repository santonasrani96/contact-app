import React, { FC } from "react";

// Emotion
import { css } from "@emotion/css";
import styled from "@emotion/styled";

// React MaterialUI Components
import Grid from "@mui/material/Grid";

// grapQL query hooks
import useDeleteContact from "../hooks/useDeleteContact";

// my components
import Header from "../components/Header";
import FormEditDialog from "../components/FormEditDialog";
import CardItem from "../components/CardItem";
import SnackbarItem from "../components/SnackbarItem";

const box = css`
  width: 100%;
`;

const CardEmptyFavorite = styled.div({
  width: "100%",
  backgroundColor: "lightgrey",
  marginLeft: "1.5rem",
  marginTop: "2rem",
  padding: "5rem 0",
  borderRadius: ".2rem",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  color: "grey",
});

const Home: FC = () => {
  const initialObjectContactItem: ContactItem = {
    created_at: "",
    first_name: "",
    id: 0,
    last_name: "",
    phones: [],
  };

  const configurationSnackbar: SnackbarConfigurationType = {
    isOpen: false,
    type: "success",
    duration: 3000,
    message: "Success",
  };

  const [selectedItem, setSelectedItem] = React.useState<ContactItem>(
    initialObjectContactItem
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [contactFavorites, setContactFavorites] = React.useState<
    Array<ContactItem>
  >([]);
  const [snackbarConfiguration, setSnackbarConfiguration] =
    React.useState<SnackbarConfigurationType>(configurationSnackbar);

  React.useEffect(() => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];

    if (favorites.length > 0) {
      setContactFavorites(favorites);
    }
  }, []);

  const doDeleteContact = useDeleteContact();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (item: ContactItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ContactItem) => {
    doDeleteContact({ id: item.id });
  };

  const handleSubmitEdit = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: true,
      type: "success",
      message: "Contact successfully updated",
    }));
    handleCloseDialog();
    setCardHTML();
    window.location.reload();
  };

  const handleUnfavorite = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: true,
      type: "success",
      message: "Contact successfully removed from favorite list",
    }));
    setCardHTML();
    window.location.reload();
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  const setCardHTML = () => {
    if (contactFavorites.length === 0) {
      return (
        <>
          <CardEmptyFavorite>Contact favorite is not found</CardEmptyFavorite>
        </>
      );
    } else {
      return contactFavorites.map((item: ContactItem, index: number) => (
        <CardItem
          key={index}
          item={item}
          isFavorite={true}
          onOpenDialog={handleOpenDialog}
          onDelete={handleDelete}
          onUnfavorite={handleUnfavorite}
        />
      ));
    }
  };

  return (
    <div className={box}>
      <Header title="Home" />
      <div>Favorite Contact</div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 12, md: 12 }}
      >
        {setCardHTML()}
      </Grid>

      {/* components */}
      {!isDialogOpen ? (
        ""
      ) : (
        <FormEditDialog
          isOpen={isDialogOpen}
          mode="edit"
          item={selectedItem}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitEdit}
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

export default Home;
