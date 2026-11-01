
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Delete,
  History,
  Search,
} from "@mui/icons-material";

export default function SearchHistoryPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("patentgraph_history") || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  function clearHistory() {
    try {
      localStorage.removeItem("patentgraph_history");
      setHistory([]);
    } catch (error) {
      console.error("Unable to clear search history:", error);
    }
  }

  function searchAgain(query) {
    if (!query || !query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Page heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <History sx={{ color: "#07866F", fontSize: 30 }} />

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 25, sm: 30, md: 32 },
              fontWeight: 800,
              color: "#17221F",
            }}
          >
            Search History
          </Typography>
        </Stack>

        {history.length > 0 && (
          <Button
            color="error"
            variant="outlined"
            startIcon={<Delete />}
            onClick={clearHistory}
            sx={{
              alignSelf: { xs: "flex-start", sm: "auto" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Clear history
          </Button>
        )}
      </Stack>

      <Typography
        color="text.secondary"
        sx={{
          mb: 4,
          fontSize: { xs: 14, sm: 15 },
          lineHeight: 1.7,
        }}
      >
        Revisit your recent patent searches.
      </Typography>

      {/* Empty state */}
      {history.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            border: "1px solid #DFE7E3",
            borderRadius: 3,
            bgcolor: "#FFFFFF",
          }}
        >
          <History
            sx={{
              fontSize: 46,
              color: "#9BAEA6",
              mb: 1,
            }}
          />

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#17221F",
              mb: 1,
            }}
          >
            No search history yet
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            Your recent searches will appear here after you search for patents.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#07866F",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#056653",
              },
            }}
          >
            Start searching
          </Button>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {history.map((item, index) => {
            const query =
              typeof item === "string"
                ? item
                : item?.query || "";

            if (!query.trim()) return null;

            return (
              <Paper
                key={`${query}-${index}`}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  border: "1px solid #DFE7E3",
                  borderRadius: 3,
                  bgcolor: "#FFFFFF",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: "#07866F",
                    boxShadow: "0 4px 14px rgba(20, 60, 45, 0.05)",
                  },
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#17221F",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {query}
                    </Typography>

                    {typeof item === "object" && item?.searchedAt && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          mt: 0.75,
                        }}
                      >
                        {new Date(item.searchedAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<Search />}
                    onClick={() => searchAgain(query)}
                    sx={{
                      alignSelf: { xs: "flex-start", sm: "center" },
                      borderColor: "#CFE1D9",
                      color: "#07866F",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        borderColor: "#07866F",
                        bgcolor: "#EAF6F1",
                      },
                    }}
                  >
                    Search again
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
