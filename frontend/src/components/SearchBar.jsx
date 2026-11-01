
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const text = query.trim();
    if (!text) return;

    onSearch?.(text);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1.25,
        alignItems: "stretch",
        width: "100%",
        minWidth: 0,
        scrollMarginTop: "100px",
      }}
    >
      <TextField
        id="patent-search-input"
        fullWidth
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Describe an invention, technology, or patent..."
        aria-label="Search Indian patents"
        size="medium"
        sx={{
          minWidth: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#FFFFFF",
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        startIcon={<Search />}
        sx={{
          px: 3,
          minHeight: 50,
          borderRadius: 3,
          bgcolor: "#07866F",
          color: "#FFFFFF",
          textTransform: "none",
          fontWeight: 700,
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: "#056653" },
        }}
      >
        Search
      </Button>
    </Box>
  );
}
