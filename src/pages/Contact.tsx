import React, { FC } from "react";
import Header from "../components/Header";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useQuery, useMutation, gql } from "@apollo/client";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FormDialog from "../components/FormDialog";

const GET_CONTACTS = gql`
  query GetContactList($limit: Int, $offset: Int) {
    contact(limit: $limit, offset: $offset) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

const DELETE_CONTACT = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

const box = css`
  width: 100%;
`;

const CardHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const PaginationStyle = css`
  display: flex;
  align-items: center;
  margin: 5rem auto;
`;

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

const Contact: FC = () => {
  const initialObjectContactItem: ContactItem = {
    created_at: "",
    first_name: "",
    id: 0,
    last_name: "",
    phones: [],
  };
  const [page, setPage] = React.useState(1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ContactItem>(
    initialObjectContactItem
  );
  const { loading, error, data, refetch } = useQuery(GET_CONTACTS, {
    variables: { limit: 10, offset: page - 1 },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT);

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    refetch();
  };

  const handleEdit = (item: ContactItem) => {
    setSelectedItem(item);
    handleOpenDialog();
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = (item: ContactItem) => {
    console.log(item);
    alert("di delete");
  };

  const handleFavorite = (item: ContactItem) => {
    const getFavorite = localStorage.getItem("favorites");
    const favorites = getFavorite ? JSON.parse(getFavorite) : [];
    favorites.push(item);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // delete favorite contact from regular list
    // handleDeleteContact(item);
  };

  const handleDeleteContact = (item: ContactItem) => {
    deleteContact({ variables: { id: item.id } });
  };

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

  if (loading) return <p>Loading Contact...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className={box}>
      <Header title="Contact" />
      {!isDialogOpen ? (
        ""
      ) : (
        <FormDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          mode="edit"
          item={selectedItem}
        />
      )}
      <>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
        >
          {data.contact.map((item: ContactItem, index: number) => (
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
                          onClick={() => handleFavorite(item)}
                        >
                          <>{checkContactIsFavorite(item)}</>
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
          ))}
        </Grid>

        {/* pagination */}
        <Stack spacing={2} className={PaginationStyle}>
          <Pagination
            count={10}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        </Stack>
      </>
    </div>
  );
};

export default Contact;
