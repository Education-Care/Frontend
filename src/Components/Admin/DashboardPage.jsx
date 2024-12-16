import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import { TotalUsers, TotalSurveys, AvgDepLevel } from "./Cards";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const depressionLevels = [
  "Normal",
  "Mild",
  "Moderate",
  "Severe",
  "Extremely Severe",
];

// Simulating data fetching
const fetchData = (startDate, endDate) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const barChartData = depressionLevels.map((level) => ({
        x: level,
        y: Math.floor(Math.random() * 100),
      }));

      const lineChartData = Array.from({ length: 30 }, (_, i) => ({
        x: dayjs(startDate).add(i, "day").format("YYYY-MM-DD"),
        y: depressionLevels.map(() => Math.floor(Math.random() * 100)),
      }));

      resolve({ barChartData, lineChartData });
    }, 1000);
  });
};

export default function DashboardPage() {
  const [selectedLevels, setSelectedLevels] = useState(depressionLevels);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);

  const handleLevelToggle = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const loadData = async () => {
    const { barChartData, lineChartData } = await fetchData(
      dateRange[0],
      dateRange[1]
    );
    setBarChartData(barChartData);
    setLineChartData(lineChartData);
  };

  useEffect(() => {
    loadData();
  }, [dateRange, selectedLevels]);

  const barChartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: depressionLevels,
    },
    title: {
      text: "Depression Levels Distribution",
      align: "center",
    },
  };

  const lineChartOptions = {
    chart: {
      type: "line",
    },
    xaxis: {
      type: "datetime",
      categories: lineChartData.map((data) => data.x),
    },
    title: {
      text: "Depression Levels Over Time",
      align: "center",
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <TotalUsers />
        <TotalSurveys />
        <AvgDepLevel />

        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
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
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Depression Levels Over Time
            </Typography>
            <Box mb={2}>
              {depressionLevels.map((level, index) => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleLevelToggle(level)}
                      name={level}
                    />
                  }
                  label={level}
                />
              ))}
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" gap={2} mb={2}>
                <DatePicker
                  label="Start Date"
                  value={dateRange[0]}
                  onChange={(newValue) =>
                    setDateRange([newValue, dateRange[1]])
                  }
                />
                <DatePicker
                  label="End Date"
                  value={dateRange[1]}
                  onChange={(newValue) =>
                    setDateRange([dateRange[0], newValue])
                  }
                />
              </Box>
            </LocalizationProvider>
            <Chart
              options={lineChartOptions}
              series={selectedLevels.map((level, index) => ({
                name: level,
                data: lineChartData.map((data) => data.y[index]),
              }))}
              type="line"
              height={350}
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
}
