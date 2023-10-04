import { useMutation, gql } from "@apollo/client";

const EDIT_CONTACT = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

const useEditContact = () => {
  const [editContact] = useMutation(EDIT_CONTACT);

  const doEditContact = (props: UseEditContactProp) => {
    editContact({
      variables: {
        id: props.id,
        _set: {
          first_name: props.first_name,
          last_name: props.last_name,
        },
      },
    });
  };

  return doEditContact;
};

export default useEditContact;
