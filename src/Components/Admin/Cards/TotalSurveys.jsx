import { Grid, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSurveys } from "../../../services/surveys";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const TotalSurveys = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await getSurveys();
        setSurveys(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <Grid item xs={12} md={3}>
      <StyledPaper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Total Surveys
        </Typography>
        <Typography component="p" variant="h4">
          {surveys.length}
        </Typography>
      </StyledPaper>
    </Grid>
  );
};

export default TotalSurveys;
