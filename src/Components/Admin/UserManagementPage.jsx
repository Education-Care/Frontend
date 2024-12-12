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
  Switch
} from '@mui/material';
import { toast } from 'react-toastify';

export default function UserManagementPage() {
  const [users, setUsers] = useState([
    { id: 1, username: "john_doe", email: "john@example.com", status: true },
    { id: 2, username: "jane_smith", email: "jane@example.com", status: false },
  ]);
  const [newUser, setNewUser] = useState({ username: "", email: "" });

  const addUser = () => {
    if (newUser.username && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1, status: true }]);
      setNewUser({ username: "", email: "" });
      toast.success("User added successfully");
    }
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: !user.status } : user
    ));
    toast.success("User status updated successfully");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={(e) => { e.preventDefault(); addUser(); }} style={{ marginBottom: '20px' }}>
          <TextField
            label="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            margin="normal"
            required
            type="email"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Add User
          </Button>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status}
                      onChange={() => toggleUserStatus(user.id)}
                      color="primary"
                    />
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

