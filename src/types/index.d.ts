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

type HeaderState = {
  isDialogOpen: boolean;
};
