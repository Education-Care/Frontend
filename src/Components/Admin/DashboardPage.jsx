import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import { TotalUsers, TotalSurveys, AvgDepLevel } from "./Cards";
import { DepLevel, DepLevelOnTime } from "./Charts";

export default function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <TotalUsers />
        <TotalSurveys />
        <AvgDepLevel />

        <DepLevel />
        <DepLevelOnTime />
      </Grid>
    </Container>
  );
}
