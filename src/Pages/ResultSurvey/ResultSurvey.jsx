import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Thêm useLocation
import { getSuggestionByDepressionLevel } from "../../services/suggestions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getEntertainmentItem } from "../../services/entertainment/management";
import GridItems from "../../Components/EntertainmentComponent/GridItems";
import CurrentlyPlaying from "../../Components/EntertainmentComponent/CurrentlyPlaying";
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Button, 
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  LightbulbOutlined, 
  DirectionsRunOutlined, 
  FavoriteBorderOutlined, 
  ArrowForward 
} from "@mui/icons-material";
import axios from 'axios';

const DepressionLevel = {
  NoDepression: "minimal_depression",
  MildDepression: "mild_depression",
  ModerateDepression: "moderate_depression",
  SevereDepression: "moderately_severe_depression",
  VerySevereDepression: "severe_depression",
};

function evaluateAnxiety(depressionLevel: string): string {
  switch (depressionLevel) {
    case DepressionLevel.NoDepression:
      return "minimal_depression";
    case DepressionLevel.MildDepression:
      return "mild_depression";
    case DepressionLevel.ModerateDepression:
      return "moderate_depression";
    case DepressionLevel.SevereDepression:
      return "moderately_severe_depression";
    case DepressionLevel.VerySevereDepression:
      return "severe_depression";
    default:
      return "no determine";
  }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'all 0.3s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%', 
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));
const ReseultServey = () => {
  const location = useLocation(); // Lấy thông tin location từ useLocation
  const [suggestions, setSuggestions] = useState();
  const [depressionLevel, setDepressionLevel] = useState();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  // Lấy totalScore từ state khi navigate
  const { totalScore, depressionLevel: levelFromState } = location.state;

  useEffect(() => {
    if (levelFromState) {
      setDepressionLevel(levelFromState);
      fetchSuggestionByDepressionLevel(levelFromState);
      fetchBlogs(levelFromState);
    }
    setLoading(false);
  }, [levelFromState]);

  const fetchSuggestionByDepressionLevel = async () => {
    try {
      const response = await getSuggestionByDepressionLevel(levelFromState);
      console.log("responseNha", response)
      setSuggestions(response.suggestion);
    } catch (err) {
      toast.error("Lỗi khi lấy suggestion", {
        toastId: "not-found-suggestion",
      });
    }
    setLoading(false); 
  };
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/blog`);
      setBlogs(response.data.slice(0, 3));
    } catch (err) {
      toast.error("Error fetching blogs", {
        toastId: "blog-fetch-error",
      });
    }
  };
console.log("blogs", blogs)
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md">
      <div className="bg-white">
        {/* Section Banner */}
        <div className="relative pt-8 container mx-auto">
          <h2 className="flex text-center max-w-[37.5rem] mx-auto justify-center uppercase text-2xl mb-2 font-bold text-blue-900">
            Thank you for completing the test
          </h2>
          <h2 className="flex text-center max-w-[37.5rem] mx-auto justify-center uppercase text-2xl mb-8 font-bold text-blue-900">
            Here are your results
          </h2>
          <div className="max-w-[37.5rem] mx-auto text-center bg-[#e5f1ff] shadow-xl rounded-xl p-4">
            <p className="text-blue-900 font-semibold">Your score</p>
            <p className="my-4 text-blue-900 font-bold text-9xl">{totalScore}</p>
            <p className="text-blue-900 text-sm">
              {evaluateAnxiety(depressionLevel)}
            </p>
          </div>
          <hr className="text-gray-600 my-4 " />
        </div>
      </div>

      <Box sx={{ my: 4 }}>
          <Typography variant="body1" align="center" paragraph>
            {suggestions}
          </Typography>
          <Typography variant="h5" align="center" color="text.primary" gutterBottom>
            Explore Now
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {blogs.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <StyledPaper>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {item.icon ? (
                    React.cloneElement(item.icon, { color: 'primary', fontSize: 'large' })
                  ) : (
                    <FavoriteBorderOutlined color="primary" fontSize="large" />
                  )}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                  sx={{ mt: 2 }}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More
                </Button>
              </StyledPaper>
            </Grid>
          ))}
          </Grid>
        )}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" align="center" color="text.primary" gutterBottom>
            Useful Resources
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#e8f5e9', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Latest Articles</Typography>
                <List sx={{ flexGrow: 1 }}>
                  {blogs.map((blog, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={blog.title} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Recommended Podcasts</Typography>
                <List sx={{ flexGrow: 1 }}>
                  <ListItem>
                    <ListItemText primary="Journey of Overcoming Depression" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Effective Communication Skills" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Meditation for Beginners" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#fff8e1', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
                <List sx={{ flexGrow: 1 }}>
                  <ListItem>
                    <ListItemText primary="Seminar: Mental Health in the Digital Age" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Workshop: Building Self-Esteem and Confidence" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Sharing Session: Experiences in Overcoming Crises" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Button
            component={Link}
            to="/Entertainment"
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<FavoriteBorderOutlined />}
          >
            Looking for something fun? Visit our Entertainment page!
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ReseultServey;