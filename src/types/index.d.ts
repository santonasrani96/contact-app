type HeaderProp = {
  title: string;
  onSubmit?: Function;
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
  onSubmit: Function;
};

type FormEditDialogProp = {
  isOpen: boolean;
  onClose: Function;
  onSubmit: Function;
  item: ContactItem;
};

type FormAddNewNumberProp = {
  isOpen: boolean;
  onClose: Function;
  onSubmit: Function;
  item: ContactItem;
};

type ConfirmDialogProp = {
  isOpen: boolean;
  onClose: Function;
  message?: string;
  onYes: Function;
  onNo: Function;
};

type SnackbarProp = {
  isOpen: boolean;
  onClose: Function;
  message?: string;
  type: string;
  duration?: number;
};

type SnackbarConfigurationType = {
  isOpen: boolean;
  type: string;
  duration: number;
  message: string;
};

type CardItemProp = {
  item: ContactItem;
  isFavorite?: boolean;
  key?: number;
  onOpenDialog: Function;
  onDelete: Function;
  onFavorite?: Function;
  onUnfavorite?: Function;
  onOpenAddNewNumberDialog?: Function;
};

type InnerLoadingProp = {
  isOpen: boolean;
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

type UseAddContactWithPhonesProp = {
  first_name: string;
  last_name: string;
  phones: Array<PhoneNumber>;
};

type UseAddNumberToContactProp = {
  contact_id: number;
  phone_number: string;
};

type HeaderState = {
  isDialogOpen: boolean;
};
