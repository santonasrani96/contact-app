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

  const [page, setPage] = React.useState<number>(1);
  const [selectedItem, setSelectedItem] = React.useState<ContactItem>(
    initialObjectContactItem
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [searchFirstName, setSearchFirstName] = React.useState<string>("%%");
  const [searchLastName, setSearchLastName] = React.useState<string>("%%");
  const [limit, setLimit] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number | null>(page - 1);

  const { loading, error, data, refetch } = useGetContacts({
    limit,
    offset,
    first_name: searchFirstName,
    last_name: searchLastName,
  });
  const doDeleteContact = useDeleteContact();

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    if (search) {
      setSearch("");
      setSearchFirstName("%%");
      setSearchLastName("%%");
    }

    setOffset(value);
    setPage(value);
    refetch();
  };

  const handleOpenDialog = (item: ContactItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = (item: ContactItem) => {
    doDeleteContact({ id: item.id });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value: string[] = search.split(" ");
      if (value.length > 0) {
        if (value.length === 1) {
          setSearchFirstName(`%${value[0]}%`);
        } else {
          setSearchFirstName(`%${value[0]}%`);
          setSearchFirstName(`%${value[1]}%`);
        }

        setOffset(null);
      }

      if (value.length === 1 && value[0] === "") {
        setSearchFirstName("%%");
        setSearchFirstName("%%");
        setOffset(page);
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
            value={search}
            onKeyPress={handleKeyPress}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "300px", marginRight: "1rem" }}
          />
        </Tooltip>
      </div>
      {!isDialogOpen ? (
        ""
      ) : (
        <FormEditDialog
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
