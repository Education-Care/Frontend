import { Grid, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUser } from "../../../services/user";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const TotalUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUser();
        console.log("datauser", data)
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Grid item xs={12} md={3}>
      <StyledPaper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Total Users
        </Typography>
        <Typography component="p" variant="h4">
          {users.total}
        </Typography>
      </StyledPaper>
    </Grid>
  );
};

export default TotalUsers;
