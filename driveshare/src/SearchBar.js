import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <Stack spacing={2} sx={{ width: "50%" }}>
      <TextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        InputProps={{
          type: 'search',
        }}
      />
    </Stack>
  );
}

export default SearchBar;