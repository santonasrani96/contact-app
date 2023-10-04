import React, { FC } from "react";

// Emotion
import { css } from "@emotion/css";

// React MaterialUI Components
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

// grapQL query hooks
import useDeleteContact from "../hooks/useDeleteContact";
import useGetContacts from "../hooks/useGetContacts";

// my components
import Header from "../components/Header";
import FormEditDialog from "../components/FormEditDialog";
import CardItem from "../components/CardItem";

const box = css`
  width: 100%;
`;

const searchInput = css`
  display: flex;
  justify-content: end;
`;

const PaginationStyle = css`
  display: flex;
  align-items: center;
  margin: 5rem auto;
`;

const Contact: FC = () => {
  const initialObjectContactItem: ContactItem = {
    created_at: "",
    first_name: "",
    id: 0,
    last_name: "",
    phones: [],
  };
  const initPage = 1;
  const [state, setState] = React.useState<ContactState>({
    page: 1,
    selectedItem: initialObjectContactItem,
    isDialogOpen: false,
    search: "",
    searchFirstName: "%%",
    searchLastName: "%%",
    limit: 10,
    offset: initPage - 1,
  });

  const { loading, error, data, refetch } = useGetContacts({
    limit: state.limit,
    offset: state.offset,
    first_name: state.searchFirstName ? state.searchFirstName : "%%",
    last_name: state.searchLastName ? state.searchLastName : "%%",
  });
  const doDeleteContact = useDeleteContact();

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    if (state.search) {
      setState({ ...state, search: "" });
      setState({ ...state, searchFirstName: "%%" });
      setState({ ...state, searchLastName: "%%" });
    }

    setState({ ...state, offset: value });
    setState({ ...state, page: value });
    refetch();
  };

  const handleOpenDialog = (item: ContactItem) => {
    setState({ ...state, selectedItem: item });
    setState({ ...state, isDialogOpen: true });
  };

  const handleCloseDialog = () => {
    setState({ ...state, isDialogOpen: false });
  };

  const handleDelete = (item: ContactItem) => {
    doDeleteContact({ id: item.id });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value: string[] = state.search.split(" ");
      if (value.length > 0) {
        if (value.length === 1) {
          setState({ ...state, searchFirstName: `%${value[0]}%` });
        } else {
          setState({ ...state, searchFirstName: `%${value[0]}%` });
          setState({ ...state, searchLastName: `%${value[1]}%` });
        }

        setState({ ...state, offset: null });
      }

      if (value.length === 1 && value[0] === "") {
        setState({ ...state, searchFirstName: "%%" });
        setState({ ...state, searchLastName: "%%" });
        setState({ ...state, offset: state.page });
      }

      refetch();
    }
  };

  if (loading) return <p>Loading Contact...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className={box}>
      <Header title="Contact" />
      <div className={searchInput}>
        <Tooltip title="Hit 'Enter' to search">
          <TextField
            id="input-with-sx"
            label="Search Contact..."
            variant="outlined"
            value={state.search}
            onKeyPress={handleKeyPress}
            onChange={(e) => setState({ ...state, search: e.target.value })}
            sx={{ width: "300px", marginRight: "1rem" }}
          />
        </Tooltip>
      </div>
      {!state.isDialogOpen ? (
        ""
      ) : (
        <FormEditDialog
          isOpen={state.isDialogOpen}
          onClose={handleCloseDialog}
          mode="edit"
          item={state.selectedItem}
        />
      )}
      <>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
        >
          {data.contact.map((item: ContactItem, index: number) => (
            <CardItem
              key={index}
              item={item}
              isFavorite={false}
              onOpenDialog={handleOpenDialog}
              onDelete={handleDelete}
            />
          ))}
        </Grid>
        {/* pagination */}
        <Stack spacing={2} className={PaginationStyle}>
          <Pagination
            count={10}
            page={state.page}
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
