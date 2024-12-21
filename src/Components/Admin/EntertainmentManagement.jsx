import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  TextField,
  Button,
  Modal,
  Fade,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  getEntertainmentItem,
  createEntertainmentItem,
  deleteEntertainmentItem,
  getEntertainmentItemById,
  updateEntertainmentItem,
} from "../../services/entertainment/management";
import { toast } from "react-toastify";

export default function EntertainmentManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [entertainmentData, setEntertainmentData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDelOpen, setIsModalDelOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form state
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    type: "music",
    author: "",
    depressionLevel: "no_depression",
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEntertainmentItem({
          searchTerm,
          currentPage,
        });

        setEntertainmentData(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [searchTerm, isLoading, currentPage]);

  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditItem = (id) => {
    getEntertainmentItemById(id)
      .then((data) => {
        setFormData(data);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to get item data");
      });

    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (editItem) {
      updateEntertainmentItem(editItem, formData)
        .then((data) => {
          toast.success(data.message);
        })
        .catch((error) => {
          toast.error(error.message || "Failed to update item");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      createEntertainmentItem(formData)
        .then((data) => {
          toast.success(data.message);
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create item");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    setEditItem(null);
    setFormData({
      title: "",
      link: "",
      type: "music",
      author: "",
      depressionLevel: "no_depression",
      image: "",
    });
    setIsModalOpen(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteItem = (id) => {
    setIsLoading(true);
    deleteEntertainmentItem(id)
      .then((data) => {
        toast.success(data.message);
        setIsLoading(true);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to delete item");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="pt-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Entertainment Management
      </Typography>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{ mr: 2 }}
        />
      </Box>
      {/* action button */}
      <Box sx={{ display: "flex", mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add New
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Depression Level</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entertainmentData?.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.image || "https://via.placeholder.com/50"}
                    alt={item.title}
                    className="w-[50px] h-[50px] object-cover"
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>{item.depressionLevel}</TableCell>
                <TableCell>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center no-underline"
                  >
                    View <LaunchIcon className="ml-1 text-base" />
                  </a>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditItem(item.id);
                      handleEditItem(item.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeletingItem(item.id);
                      setIsModalDelOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={entertainmentData.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {/* Modal Add new */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        disableScrollLock
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {editItem ? "Edit Item" : "Add New Item"}
            </Typography>
            <form onSubmit={handleSubmit} className="m-0 p-0">
              <TextField
                fullWidth
                margin="normal"
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="link"
                label="Link"
                value={formData.link}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                name="image"
                label="Image URL"
                value={formData.image}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                  required
                >
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="podcast">Podcast</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Depression Level</InputLabel>
                <Select
                  labelId="depression-level-label"
                  name="depressionLevel"
                  value={formData.depressionLevel}
                  onChange={handleInputChange}
                  label="Depression Level"
                  required
                >
                  <MenuItem value="no_depression">No Depression</MenuItem>
                  <MenuItem value="mild_depression">Mild Depression</MenuItem>
                  <MenuItem value="moderate_depression">
                    Moderate Depression
                  </MenuItem>
                  <MenuItem value="severe_depression">
                    Severe Depression
                  </MenuItem>
                  <MenuItem value="very_severe_depression">
                    Very Severe Depression
                  </MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setIsModalOpen(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editItem ? "Update" : "Add"} Item
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* Modal confirm delete */}
      <Modal
        open={isModalDelOpen}
        onClose={() => setIsModalDelOpen(false)}
        closeAfterTransition
        disableScrollLock
      >
        <Fade in={isModalDelOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Are you sure you want to delete this item?
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsModalDelOpen(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteItem(deletingItem);
                  setIsModalDelOpen(false);
                }}
              >
                Delete Item
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
