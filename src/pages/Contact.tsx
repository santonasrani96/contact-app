import React, { FC } from "react";
import Header from "../components/Header";
import { css } from "@emotion/css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const box = css`
  width: 100%;
`;

const contacts = [
  {
    created_at: "2023-10-01T16:52:35.836793+00:00",
    first_name: "wadad",
    id: 27896,
    last_name: "dadawda",
    phones: [
      {
        number: "22323213",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:08:51.956+00:00",
    first_name: "1",
    id: 27934,
    last_name: "1",
    phones: [
      {
        number: "1",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:17:30.582521+00:00",
    first_name: "nio",
    id: 27935,
    last_name: "sanrio",
    phones: [
      {
        number: "08516181318",
      },
      {
        number: "2181846448",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:20:56.298947+00:00",
    first_name: "ed",
    id: 27936,
    last_name: "dee",
    phones: [
      {
        number: "82618121",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:30:28.256764+00:00",
    first_name: "test",
    id: 27940,
    last_name: "tes",
    phones: [
      {
        number: "08129182918",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:36:37.207354+00:00",
    first_name: "ded",
    id: 27942,
    last_name: "ded",
    phones: [
      {
        number: "000",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:37:50.642697+00:00",
    first_name: "dwda",
    id: 27945,
    last_name: "dadd",
    phones: [],
  },
  {
    created_at: "2023-10-02T01:41:27.323284+00:00",
    first_name: "t",
    id: 27948,
    last_name: "t",
    phones: [],
  },
  {
    created_at: "2023-10-02T01:44:49.671317+00:00",
    first_name: "weqewq",
    id: 27951,
    last_name: "ddd",
    phones: [
      {
        number: "23213",
      },
    ],
  },
  {
    created_at: "2023-10-02T01:49:25.622956+00:00",
    first_name: "t",
    id: 27955,
    last_name: "t",
    phones: [
      {
        number: "08212874837",
      },
      {
        number: "082128748376",
      },
    ],
  },
];

const Contact: FC = () => {
  return (
    <div className={box}>
      <Header title="Contact" />
      <>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
        >
          {contacts.map((contact, index) => (
            <Grid item xs={2} sm={4} md={3} key={index}>
              <Card sx={{ minWidth: 150 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Word of the Day
                  </Typography>
                  <Typography variant="h5" component="div">
                    {contact.first_name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                  </Typography>
                  <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    </div>
  );
};

export default Contact;
