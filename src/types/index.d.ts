type HeaderProp = {
  title: string;
  children?: React.ReactNode;
};

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

type PhoneNumber = {
  number: string;
};

type FormPhoneNumber = {
  id: number;
  number: string;
};

type FormAddDialogProp = {
  isOpen: boolean;
  onClose: Function;
  mode: string;
};

type FormEditDialogProp = {
  isOpen: boolean;
  onClose: Function;
  mode: string;
  item: ContactItem;
};

type CardItemProp = {
  item: ContactItem;
  isFavorite?: boolean;
  key?: number;
  onOpenDialog: Function;
  onDelete: Function;
};

type UseGetContactsProp = {
  limit: number;
  offset: number | null;
  first_name: string;
  last_name: string;
};

type UseGetContactProp = {
  id: number;
};

type UseEditContactProp = {
  id: number;
  first_name: string;
  last_name: string;
};

type UseEditPhoneNumberProp = {
  number: string;
  contact_id: number;
  new_phone_number: string;
};

type UseDeleteContactProp = { id: number };

type UseAddContactWithPhones = {
  first_name: string;
  last_name: string;
  phones: Array<PhoneNumber>;
};

type HomeState = {
  selectedItem: ContactItem;
  isDialogOpen: boolean;
  contactFavorites: Array<ContactItem>;
};

type ContactState = {
  page: number;
  selectedItem: ContactItem;
  isDialogOpen: boolean;
  search: string;
  searchFirstName: string;
  searchLastName: string;
  limit: number;
  offset: number | null;
};

type FormAddDialogState = {
  open: boolean;
  nextId: number;
  firstName: string;
  lastName: string;
  inputValuePhoneNumber: string;
  inputNewValueListPhoneNumber: Array<FormPhoneNumber>;
  phoneNumbers: Array<PhoneNumber>;
};

type FormEditDialogState = {
  open: boolean;
  firstName: string;
  lastName: string;
  inputValueListPhoneNumber: Array<FormPhoneNumber>;
  phoneNumbers: Array<PhoneNumber>;
  oldNumbers: Array<PhoneNumber>;
};

type HeaderState = {
  isDialogOpen: boolean;
};
