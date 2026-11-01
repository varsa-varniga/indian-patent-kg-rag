
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  AutoAwesome,
  SearchOff,
  ScienceOutlined,
} from "@mui/icons-material";

import SearchBar from "../components/SearchBar";
import PatentCard from "../components/PatentCard";
import { searchPatents } from "../services/patentApi";

const GREEN = "#07866F";
const CACHE_PREFIX = "patentgraph_search_";
const HISTORY_KEY = "patentgraph_history";
const MAX_HISTORY = 20;

const PATENT_FIELDS = [
  "Application Filing Date",
  "Application Number",
  "Publication Number",
  "Publication Date",
  "Application Date",
  "Application Type",
  "Publication Type",
  "Field Of Invention",
  "Field of Invention",
  "Classification (IPC)",
  "Inventor Addresses",
  "Applicant Addresses",
  "Inventor(s)",
  "Applicant(s)",
  "Additional Email",
  "Inventor Address",
  "Applicant Address",
  "Priority Date",
  "Priority Number",
  "PCT Filing Date",
  "PCT Application Number",
  "Title",
  "Status",
  "IPC",
];

function escapeMarkdownCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br />")
    .trim();
}

function hasMarkdownTable(text) {
  return /^\s*\|?.+\|.+\n\s*\|?\s*:?-{3,}[-:|\s]*\|?\s*$/m.test(
    text
  );
}

function formatPatentAnswer(text) {
  if (typeof text !== "string" || !text.trim()) {
    return "";
  }

  const cleaned = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  // Keep an existing Markdown table unchanged.
  if (hasMarkdownTable(cleaned)) {
    return cleaned;
  }

  const fieldsPattern = [...PATENT_FIELDS]
    .sort((a, b) => b.length - a.length)
    .map((field) =>
      field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    .join("|");

  // Find patent field labels surrounded by pipe separators.
  const fieldRegex = new RegExp(
    `\\|\\s*(${fieldsPattern})\\s*\\|`,
    "gi"
  );

  const matches = [...cleaned.matchAll(fieldRegex)];

  // Do not transform ordinary answers without enough patent fields.
  if (matches.length < 2) {
    return cleaned;
  }

  const intro = cleaned
    .slice(0, matches[0].index)
    .replace(/[|\s]+$/g, "")
    .trim();

  const rows = [];

  for (let i = 0; i < matches.length; i++) {
    const label = matches[i][1].trim();

    const valueStart =
      matches[i].index + matches[i][0].length;

    const valueEnd =
      i + 1 < matches.length
        ? matches[i + 1].index
        : cleaned.length;

    const value = cleaned
      .slice(valueStart, valueEnd)
      .replace(/^\s*\|+\s*/, "")
      .replace(/\s*\|+\s*$/, "")
      .trim();

    if (value && !/^\|+$/.test(value)) {
      rows.push([label, value]);
    }
  }

  if (rows.length < 2) {
    return cleaned;
  }

  const table = [
    "| Patent field | Details |",
    "| --- | --- |",
    ...rows.map(
      ([label, value]) =>
        `| ${escapeMarkdownCell(label)} | ${escapeMarkdownCell(value)} |`
    ),
  ].join("\n");

  return intro ? `${intro}\n\n${table}` : table;
}

function saveSearchHistory(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return;

  try {
    const stored = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    const history = Array.isArray(stored) ? stored : [];

    const updated = [
      {
        query: normalizedQuery,
        searchedAt: new Date().toISOString(),
      },
      ...history.filter(
        (item) =>
          typeof item?.query === "string" &&
          item.query.trim().toLowerCase() !==
            normalizedQuery.toLowerCase()
      ),
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(updated)
    );
  } catch (err) {
    console.error("Could not save search history:", err);
  }
}

export default function SearchResultsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q") || "";

  const [input, setInput] = useState(query);
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInput(query);

    if (!query.trim()) {
      setResults([]);
      setAnswer("");
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const normalizedQuery = query.trim();
    const cacheKey = `${CACHE_PREFIX}${normalizedQuery}`;

    // Save the search even if the backend request fails.
    saveSearchHistory(normalizedQuery);

    try {
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        const data = JSON.parse(cached);

        setResults(
          Array.isArray(data.results) ? data.results : []
        );

        setAnswer(
          typeof data.answer === "string"
            ? data.answer
            : ""
        );

        setError("");
        setLoading(false);

        return;
      }
    } catch {
      // Invalid cache: perform a fresh search.
    }

    async function fetchResults() {
      setLoading(true);
      setError("");
      setResults([]);
      setAnswer("");

      try {
        const data = await searchPatents(normalizedQuery);

        if (cancelled) return;

        const nextResults = Array.isArray(data.results)
          ? data.results
          : [];

        const nextAnswer =
          typeof data.answer === "string"
            ? data.answer
            : "";

        setResults(nextResults);
        setAnswer(nextAnswer);

        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              results: nextResults,
              answer: nextAnswer,
            })
          );
        } catch (err) {
          console.warn(
            "Could not cache search results:",
            err
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            `${err.message || "Search failed."} Check that the backend is running.`
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [query]);

  function submitSearch(value) {
    const text = (value || input).trim();

    if (!text) return;

    setInput(text);

    if (text === query.trim()) {
      saveSearchHistory(text);
      return;
    }

    setParams({ q: text });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F9F7",
        pb: 8,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 3, md: 5 } }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: GREEN,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back
        </Button>

        <Box sx={{ mb: 4 }}>
          <Chip
            icon={<ScienceOutlined />}
            label="PATENT RESEARCH WORKSPACE"
            sx={{
              mb: 2,
              bgcolor: "#DDF3EB",
              color: "#056653",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 30, md: 42 },
              fontWeight: 800,
              letterSpacing: "-1.2px",
              color: "#173B32",
            }}
          >
            Patent search results
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#65766F",
              maxWidth: 700,
            }}
          >
            Find relevant Indian patent records and review
            AI-generated explanations to support your research.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: 4,
            border: "1px solid #DFEAE4",
            bgcolor: "#FFFFFF",
          }}
        >
          <Typography
            fontWeight={700}
            sx={{ mb: 1.5, color: "#23443A" }}
          >
            Search patents
          </Typography>

          <SearchBar
            initialQuery={input}
            onSearch={submitSearch}
            loading={loading}
          />

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1.5,
              color: "#75847D",
            }}
          >
            Search by invention, technology, patent title, or
            application number.
          </Typography>
        </Paper>

        {query && (
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mb: 3 }}
          >
            <Typography color="text.secondary">
              Search query:
            </Typography>

            <Chip
              label={query}
              sx={{
                maxWidth: "100%",
                bgcolor: "#E2F4EC",
                color: "#075D4C",
                fontWeight: 600,
              }}
            />
          </Stack>
        )}

        {loading && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              mb: 3,
              textAlign: "center",
              border: "1px solid #DFEAE4",
              borderRadius: 4,
            }}
          >
            <CircularProgress
              size={36}
              sx={{ color: GREEN, mb: 2 }}
            />

            <Typography
              fontWeight={700}
              color="#23443A"
            >
              Searching patent records
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Finding relevant records and preparing your
              research answer…
            </Typography>
          </Paper>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 3 }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && !query && (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              border: "1px solid #DFEAE4",
              borderRadius: 4,
            }}
          >
            <SearchOff
              sx={{
                fontSize: 42,
                color: GREEN,
                mb: 1,
              }}
            />

            <Typography variant="h6" fontWeight={700}>
              Start your patent search
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Enter a technology or invention above to find
              relevant records.
            </Typography>
          </Paper>
        )}

        {!loading && !error && answer && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid #D8EAE1",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                px: { xs: 2, md: 3 },
                py: 2.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                background:
                  "linear-gradient(110deg, #E4F5EE 0%, #F5FAF7 100%)",
                borderBottom: "1px solid #DFEAE4",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  bgcolor: "#D0EDE2",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <AutoAwesome sx={{ color: GREEN }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  fontWeight={800}
                  color="#173B32"
                  fontSize={18}
                >
                  AI-generated answer
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#52685E",
                    mt: 0.5,
                    lineHeight: 1.7,
                  }}
                >
                  An explanation of your search based on
                  information returned by the patent research
                  system.
                </Typography>

                <Chip
                  size="small"
                  label="Research assistance · Verify patent details"
                  sx={{
                    mt: 1.2,
                    bgcolor: "#FFFFFF",
                    color: "#056653",
                    border: "1px solid #CFE5DA",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                px: { xs: 2, md: 3.5 },
                py: { xs: 2.5, md: 3.5 },
                color: "#344A41",
                overflowWrap: "anywhere",

                "& h1, & h2, & h3, & h4": {
                  color: "#173B32",
                  lineHeight: 1.4,
                  mt: 3,
                  mb: 1.5,
                },

                "& h1": { fontSize: "1.5rem" },
                "& h2": { fontSize: "1.3rem" },
                "& h3": { fontSize: "1.1rem" },

                "& p": {
                  lineHeight: 1.85,
                  my: 1.5,
                },

                "& ul, & ol": {
                  pl: 3,
                  lineHeight: 1.9,
                },

                "& li": { mb: 0.7 },

                "& strong": { color: "#203F34" },

                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  display: "table",
                  marginTop: 20,
                  marginBottom: 20,
                },

                "& th, & td": {
                  border: "1px solid #DFEAE4",
                  padding: {
                    xs: "9px 10px",
                    md: "12px 14px",
                  },
                  textAlign: "left",
                  verticalAlign: "top",
                  overflowWrap: "anywhere",
                },

                "& th": {
                  backgroundColor: "#EAF5EF",
                  color: "#174C3D",
                  fontWeight: 700,
                },

                "& tr:nth-of-type(even) td": {
                  backgroundColor: "#FAFCFB",
                },

                "& blockquote": {
                  borderLeft: `4px solid ${GREEN}`,
                  pl: 2,
                  ml: 0,
                  color: "#61736A",
                },

                "& code": {
                  bgcolor: "#F0F5F2",
                  borderRadius: 1,
                  px: 0.7,
                  py: 0.3,
                },

                "& hr": {
                  border: 0,
                  borderTop: "1px solid #DFEAE4",
                  my: 3,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {formatPatentAnswer(answer)}
                </ReactMarkdown>
              </Box>
            </Box>
          </Paper>
        )}

        {!loading &&
          !error &&
          query &&
          results.length === 0 &&
          !answer && (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                border: "1px solid #DFEAE4",
                borderRadius: 4,
              }}
            >
              <SearchOff
                sx={{
                  fontSize: 42,
                  color: GREEN,
                  mb: 1,
                }}
              />

              <Typography variant="h6" fontWeight={700}>
                No matching patents found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Try another technology term or a patent
                application number.
              </Typography>
            </Paper>
          )}

        {!loading && !error && results.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Divider
              sx={{ mb: 3, borderColor: "#DFEAE4" }}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              gap={1}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#173B32",
                  }}
                >
                  Matching patent records
                </Typography>

                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  Open a patent record to explore its available
                  details.
                </Typography>
              </Box>

              <Chip
                label={`${results.length} records`}
                sx={{
                  bgcolor: "#DDF3EB",
                  color: "#056653",
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Stack spacing={2}>
              {results.map((patent, index) => (
                <PatentCard
                  key={
                    patent.application_number ||
                    patent.applicationNumber ||
                    patent.id ||
                    patent["Application Number"] ||
                    index
                  }
                  patent={patent}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
