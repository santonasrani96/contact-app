import React, { FC } from "react";
import Header from "../components/Header";
import { css } from "@emotion/css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useQuery, gql } from "@apollo/client";

const GET_CONTACTS = gql`
  query GetContactList($limit: Int, $offset: Int) {
    contact(limit: $limit, offset: $offset) {
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

const box = css`
  width: 100%;
`;

const PaginationStyle = css`
  display: flex;
  align-items: center;
  margin: 5rem auto;
`;

type PhoneItem = {
  number: string;
};

type ContactItem = {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: Array<PhoneItem>;
  phone: PhoneItem;
};

const Contact: FC = () => {
  const [page, setPage] = React.useState(1);
  const { loading, error, data, refetch } = useQuery(GET_CONTACTS, {
    variables: { limit: 10, offset: page - 1 },
  });

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className={box}>
      <Header title="Contact" />
      <>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
        >
          {data.contact.map((item: ContactItem, index: number) => (
            <Grid item xs={2} sm={4} md={3} key={index}>
              <Card
                sx={{
                  minWidth: 150,
                }}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Kontak No. {index + 1}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {item.first_name} {item.last_name} {item.id}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Nomor Telepon:
                  </Typography>
                  <Typography variant="body2">
                    {item.phones.map((phone: PhoneItem, idx: number) => (
                      <div>
                        #{idx + 1}. {phone.number}
                      </div>
                    ))}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* pagination */}
        <Stack spacing={2} className={PaginationStyle}>
          <Pagination
            count={10}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        </Stack>
      </>
    </div>
  );
};

export default Contact;
