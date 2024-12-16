import React from "react";
import { Card, CardContent, Button } from "@mui/material";
import { PlayCircle } from "@mui/icons-material";

export function PodcastGrid({ onPlay, podcasts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {podcasts.map((podcast) => (
        <Card key={podcast.id}>
          <CardContent className="p-4 relative h-full">
            <img
              src={
                podcast.images[0]?.url ||
                "/placeholder.svg?height=200&width=200"
              }
              alt={podcast.name}
              className="w-full rounded-md mb-2"
            />
            <h3
              className="font-semibold text-lg mb-2 line-clamp-2"
              title={podcast.name}
            >
              {podcast.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {podcast.publisher || podcast.show?.name}
            </p>
            <Button
              variant="outlined"
              size="small"
              className="bottom-0 right-0 left-0 !relative w-full text-[#2baadf] border-[#2baadf]"
              onClick={() => {
                onPlay({
                  type: "podcast",
                  id: podcast.id,
                });
              }}
            >
              <PlayCircle className="mr-2" /> Play
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
