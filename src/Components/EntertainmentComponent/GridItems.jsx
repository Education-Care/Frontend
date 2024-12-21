import React from "react";
import { Card, CardContent, Button } from "@mui/material";
import { PlayCircle } from "@mui/icons-material";

export default function GridItems({ onPlay, items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 relative h-full">
            <img
              src={item.image || "/placeholder.svg?height=200&width=200"}
              alt={item.title}
              className="w-full rounded-md mb-2"
            />
            <h3
              className="font-semibold text-lg mb-2 line-clamp-2"
              title={item.title}
            >
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{item.author}</p>
            <Button
              variant="outlined"
              size="small"
              className="bottom-0 right-0 left-0 !relative w-full text-[#2baadf] border-[#2baadf]"
              onClick={() => {
                onPlay({
                  type: "item",
                  link: item.link,
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
