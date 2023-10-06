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
import ConfirmDialog from "../components/ConfirmDialog";
import SnackbarItem from "../components/SnackbarItem";
import InnerLoading from "../components/InnerLoading";
import FormAddNewNumber from "../components/FormAddNewNumber";

const isLoading = (value: boolean) => {
  return <InnerLoading isOpen={value} />;
};

const notFoundLabel = css`
  margin-top: 4rem;
  width: 100%;
  text-align: center;
  color: grey;
`;

const box = css`
  width: 100%;
`;

const searchInput = css`
  display: flex;
  justify-content: end;
  margin-right: 1rem;

  @media (max-width: 850px) {
    width: 100% !important;
    margin-right: 1rem !important;
  }
`;

const maxWidthInputSearch = css`
  @media (max-width: 850px) {
    width: 100%;
    margin-right: 1rem !important;
  }
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

  const configurationSnackbar: SnackbarConfigurationType = {
    isOpen: false,
    type: "success",
    duration: 3000,
    message: "Success",
  };

  const [page, setPage] = React.useState<number>(1);
  const [selectedItem, setSelectedItem] = React.useState<ContactItem>(
    initialObjectContactItem
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [isOpenAddNewNumberFormDialog, setIsOpenAddNewNumberFormDialog] =
    React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [searchLabel, setSearchLabel] = React.useState<string>("");
  const [searchFirstName, setSearchFirstName] = React.useState<string>("%%");
  const [searchLastName, setSearchLastName] = React.useState<string>("%%");
  const [limit, setLimit] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number | null>(page - 1);
  const [showConfirmDialog, setShowConfirmDialog] =
    React.useState<boolean>(false);
  const [snackbarConfiguration, setSnackbarConfiguration] =
    React.useState<SnackbarConfigurationType>(configurationSnackbar);

  const { loading, error, data, refetch } = useGetContacts({
    limit,
    offset,
    first_name: searchFirstName,
    last_name: searchLastName,
  });

  const { data: contacts, refetch: refetchAllContact } = useGetContacts({
    limit: 9999999,
  });

  const doDeleteContact = useDeleteContact();

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    if (search) {
      setSearch("");
      setSearchFirstName("%%");
      setSearchLastName("%%");
    }

    setOffset(value - 1);
    setPage(value);
    refetch();
  };

  const handleOpenDialog = (item: ContactItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleOpenAddNewNumberDialog = (item: ContactItem) => {
    setSelectedItem(item);
    setIsOpenAddNewNumberFormDialog(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsOpenAddNewNumberFormDialog(false);
  };

  const handleDelete = (item: ContactItem) => {
    setSelectedItem(initialObjectContactItem);
    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const handleOnYes = async () => {
    try {
      await doDeleteContact({ id: selectedItem.id });

      refetch();

      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "success",
        message: "Contact successfully deleted",
      }));
      resetState();
    } catch (error) {
      console.log("Failed to delete contact ", error);
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "error",
        message: "Failed to delete contact",
      }));
    }
  };

  const handleOnNo = () => {
    handleCloseConfirmDialog();
    resetState();
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: false,
    }));
  };

  const resetState = () => {
    setSelectedItem(initialObjectContactItem);
    setShowConfirmDialog(false);
    setIsDialogOpen(false);
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
        setSearchLabel(search);
      }

      if (value.length === 1 && value[0] === "") {
        setSearchFirstName("%%");
        setSearchFirstName("%%");
        setOffset(page);
      }

      refetch();
    }
  };

  const handleFavorite = () => {
    setSnackbarConfiguration((state) => ({
      ...state,
      isOpen: true,
      type: "success",
      message: "Contact successfully added to favorite list",
    }));
    refetch();
  };

  const pageCount = (): { _page: number; totalData: number } => {
    let _page = 0;
    let totalData = 0;
    if (!loading && contacts) {
      refetchAllContact();
      totalData = contacts.contact.length;
      _page = Math.ceil(totalData / 10);
    }
    return { _page, totalData };
  };

  const handleSubmit = (editType: string) => {
    if (editType === "edit") {
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "success",
        message: "Contact successfully updated",
      }));
    } else {
      setSnackbarConfiguration((state) => ({
        ...state,
        isOpen: true,
        type: "success",
        message: "A new number successfully added to contact",
      }));
    }
    handleCloseDialog();
    refetch();
  };

  if (loading) return <div>{isLoading(loading)}</div>;
  if (error)
    return (
      <div>
        <SnackbarItem
          isOpen={true}
          message={"Failed to load contact"}
          type={"error"}
          onClose={handleCloseSnackbar}
        />
      </div>
    );

  return (
    <div className={box}>
      <Header
        title="Contact"
        onSubmit={() => {
          refetch();
        }}
      />
      <div className={searchInput}>
        <Tooltip title="Hit 'Enter' to search">
          <TextField
            className={maxWidthInputSearch}
            id="input-with-sx"
            label="Search Contact..."
            variant="outlined"
            value={search}
            onKeyPress={handleKeyPress}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Tooltip>
      </div>
      <>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12, lg: 12 }}
        >
          {!loading && data.contact.length === 0 ? (
            <div className={notFoundLabel}>Data "{searchLabel}" not found</div>
          ) : (
            data.contact.map((item: ContactItem, index: number) => (
              <CardItem
                key={index}
                item={item}
                isFavorite={false}
                onOpenDialog={handleOpenDialog}
                onOpenAddNewNumberDialog={handleOpenAddNewNumberDialog}
                onDelete={handleDelete}
                onFavorite={handleFavorite}
              />
            ))
          )}
        </Grid>
        {/* pagination */}
        {pageCount().totalData <= 10 ? (
          <div className={PaginationStyle}></div>
        ) : (
          <Stack spacing={2} className={PaginationStyle}>
            <Pagination
              count={pageCount()._page}
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={handleChange}
            />
          </Stack>
        )}
      </>

      {/* components */}
      {!isOpenAddNewNumberFormDialog ? (
        ""
      ) : (
        <FormAddNewNumber
          isOpen={isOpenAddNewNumberFormDialog}
          item={selectedItem}
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

      {!isDialogOpen ? (
        ""
      ) : (
        <FormEditDialog
          isOpen={isDialogOpen}
          item={selectedItem}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />
      )}

      {!showConfirmDialog ? (
        ""
      ) : (
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onYes={handleOnYes}
          onNo={handleOnNo}
          onClose={handleCloseConfirmDialog}
          message={`Are you sure to delete ${selectedItem.first_name} ${selectedItem.last_name} from contact list?`}
        />
      )}
    </div>
  );
};

export default Contact;
