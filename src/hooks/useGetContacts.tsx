import { useQuery, gql } from "@apollo/client";

const GET_CONTACTS = gql`
  query GetContactList($limit: Int, $offset: Int, $where: contact_bool_exp) {
    contact(limit: $limit, offset: $offset, where: $where) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

const useGetContacts = (props: UseGetContactsProp) => {
  const { loading, error, data, refetch } = useQuery(GET_CONTACTS, {
    variables: {
      limit: props.limit,
      offset: props.offset,
      where: {
        first_name: {
          _like: props.first_name,
        },
        last_name: {
          _like: props.last_name,
        },
      },
    },
  });

  return {
    loading,
    error,
    data,
    refetch,
  };
};

export default useGetContacts;
