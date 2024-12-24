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

const DepressionLevel = {
  NoDepression: "no_depression",
  MildDepression: "mild_depression",
  ModerateDepression: "moderate_depression",
  SevereDepression: "severe_depression",
  VerySevereDepression: "very_severe_depression",
};

function evaluateAnxiety(depressionLevel: string): string {
  switch (depressionLevel) {
    case DepressionLevel.NoDepression:
      return "Đánh giá lo âu: Bình thường.";
    case DepressionLevel.MildDepression:
      return "Đánh giá lo âu: Bạn ở mức trầm cảm tối thiểu.";
    case DepressionLevel.ModerateDepression:
      return "Đánh giá lo âu: Bạn có dấu hiệu trầm cảm nhẹ.";
    case DepressionLevel.SevereDepression:
      return "Đánh giá lo âu: Bạn có dấu hiệu trầm cảm trung bình.";
    case DepressionLevel.VerySevereDepression:
      return "Đánh giá lo âu: Bạn có dấu hiệu trầm cảm nặng.";
    default:
      return "Đánh giá lo âu: Không xác định được mức độ trầm cảm.";
  }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));
const ReseultServey = () => {
  const location = useLocation(); // Lấy thông tin location từ useLocation
  const [suggestions, setSuggestions] = useState();
  const [depressionLevel, setDepressionLevel] = useState();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingItem, setPlayingItem] = useState(null);

  // Lấy totalScore từ state khi navigate
  const { totalScore, depressionLevel: levelFromState } = location.state;

  useEffect(() => {
    const fetchEntertainmentByDepressionLevel = async () => {
      try {
        const response = await getEntertainmentItem({
          isUser: true,
        });
        setRecommendations(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (depressionLevel) {
      fetchEntertainmentByDepressionLevel();
    }
  }, [depressionLevel]);

  useEffect(() => {
    if (levelFromState) {
      setDepressionLevel(levelFromState);
      fetchSuggestionByDepressionLevel(levelFromState); // Gọi hàm fetchSuggestionByDepressionLevel nếu depressionLevel có
    }
    setLoading(false); // Dừng loading nếu không có level
  }, [levelFromState]);

  const fetchSuggestionByDepressionLevel = async () => {
    try {
      const response = await getSuggestionByDepressionLevel(levelFromState);
      console.log("responseNha", response)
      setSuggestions(response.suggestion);
      setRecommendations(getRecommendationsByLevel(levelFromState));
    } catch (err) {
      toast.error("Lỗi khi lấy suggestion", {
        toastId: "not-found-suggestion",
      });
    }
    setLoading(false); // Dừng loading nếu không có level
  };

  const getRecommendationsByLevel = (level: string) => {
    switch (level) {
      case DepressionLevel.NoDepression:
        return [
          {
            id: 1,
            icon: <LightbulbOutlined />,
            title: "Duy trì sức khỏe tinh thần",
            description: "Tìm hiểu các phương pháp giữ gìn sức khỏe tinh thần tốt",
          },
          {
            id: 2,
            icon: <DirectionsRunOutlined />,
            title: "Hoạt động thể chất",
            description: "Khám phá các bài tập thể dục giúp cải thiện tâm trạng",
          },
          {
            id: 3,
            icon: <FavoriteBorderOutlined />,
            title: "Quản lý sức khỏe tinh thần",
            description: "Học cách xây dựng và duy trì các mối quan hệ lành mạnh",
          },
        ];
      case DepressionLevel.MildDepression:
        return [
          {
            id: 1,
            icon: <LightbulbOutlined />,
            title: "Kỹ thuật thư giãn",
            description: "Học các phương pháp thư giãn để giảm căng thẳng",
          },
          {
            id: 2,
            icon: <DirectionsRunOutlined />,
            title: "Thiền định cơ bản",
            description: "Khám phá lợi ích của thiền định đối với sức khỏe tinh thần",
          },
          {
            id: 3,
            icon: <FavoriteBorderOutlined />,
            title: "Tư vấn trực tuyến",
            description: "Tham gia các buổi tư vấn trực tuyến với chuyên gia tâm lý",
          },
        ];
      case DepressionLevel.ModerateDepression:
        return [
          {
            id: 1,
            icon: <LightbulbOutlined />,
            title: "Liệu pháp nhận thức hành vi",
            description: "Tìm hiểu về CBT và cách áp dụng vào cuộc sống hàng ngày",
          },
          {
            id: 2,
            icon: <DirectionsRunOutlined />,
            title: "Kế hoạch hoạt động",
            description: "Xây dựng kế hoạch hoạt động hàng ngày để cải thiện tâm trạng",
          },
          {
            id: 3,
            icon: <FavoriteBorderOutlined />,
            title: "Nhóm hỗ trợ trực tuyến",
            description: "Tham gia các nhóm hỗ trợ trực tuyến để chia sẻ và học hỏi",
          },
        ];
      case DepressionLevel.SevereDepression:
      case DepressionLevel.VerySevereDepression:
        return [
          {
            id: 1,
            icon: <LightbulbOutlined />,
            title: "Tư vấn chuyên sâu",
            description: "Đặt lịch tư vấn trực tiếp với bác sĩ tâm lý",
          },
          {
            id: 2,
            icon: <DirectionsRunOutlined />,
            title: "Kế hoạch điều trị",
            description: "Xây dựng kế hoạch điều trị cá nhân hóa với chuyên gia",
          },
          {
            id: 3,
            icon: <FavoriteBorderOutlined />,
            title: "Hỗ trợ khẩn cấp",
            description: "Thông tin về các đường dây nóng và dịch vụ hỗ trợ khẩn cấp",
          },
        ];
      default:
        return [];
    }
  };
  const getCuratedWebsiteUrl = (title) => {
    switch (title) {
      case "Duy trì sức khỏe tinh thần":
        return "https://www.vinmec.com/vie/bai-viet/lam-nao-de-cai-thien-suc-khoe-tinh-than-vi";
      case "Hoạt động thể chất":
        return "https://songkhoe.medplus.vn/hoat-dong-the-chat-co-the-nang-cao-suc-khoe-tinh-than/";
      case "Quản lý sức khỏe tinh thần":
        return "https://hellobacsi.com/tam-ly-tam-than/moi-quan-he/suc-khoe-tinh-than/";
      case "Kỹ thuật thư giãn":
        return "https://www.health.harvard.edu/mind-and-mood/six-relaxation-techniques-to-reduce-stress";
      case "Thiền định cơ bản":
        return "https://www.mindful.org/how-to-meditate/";
      case "Tư vấn trực tuyến":
        return "https://www.betterhelp.com/";
      case "Liệu pháp nhận thức hành vi":
        return "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral";
      case "Kế hoạch hoạt động":
        return "https://www.verywellmind.com/behavioral-activation-plan-for-depression-5095436";
      case "Nhóm hỗ trợ trực tuyến":
        return "https://www.nami.org/Support-Education/Support-Groups";
      case "Tư vấn chuyên sâu":
        return "https://www.psychologytoday.com/us/therapists";
      case "Kế hoạch điều trị":
        return "https://www.nimh.nih.gov/health/topics/depression";
      case "Hỗ trợ khẩn cấp":
        return "https://suicidepreventionlifeline.org/";
      default:
        return "#";
    }
  };
console.log("recommendations", recommendations)
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md">
      <div className="bg-white">
        {/* Section Banner */}
        <div className="relative pt-8 container mx-auto">
          <h2 className="flex text-center max-w-[37.5rem] mx-auto justify-center uppercase text-2xl mb-2 font-bold text-blue-900">
            Cảm ơn bạn đã hoàn thành bài test
          </h2>
          <h2 className="flex text-center max-w-[37.5rem] mx-auto justify-center uppercase text-2xl mb-8 font-bold text-blue-900">
            Dưới đây là kết quả
          </h2>
          <div className="max-w-[37.5rem] mx-auto text-center bg-[#e5f1ff] shadow-xl rounded-xl p-4">
            <p className="text-blue-900 font-semibold">Điểm của bạn</p>
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
            Khám phá ngay
          </Typography>
        </Box>
        <div className="relative container mx-auto mb-8">
        <p className="w-full text-sm text-center mb-8 px-20">
          Dựa trên kết quả của bạn, hãy thử lắng nghe những gì chúng tôi đề xuất
        </p>
        <GridItems onPlay={setPlayingItem} items={recommendations} />
      </div>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {recommendations.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <StyledPaper>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {React.cloneElement(item.icon, { color: 'primary', fontSize: 'large' })}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{item.description}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForward />}
                    sx={{ mt: 2 }}
                    href={getCuratedWebsiteUrl(item.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tìm hiểu thêm
                  </Button>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" align="center" color="text.primary" gutterBottom>
            Các tài nguyên hữu ích
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#e8f5e9' }}>
                <Typography variant="h6" gutterBottom>Bài viết mới nhất</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Cách đối phó với stress trong công việc" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="5 bài tập thư giãn đơn giản tại nhà" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Tầm quan trọng của giấc ngủ đối với sức khỏe tinh thần" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
                <Typography variant="h6" gutterBottom>Podcast gợi ý</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Hành trình vượt qua trầm cảm" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kỹ năng giao tiếp hiệu quả" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Thiền định cho người mới bắt đầu" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#fff8e1' }}>
                <Typography variant="h6" gutterBottom>Sự kiện sắp diễn ra</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Hội thảo: Sức khỏe tinh thần trong thời đại số" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Workshop: Xây dựng lòng tự trọng và sự tự tin" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Buổi chia sẻ: Trải nghiệm vượt qua khủng hoảng" />
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