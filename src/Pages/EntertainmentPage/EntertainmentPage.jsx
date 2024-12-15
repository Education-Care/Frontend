import React, { useState, useEffect } from "react";
import { PodcastGrid } from "../../Components/EntertainmentComponent/PodcastGrid";
import { MusicGrid } from "../../Components/EntertainmentComponent/MusicGrid";
import { Button } from "@mui/material";
import { CurrentlyPlaying } from "../../Components/EntertainmentComponent/CurrentlyPlaying";
import { Search } from "../../Components/EntertainmentComponent/Search";
import { getAlbum, getTrack, getPodcast } from "../../services/entertainment/spotify";
import { useNavigate } from "react-router-dom"; 



export default function EntertainmentPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingItem, setPlayingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [musicResults, setMusicResults] = useState([]);
  const [podcastResults, setPodcastResults] = useState([]);
  const [limit, setLimit] = useState(10); // Hiển thị tối đa 10 bài nhạc

  useEffect(() => {
    const fetchMusicWithImages = async () => {
      try {
        const albumData = await getAlbum("3wS2gclZM6OODokFof3cvv");
        const tracks = albumData.tracks.items;

        // Lọc và chỉ gọi API cho những bài nhạc thiếu ảnh
        const enhancedTracks = await Promise.all(
          tracks.map(async (track) => {
            if (!track.album?.images?.length) {
              const trackDetails = await getTrack(track.id); // Gọi API để lấy ảnh
              return {
                ...track,
                album: trackDetails.album, // Bổ sung album vào bài nhạc
              };
            }
            return track; // Nếu đã có ảnh, trả về bài nhạc gốc
          })
        );

        setMusicResults(enhancedTracks);
      } catch (err) {
        console.error("Error fetching tracks with images:", err);
      }
    };

    fetchMusicWithImages();
  }, [searchQuery]);
//PodcastPodcast
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const podcastData = await getPodcast("5AvwZVawapvyhJUIx71pdJ"); // ID của podcast
        const episodes = podcastData.episodes.items;
  
        setPodcastResults(episodes.slice(0, 5)); // Lấy 5 tập podcast đầu tiên
      } catch (err) {
        console.error("Error fetching podcasts:", err);
      }
    };
  
    fetchPodcasts();
  }, []);

  // Lấy danh sách nhạc giới hạn
  const displayedMusicResults = musicResults.slice(0, limit);

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
            marginBottom: "32px",
            color: "#2baadf",
          }}
        >
          Entertainment Hub
        </h1>

        <Search onSearch={setSearchQuery} />
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
            <PodcastGrid onPlay={setPlayingItem} podcasts={podcastResults} />
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
            <MusicGrid onPlay={setPlayingItem} music={displayedMusicResults} />

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
