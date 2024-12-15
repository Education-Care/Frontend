import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { Pause, SkipNext } from '@mui/icons-material';

export function PlayModal({ playingItem, onClose }) {
  if (!playingItem) return null;

  return (
    <Dialog open={!!playingItem} onClose={onClose}>
      <DialogContent style={{ maxWidth: '425px' }}>
        <DialogTitle>Now Playing</DialogTitle>
        <div style={{ padding: '16px 0' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>{playingItem.title}</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {playingItem.type === 'podcast' ? 'Hosted by' : 'by'} {playingItem.creator}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button variant="outlined" size="small">
            <Pause />
          </Button>
          <Button variant="outlined" size="small">
            <SkipNext />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}