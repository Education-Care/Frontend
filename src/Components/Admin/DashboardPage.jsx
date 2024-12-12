import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import { RefreshOutlined } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const depressionLevels = ["Normal", "Mild", "Moderate", "Severe", "Extremely Severe"];

// Simulating data fetching
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const barChartData = depressionLevels.map((level) => ({
        x: level,
        y: Math.floor(Math.random() * 100),
      }));

      const lineChartData = Array.from({ length: 12 }, (_, i) => ({
        x: `Month ${i + 1}`,
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
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

  const handleLevelToggle = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const loadData = async () => {
    setIsLoading(true);
    const { barChartData, lineChartData } = await fetchData();
    setBarChartData(barChartData);
    setLineChartData(lineChartData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const barChartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: depressionLevels,
    },
    title: {
      text: 'Depression Levels Distribution',
      align: 'center',
    },
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: lineChartData.map(data => data.x),
    },
    title: {
      text: 'Depression Levels Over Time',
      align: 'center',
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<RefreshOutlined />} 
          onClick={loadData}
          disabled={isLoading}
        >
          Refresh Data
        </Button>
      </Box>
      <Grid container spacing={3}>
        {['Total Users', 'Active Users', 'Total Surveys', 'Avg. Depression Level'].map((title, index) => (
          <Grid item xs={12} md={3} key={index}>
            <StyledPaper>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {title}
              </Typography>
              <Typography component="p" variant="h4">
                {isLoading ? <CircularProgress size={24} /> : ['1,234', '1,000', '56', 'Mild'][index]}
              </Typography>
            </StyledPaper>
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Depression Levels Distribution
            </Typography>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={350}>
                <CircularProgress />
              </Box>
            ) : (
              <Chart 
                options={barChartOptions} 
                series={[{ data: barChartData }]} 
                type="bar" 
                height={350} 
              />
            )}
          </StyledPaper>
        </Grid>
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
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={350}>
                <CircularProgress />
              </Box>
            ) : (
              <Chart 
                options={lineChartOptions} 
                series={selectedLevels.map((level, index) => ({
                  name: level,
                  data: lineChartData.map(data => data.y[index]),
                }))} 
                type="line" 
                height={350} 
              />
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
}

