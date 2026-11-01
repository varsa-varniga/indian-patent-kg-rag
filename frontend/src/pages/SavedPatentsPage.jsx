
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  BookmarkBorder,
  Delete,
  OpenInNew,
} from "@mui/icons-material";

const SAVED_KEY = "patentgraph_saved";

function readSavedPatents() {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function getPatentId(patent) {
  return (
    patent?.application_number ||
    patent?.applicationNumber ||
    patent?.["Application Number"] ||
    patent?.publication_number ||
    patent?.publicationNumber ||
    patent?.title ||
    patent?.Title ||
    ""
  );
}

function getPatentTitle(patent) {
  return (
    patent?.title ||
    patent?.Title ||
    patent?.invention_title ||
    patent?.["Invention Title"] ||
    "Untitled Patent"
  );
}

function getPatentField(patent, ...keys) {
  for (const key of keys) {
    const value = patent?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return Array.isArray(value) ? value.join(", ") : String(value);
    }
  }

  return "Not available";
}

export default function SavedPatentsPage() {
  const navigate = useNavigate();
  const [patents, setPatents] = useState(() => readSavedPatents());

  useEffect(() => {
    const refreshPatents = () => setPatents(readSavedPatents());

    window.addEventListener("storage", refreshPatents);
    window.addEventListener("focus", refreshPatents);

    return () => {
      window.removeEventListener("storage", refreshPatents);
      window.removeEventListener("focus", refreshPatents);
    };
  }, []);

  function removePatent(patentToRemove) {
    const targetId = getPatentId(patentToRemove);

    const updated = patents.filter(
      (patent) => getPatentId(patent) !== targetId
    );

    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    setPatents(updated);
  }

  function viewPatent(patent) {
    const applicationNumber = getPatentField(
      patent,
      "application_number",
      "applicationNumber",
      "Application Number",
      "publication_number",
      "publicationNumber"
    );

    if (applicationNumber === "Not available") {
      navigate("/workspace");
      return;
    }

    navigate(`/patent/${encodeURIComponent(applicationNumber)}`, {
      state: { patent },
    });
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Saved Patents
            </Typography>

            <Typography color="text.secondary">
              Your bookmarked patents, ready for further research.
            </Typography>
          </Box>

          <Chip
            icon={<BookmarkBorder />}
            label={`${patents.length} saved`}
            color="success"
            variant="outlined"
          />
        </Stack>

        {patents.length === 0 ? (
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center", py: 8, px: 3 }}>
              <BookmarkBorder
                sx={{ fontSize: 56, color: "text.secondary", mb: 2 }}
              />

              <Typography variant="h6" fontWeight={700} gutterBottom>
                No saved patents yet
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Search for patents and save the ones you want to revisit.
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate("/workspace")}
              >
                Explore patents
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {patents.map((patent, index) => {
              const patentId = getPatentId(patent);

              return (
                <Card
                  key={`${patentId}-${index}`}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      borderColor: "success.main",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "stretch", sm: "flex-start" }}
                      spacing={2}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ mb: 1, overflowWrap: "anywhere" }}
                        >
                          {getPatentTitle(patent)}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Application number:{" "}
                          {getPatentField(
                            patent,
                            "application_number",
                            "applicationNumber",
                            "Application Number"
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {getPatentField(
                            patent,
                            "abstract",
                            "Abstract",
                            "description",
                            "Description"
                          )}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                       
                      </Box>

                      <Stack
                        direction={{ xs: "row", sm: "column" }}
                        spacing={1}
                        sx={{ flexShrink: 0 }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<OpenInNew />}
                          onClick={() => viewPatent(patent)}
                        >
                          View details
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => removePatent(patent)}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
          Saved patents are stored in this browser for your project demo.
          They are not synced across devices.
        </Alert>
      </Container>
    </Box>
  );
}
