import React, { useState } from "react";
import { TextField, Box, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export function Search({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Box sx={{ display: "flex", mb: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search podcasts, music, etc."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => onSearch(searchValue)}>
              <SearchIcon />
            </IconButton>
          ),
        }}
        sx={{ mr: 2 }}
      />
    </Box>
  );
}
