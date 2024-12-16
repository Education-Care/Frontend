import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chart from "react-apexcharts";

import { getPhq9Responses } from "../../../services/responses";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const DepLevel = () => {
  const barChartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: ["Normal", "Mild", "Moderate", "Severe", "Extremely Severe"],
    },
    title: {
      text: "Depression Levels Distribution",
      align: "center",
    },
  };

  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchPhq9Res = async () => {
      try {
        const data = await getPhq9Responses();
        const barChartData = Object.values(data.groupBySurvey);

        setBarChartData(Object.values(barChartData));
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhq9Res();
  }, []);

  return (
    <Grid item xs={12} md={6}>
      <StyledPaper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Depression Levels Distribution
        </Typography>
        <Chart
          options={barChartOptions}
          series={[{ data: barChartData }]}
          type="bar"
          height={350}
        />
      </StyledPaper>
    </Grid>
  );
};

export default DepLevel;
