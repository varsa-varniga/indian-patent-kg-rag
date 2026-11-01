
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Stack, Chip,
} from "@mui/material";
import { AutoAwesome, Search } from "@mui/icons-material";
import SearchBar from "../components/SearchBar";
import SuggestedQueries from "../components/SuggestedQueries";
import FeatureCards from "../components/FeatureCards";

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function runSearch(value) {
    const text = (value || query).trim();
    if (text) navigate(`/search?q=${encodeURIComponent(text)}`);
  }

  return (
    <Box sx={{ py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Chip icon={<Search />} label="RESEARCH WORKSPACE" sx={{ bgcolor: "#E5F5EF", color: "#056653", fontWeight: 700 }} />
        </Stack>

        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 42 } }}>
          What are you researching today?
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4, maxWidth: 700, lineHeight: 1.8 }}>
          Describe an invention or technology to find relevant Indian patents and explore their relationships.
        </Typography>

        <Box sx={{ maxWidth: 900, mb: 7 }}>
          <SearchBar onSearch={runSearch} />
          <SuggestedQueries onSelect={(value) => {
            setQuery(value);
            runSearch(value);
          }} />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <AutoAwesome sx={{ color: "#07866F" }} />
          <Typography variant="h2" fontSize={25}>Research tools</Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Explore the features available in PatentGraph.
        </Typography>
        <FeatureCards />
      </Container>
    </Box>
  );
}
