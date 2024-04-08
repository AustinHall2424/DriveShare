import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
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