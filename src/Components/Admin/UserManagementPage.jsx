import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getAllInfoUserAsync } from '../../services/profiles';
import { getSurveysByUser } from "../../services/surveys";
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

  useEffect(() => {
    const fetchUsersAndSurveys = async () => {
      try {
        const allUsers = await getAllInfoUserAsync();
        const newHighlightedUsers = new Set();

        // Lấy survey cho từng user và kiểm tra điều kiện
        await Promise.all(
          allUsers.map(async (user) => {
            try {
              const surveys = await getSurveysByUser(user.id);
              const recentSevereSurvey = surveys.some((survey) => 
                survey.depressionLevel === "very_severe_depression" &&
                dayjs().diff(dayjs(survey.createdAt), 'week') < 1 // Trong vòng 1 tuần
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
      }
    };

    fetchUsersAndSurveys();
  }, []);
  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [nameFilter, users]);

  const handleDetailClick = async (user) => {
    setSelectedUser(user);
    setOpenDialog(true); // Hiển thị dialog ngay lập tức
    try {
      const response = await getSurveysByUser(user.id); // Gọi API để lấy danh sách khảo sát
      setUserSurveys(
        response.map((survey) => ({
          ...survey,
          date: dayjs(survey.createdAt).format("YYYY-MM-DD"), // Format ngày
        }))
      );

      // Kiểm tra và đánh dấu user nếu có khảo sát "very_severe_depression"
      const recentSevereSurvey = response.some((survey) => 
        survey.depressionLevel === "very_severe_depression" &&
        dayjs().diff(dayjs(survey.createdAt), 'week') < 1 // Trong vòng 1 tuần
      );

      if (recentSevereSurvey) {
        setHighlightedUsers((prev) => new Set(prev).add(user.id));
      }

    } catch (error) {
      console.error("Failed to fetch surveys:", error);
      setUserSurveys([]); // Đặt danh sách rỗng nếu có lỗi
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSurveyDateRange([null, null]);
  };

  const filteredSurveys = userSurveys.filter((survey) => {
    if (!surveyDateRange[0] || !surveyDateRange[1]) return true;
    const surveyDate = dayjs(survey.date);
    return surveyDate.isAfter(surveyDateRange[0]) && surveyDate.isBefore(surveyDateRange[1]);
  });

  const isUserHighlighted = (user) => {
    return highlightedUsers.has(user.id);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="pt-4">
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
                  backgroundColor: isUserHighlighted(user)
                    ? "#ffcccb"
                    : "inherit",
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.birthday}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.hobby}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleDetailClick(user)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedUser?.name}'s Surveys</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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
                        survey.depressionLevel === "very_severe_depression" &&
                        dayjs().diff(dayjs(survey.date), "week") < 1
                          ? "#ffcccb"
                          : "inherit",
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
