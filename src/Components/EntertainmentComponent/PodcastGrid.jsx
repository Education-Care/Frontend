import React from 'react';
import { Card, CardContent, Button } from '@mui/material';
import { PlayCircle } from '@mui/icons-material';

export function PodcastGrid({ onPlay, podcasts }) {
  return (
    <div style={{ display: ' grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {podcasts.map((podcast) => (
        <Card key={podcast.id}>
          <CardContent style={{ padding: '16px' }}>
            <img
              src={podcast.images[0]?.url || "/placeholder.svg?height=200&width=200"}
              alt={podcast.name}
              style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '8px' }}
            />
            <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{podcast.name}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
              {podcast.publisher || podcast.show?.name}
            </p>
            <Button 
              variant="outlined" 
              size="small" 
              style={{ width: '100%', borderColor: '#2baadf', color: '#2baadf' }}
              onClick={() => onPlay({ 
                type: 'podcast', 
                title: podcast.name, 
                creator: podcast.publisher || podcast.show?.name,
                imageUrl: podcast.images[0]?.url
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