import React from "react";

// Emotion
import styled from "@emotion/styled";
import { css } from "@emotion/css";

// React MaterialUI Components
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";

const CardHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const cardClass = css`
  position: relative;
`;

const buttonAddNumber = css`
  position: absolute;
  bottom: 5px;
  text-align: center;
  width: 100%;
  font-size: 0.2rem !important;
`;

const sizeFont = css`
  font-size: 0.8rem !important;
`;

// ====== COMPONENT HERE ========
const CardItem: React.FC<CardItemProp> = (props: CardItemProp) => {
  const checkContactIsFavorite = (contact: ContactItem) => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];
    let favorite = null;
    if (favorites.length > 0) {
      favorite = favorites.find((fav: ContactItem) => fav.id === contact.id);
    }

    if (favorite) {
      return <FavoriteIcon fontSize="inherit" />;
    } else {
      return <FavoriteBorderIcon fontSize="inherit" />;
    }
  };

  const handleFavorite = (item: ContactItem) => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];
    favorites.push(item);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    if (props.onFavorite) {
      props.onFavorite();
    }

    // delete favorite contact from regular list
    // handleDeleteContact(item);
  };

  const handleAddNewNumber = (item: ContactItem) => {
    if (props.onOpenAddNewNumberDialog) {
      props.onOpenAddNewNumberDialog(item);
    }
  };

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
    if (props.onUnfavorite) {
      props.onUnfavorite();
    }

    // delete favorite contact from regular list
    // handleDeleteContact(item);
  };

  const handleEdit = (item: ContactItem) => {
    handleOpenDialog(item);
  };

  const handleOpenDialog = (item: ContactItem) => {
    props.onOpenDialog(item);
  };

  const handleDelete = (item: ContactItem) => {
    props.onDelete(item);
    if (props.isFavorite) {
      handleUnfavorite(item);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        className={cardClass}
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
                Contact ID {props.item.id}
              </Typography>
            </div>
            <div>
              <Stack direction="row">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() =>
                    !props.isFavorite
                      ? handleFavorite(props.item)
                      : handleUnfavorite(props.item)
                  }
                >
                  <>{checkContactIsFavorite(props.item)}</>
                </IconButton>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleEdit(props.item)}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(props.item)}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            </div>
          </CardHeader>

          <Typography variant="h5" component="div">
            {props.item.first_name} {props.item.last_name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Phone Number:
          </Typography>
          <Typography variant="body2">
            {props.item.phones.map((phone: PhoneItem, idx: number) => (
              <span key={idx}>
                #{idx + 1}. {phone.number}
                <br />
              </span>
            ))}
          </Typography>
        </CardContent>
        <div className={buttonAddNumber}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleAddNewNumber(props.item)}
          >
            <AddIcon fontSize="inherit" />
            <span className={sizeFont}>Add New Number</span>
          </IconButton>
        </div>
      </Card>
    </Grid>
  );
};

export default CardItem;
