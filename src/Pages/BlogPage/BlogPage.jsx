import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GreenThemeContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #e0f7fa, #e8f5e9)',
  minHeight: '100vh',
  padding: theme.spacing(4),
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const Title = styled(Typography)(({ theme }) => ({
  color: '#1b5e20',
  fontWeight: 'bold',
  fontSize: '2.5rem',
  marginBottom: theme.spacing(4),
  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
}));

const SearchBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const BlogDescription = styled(Typography)(({ theme }) => ({
  color: '#424242',
  fontSize: '0.95rem',
  lineHeight: 1.6,
}));

const BlogCategory = styled(Typography)(({ theme }) => ({
  color: '#1b5e20',
  fontWeight: 'bold',
}));

export default function MentalHealthBlog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async (search = '') => {
    try {
      const response = await axios.get(`http://localhost:3000/api/blog?search=${search}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      toast.error('Failed to fetch blog posts. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(() => fetchPosts(), 3600000); // Refresh every hour
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    fetchPosts(searchTerm);
  };

  return (
    <GreenThemeContainer maxWidth="lg">
      <Title variant="h2" align="center" style={{ color: "#004aad" }}>
        Mental Health & Depression Information
      </Title>

      <SearchBar>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for mental health topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
        <StyledButton
          variant="contained"
          startIcon={<SearchIcon />}
          style={{ background: "#004aad" , borderRadius:'12px'}}
          onClick={handleSearch}
        >
          Search
        </StyledButton>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => fetchPosts()}
          sx={{
            borderColor: '#004aad',
            borderRadius: '12px',
            color: '#004aad',
            fontWeight: 'bold',
            '&:hover': {
              borderColor: '#388e3c',
              color: '#388e3c',
            },
          }}
        >
          Refresh
        </Button>
      </SearchBar>

      <Grid container spacing={4}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BlogCard>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {post.title}
                </Typography>
                <BlogDescription
                  variant="body2"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />
                <Typography variant="caption" display="block" marginTop={2}>
                  Published: {new Date(post.pubDate).toLocaleDateString()}
                </Typography>
                <BlogCategory variant="caption" display="block">
                  Categories: {post.categories.join(', ')}
                </BlogCategory>
                <Button
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  sx={{
                    marginTop: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  Read More
                </Button>
              </CardContent>
            </BlogCard>
          </Grid>
        ))}
      </Grid>
      <ToastContainer position="bottom-right" />
    </GreenThemeContainer>
  );
}
