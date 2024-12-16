/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { Button, Card, CardContent } from "@mui/material";
import { Close } from "@mui/icons-material";

export function CurrentlyPlaying({ playingItem, onClose }) {
  if (!playingItem) return null;
  const isPodcast = playingItem.type === "podcast";

  return (
    <Card
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderTop: "2px solid rgba(255, 255, 255, 0.2)", // Viền nhẹ
        backgroundColor: "rgba(52, 152, 219, 0.8)", // Màu xanh dương trong suốt
        color: "#ffffff",
        backdropFilter: "blur(10px)", // Hiệu ứng mờ nền
        WebkitBackdropFilter: "blur(10px)", // Hỗ trợ Safari
      }}
    >
      <CardContent style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            {/* Spotify Embed */}
            <iframe
              src={`https://open.spotify.com/embed/${
                isPodcast ? "episode" : "track"
              }/${playingItem.id}`}
              width="100%"
              height="80"
              allow="encrypted-media"
              className="rounded-md"
            ></iframe>
          </div>
          <div style={{ marginLeft: "16px" }}>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#e74c3c", // Màu đỏ cho nút đóng
                color: "#ffffff",
                borderRadius: "50%",
                minWidth: "40px",
                height: "40px",
              }}
              onClick={onClose}
            >
              <Close />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
