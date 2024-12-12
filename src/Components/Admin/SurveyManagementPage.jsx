import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { toast } from 'react-toastify';

const questionTypes = ["SurveyTextInput", "SurveyRadioInput", "SurveySelectInput"];

export default function SurveyManagementPage() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "SurveyTextInput",
    options: "",
  });

  const addOrUpdateQuestion = () => {
    if (newQuestion.text && newQuestion.type) {
      if (newQuestion.id) {
        setQuestions(questions.map(q => q.id === newQuestion.id ? newQuestion : q));
        toast.success("Question updated successfully");
      } else {
        setQuestions([...questions, { ...newQuestion, id: questions.length + 1 }]);
        toast.success("Question added successfully");
      }
      setNewQuestion({ text: "", type: "SurveyTextInput", options: "" });
    }
  };

  const editQuestion = (question) => {
    setNewQuestion(question);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Survey Question Management
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={(e) => { e.preventDefault(); addOrUpdateQuestion(); }} style={{ marginBottom: '20px' }}>
          <TextField
            label="Question Text"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
            >
              {questionTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {(newQuestion.type === "SurveyRadioInput" || newQuestion.type === "SurveySelectInput") && (
            <TextField
              label="Options (comma-separated)"
              value={newQuestion.options}
              onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
              fullWidth
              margin="normal"
            />
          )}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {newQuestion.id ? "Update Question" : "Add Question"}
          </Button>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.text}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>{question.options}</TableCell>
                  <TableCell>
                    <Button onClick={() => editQuestion(question)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

