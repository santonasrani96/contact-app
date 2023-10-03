import React, { FC } from "react";
import Header from "../components/Header";
import { css } from "@emotion/css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import styled from "@emotion/styled";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FormDialog from "../components/FormDialog";

const CardHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

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

const Home: FC = () => {
  const initialObjectContactItem: ContactItem = {
    created_at: "",
    first_name: "",
    id: 0,
    last_name: "",
    phones: [],
  };

  const [selectedItem, setSelectedItem] = React.useState<ContactItem>(
    initialObjectContactItem
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [contactFavorites, setContactFavorites] = React.useState<
    Array<ContactItem>
  >([]);

  React.useEffect(() => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];

    if (favorites.length > 0) {
      setContactFavorites(favorites);
    }
  }, []);

  const handleUnfavorite = (item: ContactItem) => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];
    const newFavorites: ContactItem[] = [];
    favorites.forEach((favorite: ContactItem) => {
      if (favorite.id !== item.id) {
        newFavorites.push(favorite);
      }
    });
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    // delete favorite contact from regular list
    // handleDeleteContact(item);
  };

  const handleEdit = (item: ContactItem) => {
    setSelectedItem(item);
    handleOpenDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ContactItem) => {
    console.log(item);
    alert("di delete");
  };

  const setCardHTML = () => {
    if (contactFavorites.length === 0) {
      // set card kosong
      return (
        <>
          <CardEmptyFavorite>Contact favorite is not found</CardEmptyFavorite>
        </>
      );
    } else {
      return contactFavorites.map((item: ContactItem, index: number) => (
        <Grid item xs={2} sm={4} md={3} key={index}>
          <Card
            sx={{
              height: "100%",
              margin: "1rem 1rem 1rem 0",
            }}
          >
            <CardContent>
              <CardHeader>
                <div>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Kontak No. {index + 1}
                  </Typography>
                </div>
                <div>
                  <Stack direction="row">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleUnfavorite(item)}
                    >
                      <FavoriteIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(item)}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item)}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </div>
              </CardHeader>

              <Typography variant="h5" component="div">
                {item.first_name} {item.last_name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Nomor Telepon:
              </Typography>
              <Typography variant="body2">
                {item.phones.map((phone: PhoneItem, idx: number) => (
                  <div>
                    #{idx + 1}. {phone.number}
                  </div>
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ));
    }
  };

  return (
    <div className={box}>
      <Header title="Home" />
      <FormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        mode="edit"
        item={selectedItem}
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
