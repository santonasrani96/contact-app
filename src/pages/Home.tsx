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

  const [state, setState] = React.useState<HomeState>({
    selectedItem: initialObjectContactItem,
    isDialogOpen: false,
    contactFavorites: [],
  });

  React.useEffect(() => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];

    if (favorites.length > 0) {
      setState({ ...state, contactFavorites: favorites });
    }
  }, [setState, state]);

  const doDeleteContact = useDeleteContact();

  const handleCloseDialog = () => {
    setState({ ...state, isDialogOpen: false });
  };

  const handleOpenDialog = (item: ContactItem) => {
    setState({ ...state, selectedItem: item });
    setState({ ...state, isDialogOpen: true });
    console.log(state.isDialogOpen, state.selectedItem, item);
  };

  const handleDelete = (item: ContactItem) => {
    doDeleteContact({ id: item.id });
  };

  const setCardHTML = () => {
    if (state.contactFavorites.length === 0) {
      return (
        <>
          <CardEmptyFavorite>Contact favorite is not found</CardEmptyFavorite>
        </>
      );
    } else {
      return state.contactFavorites.map((item: ContactItem, index: number) => (
        <CardItem
          key={index}
          item={item}
          isFavorite={true}
          onOpenDialog={handleOpenDialog}
          onDelete={handleDelete}
        />
      ));
    }
  };

  return (
    <div className={box}>
      <Header title="Home" />
      <FormEditDialog
        isOpen={state.isDialogOpen}
        onClose={handleCloseDialog}
        mode="edit"
        item={state.selectedItem}
      />
      <div>Favorite Contact</div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 12, md: 12 }}
      >
        {setCardHTML()}
      </Grid>
    </div>
  );
};

export default Home;
