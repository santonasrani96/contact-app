import { useMutation, gql } from "@apollo/client";

const ADD_CONTACT_WITH_PHONES = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

const useAddContactWithPhones = () => {
  const [addContact] = useMutation(ADD_CONTACT_WITH_PHONES);

  const doAddContact = (props: UseAddContactWithPhones) => {
    addContact({
      variables: {
        first_name: props.first_name,
        last_name: props.last_name,
        phones: props.phones,
      },
    });
  };

  return doAddContact;
};

export default useAddContactWithPhones;
