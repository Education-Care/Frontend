import React from 'react';
import { TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export function Search({ onSearch }) {
  return (
    <div style={{ position: 'relative' }}>
      <SearchIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
      <TextField
        type="search"
        placeholder="Search podcasts and music..."
        variant="outlined"
        style={{ paddingLeft: '40px', width: '100%', backgroundColor: 'white', borderColor: '#2baadf' }}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}