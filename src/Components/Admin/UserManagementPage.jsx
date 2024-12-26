import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getAllInfoUserAsync } from '../../services/profiles';
import { getSurveysByUser } from '../../services/surveys';
import dayjs from 'dayjs';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userSurveys, setUserSurveys] = useState([]);
  const [surveyDateRange, setSurveyDateRange] = useState([null, null]);
  const [nameFilter, setNameFilter] = useState('');
  const [highlightedUsers, setHighlightedUsers] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 50;

  const fetchUsersAndSurveys = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInfoUserAsync(currentPage, limit);
      const allUsers = response.users;
      setTotalPages(response.totalPages);

      const newHighlightedUsers = new Set();

      await Promise.all(
        allUsers.map(async (user) => {
          try {
            const surveys = await getSurveysByUser(user.id);
            const recentSevereSurvey = surveys.some(
              (survey) =>
                survey.depressionLevel === 'severe_depression' &&
                dayjs().diff(dayjs(survey.createdAt), 'week') < 1
            );

            if (recentSevereSurvey) {
              newHighlightedUsers.add(user.id);
            }
          } catch (error) {
            console.error(`Failed to fetch surveys for user ${user.id}:`, error);
          }
        })
      );

      setUsers(allUsers);
      setFilteredUsers(allUsers);
      setHighlightedUsers(newHighlightedUsers);
    } catch (error) {
      console.error('Failed to fetch users and surveys:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsersAndSurveys(page);
  }, [page, fetchUsersAndSurveys]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [nameFilter, users]);

  const handleDetailClick = async (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
    try {
      const response = await getSurveysByUser(user.id);
      setUserSurveys(
        response.map((survey) => ({
          ...survey,
          date: dayjs(survey.createdAt).format('YYYY-MM-DD'),
        }))
      );
      const recentSevereSurvey = response.some(
        (survey) =>
          survey.depressionLevel === 'severe_depression' &&
          dayjs().diff(dayjs(survey.createdAt), 'week') < 1
      );
      if (recentSevereSurvey) {
        setHighlightedUsers((prev) => new Set(prev).add(user.id));
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
      setUserSurveys([]);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSurveyDateRange([null, null]);
  };

  const filteredSurveys = userSurveys.filter((survey) => {
    if (!surveyDateRange[0] || !surveyDateRange[1]) return true;
    const surveyDate = dayjs(survey.date);
    return (
      surveyDate.isAfter(surveyDateRange[0]) && surveyDate.isBefore(surveyDateRange[1])
    );
  });

  const isUserHighlighted = (user) => highlightedUsers.has(user.id);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setNameFilter('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Hobbies</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    backgroundColor: isUserHighlighted(user) ? '#ffcccb' : 'inherit',
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.birthday}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.hobby}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleDetailClick(user)}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          disabled={page === 1 || loading}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
        <Typography>
          Page {page} of {totalPages}
        </Typography>
        <Button
          disabled={page === totalPages || loading}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUser?.name}'s Surveys</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <DatePicker
                label="From"
                value={surveyDateRange[0]}
                onChange={(newValue) =>
                  setSurveyDateRange([newValue, surveyDateRange[1]])
                }
              />
              <DatePicker
                label="To"
                value={surveyDateRange[1]}
                onChange={(newValue) =>
                  setSurveyDateRange([surveyDateRange[0], newValue])
                }
              />
            </div>
          </LocalizationProvider>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Survey Date</TableCell>
                  <TableCell>Depression Level</TableCell>
                  <TableCell>Total Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow
                    key={survey.id}
                    sx={{
                      backgroundColor:
                        survey.depressionLevel === 'severe_depression' &&
                        dayjs().diff(dayjs(survey.date), 'week') < 1
                          ? '#ffcccb'
                          : 'inherit',
                    }}
                  >
                    <TableCell>{survey.date}</TableCell>
                    <TableCell>{survey.depressionLevel}</TableCell>
                    <TableCell>{survey.totalScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

