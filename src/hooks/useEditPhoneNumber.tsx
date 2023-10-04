import { useMutation, gql } from "@apollo/client";

const EDIT_PHONE_NUMBER = gql`
  mutation EditPhoneNumber(
    $pk_columns: phone_pk_columns_input!
    $new_phone_number: String!
  ) {
    update_phone_by_pk(
      pk_columns: $pk_columns
      _set: { number: $new_phone_number }
    ) {
      contact {
        id
        last_name
        first_name
        created_at
        phones {
          number
        }
      }
    }
  }
`;

const useEditPhoneNumber = () => {
  const [editPhoneNumber] = useMutation(EDIT_PHONE_NUMBER);

  const doEditPhoneNumber = (props: UseEditPhoneNumberProp) => {
    editPhoneNumber({
      variables: {
        pk_columns: {
          number: props.number,
          contact_id: props.contact_id,
        },
        new_phone_number: props.new_phone_number,
      },
    });
  };

  return doEditPhoneNumber;
};

export default useEditPhoneNumber;
