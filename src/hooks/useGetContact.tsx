import { useQuery, gql } from "@apollo/client";

const GET_CONTACT_BY_ID = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;

const useGetContact = (props: UseGetContactProp) => {
  const { loading, error, data } = useQuery(GET_CONTACT_BY_ID, {
    variables: {
      id: props.id,
    },
  });

  return {
    loading,
    error,
    data,
  };
};

export default useGetContact;
