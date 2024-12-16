import { Grid, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPhq9Responses } from "../../../services/responses";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const AvgDepLevel = () => {
  const [phq9Res, setPhq9Res] = useState({ average: 0 });

  useEffect(() => {
    const fetchPhq9Res = async () => {
      try {
        const data = await getPhq9Responses();
        setPhq9Res(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhq9Res();
  }, []);

  return (
    <Grid item xs={12} md={3}>
      <StyledPaper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Average Depression Level
        </Typography>
        <Typography component="p" variant="h4">
          {phq9Res.average}
        </Typography>
      </StyledPaper>
    </Grid>
  );
};

export default AvgDepLevel;
