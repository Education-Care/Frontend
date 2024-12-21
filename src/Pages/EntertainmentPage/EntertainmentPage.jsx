import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentlyPlaying } from "../../Components/EntertainmentComponent/CurrentlyPlaying";
import GridItems from "../../Components/EntertainmentComponent/GridItems";
import { Search } from "../../Components/EntertainmentComponent/Search";
import { getEntertainmentItem } from "../../services/entertainment/management";

export default function EntertainmentPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingItem, setPlayingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [musicResults, setMusicResults] = useState([]);
  const [podcastResults, setPodcastResults] = useState([]);
  const [limit, setLimit] = useState(10);

  // Music
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const music = await getEntertainmentItem({
          type: "music",
          searchTerm: searchQuery,
        });
        setMusicResults(music.data);
      } catch (err) {
        console.error("Error fetching tracks with images:", err);
      }
    };

    fetchMusics();
  }, [searchQuery]);

  // Podcast
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const podcasts = await getEntertainmentItem({
          type: "podcast",
          searchTerm: searchQuery,
        });
        setPodcastResults(podcasts.data);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
      }
    };

    fetchPodcasts();
  }, [searchQuery]);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#ffffff",
        color: "#ffffff",
        height: "auto",
      }}
    >
      {/* Sidebar */}
      <div
        style={{ width: "250px", padding: "20px", backgroundColor: "white" }}
      >
        <h2 style={{ color: "#2baadf" }}>EduCare Hub</h2>
        <Button
          fullWidth
          variant={activeCategory === "all" ? "contained" : "outlined"}
          onClick={() => setActiveCategory("all")}
          style={{
            marginBottom: "10px",
            color: activeCategory === "all" ? "white" : "#2baadf",
          }}
        >
          All
        </Button>
        <Button
          fullWidth
          variant={activeCategory === "podcasts" ? "contained" : "outlined"}
          onClick={() => setActiveCategory("podcasts")}
          style={{
            marginBottom: "10px",
            color: activeCategory === "podcasts" ? "white" : "#2baadf",
          }}
        >
          Podcasts
        </Button>
        <Button
          fullWidth
          variant={activeCategory === "music" ? "contained" : "outlined"}
          onClick={() => setActiveCategory("music")}
          style={{
            marginBottom: "10px",
            color: activeCategory === "music" ? "white" : "#2baadf",
          }}
        >
          Music
        </Button>
        <Button
          fullWidth
          variant="outlined"
          style={{ marginBottom: "10px", color: "#2baadf" }}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#2baadf",
          }}
          className="mb-4"
        >
          Entertainment Hub
        </h1>

        <Search onSearch={setSearchQuery} />
        <hr className="w-full h-px text-gray-500" />
        {(activeCategory === "all" || activeCategory === "podcasts") && (
          <section style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#2baadf",
              }}
            >
              Recommment Podcasts
            </h2>
            <GridItems onPlay={setPlayingItem} items={podcastResults} />
          </section>
        )}

        {(activeCategory === "all" || activeCategory === "music") && (
          <section>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#2baadf",
              }}
            >
              Recommment Music
            </h2>
            <GridItems onPlay={setPlayingItem} items={musicResults} />

            {/* Nút Show More */}
            {musicResults.length > limit && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Button
                  variant="outlined"
                  style={{ color: "#2baadf", borderColor: "#2baadf" }}
                  onClick={() => setLimit((prev) => prev + 10)} // Tăng số bài nhạc hiển thị
                >
                  Show More
                </Button>
              </div>
            )}
          </section>
        )}

        <CurrentlyPlaying
          playingItem={playingItem}
          onClose={() => setPlayingItem(null)}
        />
      </div>
    </div>
  );
}
