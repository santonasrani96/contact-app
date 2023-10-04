import { useMutation, gql } from "@apollo/client";

const DELETE_CONTACT = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

const useDeleteContact = () => {
  const [deleteContact] = useMutation(DELETE_CONTACT);

  const doDeleteContact = (props: UseDeleteContactProp) => {
    deleteContact({
      variables: {
        id: props.id,
      },
    });
  };

  return doDeleteContact;
};

export default useDeleteContact;
