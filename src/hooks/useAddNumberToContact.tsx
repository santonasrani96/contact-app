import { useMutation, gql } from "@apollo/client";

const ADD_NUMBER_TO_CONTACT = gql`
  mutation AddNumberToContact($contact_id: Int!, $phone_number: String!) {
    insert_phone(objects: { contact_id: $contact_id, number: $phone_number }) {
      returning {
        contact {
          id
          last_name
          first_name
          phones {
            number
          }
        }
      }
    }
  }
`;

const useAddNumberToContact = () => {
  const [addNumberToContact] = useMutation(ADD_NUMBER_TO_CONTACT);

  const doAddNumberToContact = (props: UseAddNumberToContactProp) => {
    addNumberToContact({
      variables: {
        contact_id: props.contact_id,
        phone_number: props.phone_number,
      },
    });
  };

  return doAddNumberToContact;
};

export default useAddNumberToContact;
