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
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Search as SearchIcon, 
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    background: {
      default: 'featuresrgba(167, 189, 225, 0.5)',
    },
  },
  typography: {
    fontFamily: 'Rubik, sans-serif',
  },
});

const MainContainer = styled(Container)(({ theme }) => ({
  background: theme.palette.background.default,
  minHeight: '100vh',
  padding: theme.spacing(4),
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#48392A',
  color: 'white',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '12px',
  '&:hover': {
    transform: 'translateY(-5px)',
    transition: 'transform 0.3s ease',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '2.5rem',
    color: '#48392A',
  },
}));

const SearchBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const DateText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  fontSize: '0.75rem',
  color: '#666',
}));

export default function MentalHealthBlog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const features = [
    {
      icon: <MenuBookIcon />,
      title: "Keep up to date with the latest health and social care research",
      description: "We search the sources to find new evidence-based research"
    },
    {
      icon: <GroupsIcon />,
      title: "Connect with experts and colleagues in your field of interest",
      description: "Join evidence-based journal clubs and interactive webinars"
    },
    {
      icon: <SchoolIcon />,
      title: "Track your learning and contribute to your professional development",
      description: "Create reflective practice notes to support your CPD/CME"
    }
  ];

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
    const interval = setInterval(() => fetchPosts(), 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MainContainer maxWidth="lg">
        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  marginBottom: 2,
                }}
              >
                <IconWrapper>{feature.icon}</IconWrapper>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
              </Box>
              <Typography variant="body2">{feature.description}</Typography>
            </FeatureCard>
          </Grid>
        ))}
        </Grid>

        {/* Search Section */}
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
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => fetchPosts(searchTerm)}
            sx={{
              backgroundColor: '#48392A',
              '&:hover': {
                backgroundColor: '#362B20',
              },
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchPosts()}
            sx={{
              borderColor: '#48392A',
              color: '#48392A',
              '&:hover': {
                borderColor: '#362B20',
                color: '#362B20',
              },
            }}
          >
            Refresh
          </Button>
        </SearchBar>

        {/* Posts Grid */}
        <Grid container spacing={4}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <BlogCard>
                <CardContent sx={{ position: 'relative', pt: 6 }}>
                  <DateText>
                    {new Date(post.pubDate).toLocaleDateString()}
                  </DateText>
                  <IconWrapper sx={{ mx: 'auto', mb: 2 }}>
                    <MenuBookIcon />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom align="center">
                    {post.title}
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      sx={{
                        backgroundColor: '#48392A',
                        '&:hover': {
                          backgroundColor: '#362B20',
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </BlogCard>
            </Grid>
          ))}
        </Grid>
        <ToastContainer position="bottom-right" />
      </MainContainer>
    </ThemeProvider>
  );
}