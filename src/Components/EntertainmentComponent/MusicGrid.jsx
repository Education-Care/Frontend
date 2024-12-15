import React from 'react';
import { Card, CardContent, Button } from '@mui/material';
import { PlayCircle } from '@mui/icons-material';

export function MusicGrid({ onPlay, music }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {music.map((item) => (
        <Card key={item.id}>
          <CardContent style={{ padding: '16px' }}>
            <img
              src={item.images?.[0]?.url || item.album?.images?.[0]?.url || "https://placehold.co/200.png"}
              alt={item.name}
              style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '8px' }}
            />
            <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{item.name}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
              {item.artists?.[0]?.name || item.album?.artists?.[0]?.name}
            </p>
            <Button 
              variant="outlined" 
              size="small" 
              style={{ width: '100%', borderColor: '#2baadf', color: '#2baadf' }}
              onClick={() => onPlay({ 
                type: 'music', 
                title: item.name, 
                creator: item.artists?.[0]?.name || item.album?.artists?.[0]?.name,
                imageUrl: item.images?.[0]?.url || item.album?.images?.[0]?.url,
                audioSrc: item.preview_url, // URL nhạc từ Spotify
                trackId: item.id, // Thêm trackId cho SpotifyEmbed
              })}
            >
              <PlayCircle style={{ marginRight: '8px' }} /> Play
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}