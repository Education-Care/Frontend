import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Chart from "react-apexcharts";

import { getDepressionLevel } from "../../../services/responses";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const DepLevelOnTime = () => {
  const depressionLevels = [
    "Normal",
    "Mild",
    "Moderate",
    "Severe",
    "Extremely Severe",
  ];

  const [selectedLevels, setSelectedLevels] = useState(depressionLevels);
  const [lineChartData, setLineChartData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
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
  const handleLevelToggle = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const [from, to] = dateRange;

      const payload = {
        from: from.format("YYYY-MM-DD"),
        to: to.format("YYYY-MM-DD"),
      };

      const data = await getDepressionLevel(payload);
      const chartData = Object.entries(data).map(([date, levels]) => ({
        x: date,
        y: levels,
      }));
      setLineChartData(chartData);
    };
    loadData();
  }, [dateRange, selectedLevels]);
  return (
    <Grid item xs={12} md={6}>
      <StyledPaper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
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
              onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
            />
            <DatePicker
              label="End Date"
              value={dateRange[1]}
              onChange={(newValue) => setDateRange([dateRange[0], newValue])}
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
  );
};

export default DepLevelOnTime;
