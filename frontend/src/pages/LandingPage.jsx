import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountTree,
  ArrowForward,
  AutoAwesome,
  Hub,
  MenuBook,
  Search,
  TravelExplore,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const GREEN = "#07866F";
const DARK_GREEN = "#056653";

const FULL_HEADING = "Discover Innovation with Patent Intelligence";
const GREEN_HEADING_START = "Discover Innovation with ".length;

const suggestedPrompts = [
  "Water lifting system",
  "Paracetamol combination for children",
  "Solar powered irrigation",
  "Rainwater harvesting system",
];

const features = [
  {
    icon: <TravelExplore />,
    title: "Semantic Patent Search",
    description:
      "Explore Indian patent records by understanding the meaning and context of your research question, not just exact keyword matches.",
  },
  {
    icon: <AccountTree />,
    title: "Knowledge Graph Exploration",
    description:
      "Discover relationships between patents, inventors, applicants, technologies, and classifications.",
  },
  {
    icon: <AutoAwesome />,
    title: "Evidence-Grounded AI Answers",
    description:
      "Use retrieved patent information and AI-generated explanations to investigate prior art and review supporting evidence.",
  },
];

const steps = [
  {
    number: "01",
    title: "Ask a research question",
    description:
      "Describe an invention, technology, or problem you want to investigate.",
  },
  {
    number: "02",
    title: "Retrieve and connect",
    description:
      "Retrieve relevant patent information and explore relationships represented in the knowledge graph.",
  },
  {
    number: "03",
    title: "Investigate the evidence",
    description:
      "Review patent records and AI-assisted insights to support your research.",
  },
];

function ScrollReveal({ children, delay = 0 }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={elementRef}
      sx={{
        height: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 650ms ease ${delay}ms, transform 650ms ease ${delay}ms`,
        "@media (prefers-reduced-motion: reduce)": {
          opacity: 1,
          transform: "none",
          transition: "none",
        },
      }}
    >
      {children}
    </Box>
  );
}

function SectionHeading({ title, description }) {
  return (
    <Box sx={{ textAlign: "center", mb: 6 }}>
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 29, md: 42 },
          fontWeight: 800,
          letterSpacing: "-1px",
          color: "#173B32",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 2,
          mx: "auto",
          maxWidth: 760,
          color: "#65766F",
          lineHeight: 1.9,
          fontSize: { xs: 15, md: 17 },
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

function KnowledgeGraphIllustration() {
  const nodes = [
    { label: "Inventors", x: 55, y: 50 },
    { label: "Technology", x: 345, y: 50 },
    { label: "Applicants", x: 55, y: 220 },
    { label: "Prior art", x: 345, y: 220 },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 5,
        border: "1px solid #DCEAE3",
        bgcolor: "#FFFFFF",
        boxShadow: "0 20px 60px rgba(29,86,65,0.07)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography fontWeight={800} color="#173B32">
            Patent Relationship Map
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            An illustration of connected patent concepts
          </Typography>
        </Box>
        <AccountTree sx={{ color: GREEN, fontSize: 30 }} />
      </Stack>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "400 / 270",
          borderRadius: 4,
          overflow: "hidden",
          background:
            "radial-gradient(circle, #E5F6EE 0%, #F8FCF9 65%, #FFFFFF 100%)",
        }}
      >
        <svg
          viewBox="0 0 400 270"
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          aria-label="Illustration showing connections between patent concepts"
        >
          <g
            fill="none"
            stroke="#83C5AF"
            strokeWidth="2"
            strokeDasharray="5 5"
          >
            <path d="M200 135 L55 50" />
            <path d="M200 135 L345 50" />
            <path d="M200 135 L55 220" />
            <path d="M200 135 L345 220" />
            <path d="M55 50 L345 50" />
            <path d="M55 220 L345 220" />
          </g>

          {nodes.map((node) => (
            <circle
              key={node.label}
              cx={node.x}
              cy={node.y}
              r="7"
              fill={GREEN}
            />
          ))}

          <circle
            cx="200"
            cy="135"
            r="43"
            fill="#DDF3EB"
            stroke={GREEN}
            strokeWidth="2"
          />
        </svg>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: 100,
            zIndex: 1,
          }}
        >
          <Hub sx={{ fontSize: 29, color: GREEN }} />
          <Typography fontSize={12} fontWeight={800} color="#173B32">
            Patent
          </Typography>
          <Typography fontSize={12} fontWeight={800} color="#173B32">
            Knowledge Graph
          </Typography>
        </Box>

        {nodes.map((node, index) => (
          <Box
            key={node.label}
            sx={{
              position: "absolute",
              left: index === 0 || index === 2 ? "1%" : "auto",
              right: index === 1 || index === 3 ? "1%" : "auto",
              top: index < 2 ? "12%" : "auto",
              bottom: index >= 2 ? "12%" : "auto",
              zIndex: 2,
              px: { xs: 0.8, sm: 1.2 },
              py: 0.7,
              borderRadius: 2,
              border: "1px solid #CFE7DC",
              bgcolor: "#FFFFFF",
              color: DARK_GREEN,
              fontWeight: 700,
              fontSize: { xs: 10, sm: 11 },
              boxShadow: "0 4px 12px rgba(23,99,79,0.06)",
            }}
          >
            {node.label}
          </Box>
        ))}
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2.5 }}>
        <Box sx={{ p: 1.5, flex: 1, bgcolor: "#F1F8F4", borderRadius: 3 }}>
          <Typography fontSize={12} color="text.secondary">
            Research approach
          </Typography>
          <Typography fontWeight={800} fontSize={14} color="#173B32">
            Graph + RAG
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, flex: 1, bgcolor: "#F1F8F4", borderRadius: 3 }}>
          <Typography fontSize={12} color="text.secondary">
            Database focus
          </Typography>
          <Typography fontWeight={800} fontSize={14} color="#173B32">
            Indian patents
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [typedHeading, setTypedHeading] = useState(FULL_HEADING);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let typingTimer;

    const pauseTimer = window.setTimeout(() => {
      let index = 0;
      setTypedHeading("");

      typingTimer = window.setInterval(() => {
        index += 1;
        setTypedHeading(FULL_HEADING.slice(0, index));

        if (index >= FULL_HEADING.length) {
          window.clearInterval(typingTimer);
        }
      }, 45);
    }, 1800);

    return () => {
      window.clearTimeout(pauseTimer);
      window.clearInterval(typingTimer);
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const text = query.trim();
    if (!text) return;

    navigate(`/search?q=${encodeURIComponent(text)}`);
  }

  function handleSuggestedPrompt(prompt) {
    setQuery(prompt);
    searchInputRef.current?.focus();
  }

  function handleSignIn() {
    navigate("/login", {
      state: { from: "/workspace" },
    });
  }

  return (
    <Box sx={{ bgcolor: "#F5F9F7", color: "#173B32", overflowX: "clip", width: "100%", minHeight: "100dvh" }}>
      {/* HERO */}
      <Box
        sx={{
          minHeight: { md: "calc(100vh - 76px)" },
          display: "flex",
          alignItems: "center",
          background:
            "radial-gradient(ellipse at 80% 15%, rgba(36,165,138,0.12), transparent 38%), linear-gradient(180deg, #FFFFFF 0%, #F5F9F7 100%)",
          py: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 850, mx: "auto", textAlign: "center" }}>
            <Typography
              sx={{
                display: "inline-flex",
                px: 2,
                py: 0.8,
                borderRadius: 10,
                bgcolor: "#DDF3EB",
                color: DARK_GREEN,
                fontWeight: 700,
                fontSize: 13,
                mb: 3,
              }}
            >
              KNOWLEDGE GRAPH + RAG
            </Typography>

            <Box
              sx={{
                minHeight: { xs: 120, sm: 110, md: 145 },
                display: "flex",
                px: { xs: 0.5, sm: 1 },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "clamp(2rem, 8.5vw, 2.65rem)", sm: "clamp(2.8rem, 6vw, 3.2rem)", md: "4.0625rem" },
                  lineHeight: { xs: 1.12, sm: 1.14, md: 1.16 },
                  fontWeight: 800,
                  letterSpacing: { xs: "-1.2px", sm: "-1.6px", md: "-2px" },
                  textWrap: "balance",
                  color: "#173B32",
                  overflowWrap: "anywhere",
                }}
              >
                {typedHeading.slice(0, GREEN_HEADING_START)}
                <Box component="span" sx={{ color: GREEN }}>
                  {typedHeading.slice(GREEN_HEADING_START)}
                </Box>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    display: "inline-block",
                    width: "3px",
                    height: "0.9em",
                    ml: 0.5,
                    verticalAlign: "middle",
                    bgcolor: GREEN,
                    animation: "patentCursorBlink 0.8s step-end infinite",
                    "@keyframes patentCursorBlink": {
                      "0%, 49%": { opacity: 1 },
                      "50%, 100%": { opacity: 0 },
                    },
                  }}
                />
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 2,
                mx: "auto",
                maxWidth: 690,
                color: "#65766F",
                lineHeight: 1.9,
                fontSize: { xs: 15, sm: 16, md: 18 },
              }}
            >
              Explore Indian patents through semantic search, connected
              knowledge-graph relationships, and AI-assisted answers to
              investigate relevant prior art.
            </Typography>

            {/* Search bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ maxWidth: 680, width: "100%", mx: "auto", mt: { xs: 3, sm: 4 }, px: { xs: 0, sm: 0 } }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  p: { xs: 1, sm: 1.2 },
                  border: "1px solid #D5E4DC",
                  borderRadius: { xs: 3, sm: 4 },
                  bgcolor: "#FFFFFF",
                  boxShadow: "0 12px 35px rgba(29,86,65,0.06)",
                }}
              >
                <Box
                  component="input"
                  inputRef={searchInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Describe an invention or technology..."
                  aria-label="Describe an invention or technology"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    px: { xs: 1.2, sm: 1.5 },
                    py: { xs: 1.35, sm: 1.5 },
                    border: 0,
                    outline: "none",
                    bgcolor: "transparent",
                    fontFamily: "inherit",
                    fontSize: { xs: 14, sm: 15 },
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search />}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    width: { xs: "100%", sm: "auto" },
                    minHeight: 48,
                    borderRadius: 3,
                    bgcolor: GREEN,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: DARK_GREEN },
                  }}
                >
                  Search patents
                </Button>
              </Paper>
            </Box>

            {/* Suggested prompts: based on your selected project test topics */}
            <Box sx={{ maxWidth: 760, mx: "auto", mt: 3, textAlign: "center" }}>
              <Typography
                sx={{
                  color: "#65766F",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  mb: 1.5,
                }}
              >
                SUGGESTED RESEARCH PROMPTS
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 1.2,
                }}
              >
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outlined"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    sx={{
                      borderColor: "#D5E4DC",
                      color: "#245D4D",
                      bgcolor: "#FFFFFF",
                      borderRadius: 3,
                      px: { xs: 1.5, sm: 2 },
                      py: 1,
                      minHeight: 40,
                      fontSize: { xs: 11.5, sm: 12 },
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#E8F5EE",
                        borderColor: GREEN,
                      },
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Patent Relationship Map */}
      <Box sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <SectionHeading
              title="See how patent ideas connect"
              description="Explore the connections among technologies, inventors, applicants, and prior art through a knowledge-graph approach."
            />
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <KnowledgeGraphIllustration />
          </ScrollReveal>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: "#FFFFFF" }}>
        <Container maxWidth="lg">
          <ScrollReveal>
            <SectionHeading
              title="Discover beyond keywords"
              description="Combine semantic retrieval, patent relationships, and evidence-grounded AI answers to investigate relevant prior art."
            />
          </ScrollReveal>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 120}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    boxSizing: "border-box",
                    p: { xs: 3, md: 3.5 },
                    border: "1px solid #DFEAE4",
                    borderRadius: 4,
                    bgcolor: "#FFFFFF",
                    transition:
                      "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(29,86,65,0.09)",
                      borderColor: "#A7D9C6",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#DDF3EB",
                      color: GREEN,
                      mb: 3,
                      "& .MuiSvgIcon-root": { fontSize: 28 },
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    component="h3"
                    sx={{ fontSize: 20, fontWeight: 800, color: "#173B32" }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "#65766F",
                      lineHeight: 1.9,
                      fontSize: 14.5,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </ScrollReveal>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Research workflow */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <ScrollReveal>
          <SectionHeading
            title="From question to evidence"
            description="A guided workflow combining patent retrieval, connected relationships, and AI-assisted insights."
          />
        </ScrollReveal>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 120}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  height: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #DFEAE4",
                  borderTop: `3px solid ${GREEN}`,
                  borderRadius: 3,
                  bgcolor: "#FFFFFF",
                }}
              >
                <Typography
                  sx={{
                    color: GREEN,
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  STEP {step.number}
                </Typography>

                <Typography sx={{ mt: 2, fontSize: 21, fontWeight: 800 }}>
                  {step.title}
                </Typography>

                <Typography
                  sx={{ mt: 1.5, color: "#65766F", lineHeight: 1.9 }}
                >
                  {step.description}
                </Typography>
              </Paper>
            </ScrollReveal>
          ))}
        </Box>
      </Container>

      {/* Final sign-in section */}
      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 11 } }}>
        <ScrollReveal>
          <Box
            sx={{
              p: { xs: 3, sm: 4, md: 7 },
              textAlign: "center",
              overflowWrap: "anywhere",
              borderRadius: 5,
              color: "#FFFFFF",
              background:
                "linear-gradient(125deg, #075B4D 0%, #07866F 60%, #24A58A 100%)",
            }}
          >
            <MenuBook sx={{ fontSize: 40, mb: 2, color: "#DDF3EB" }} />

            <Typography
              component="h2"
              sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 800 }}
            >
              Ready to explore patent intelligence?
            </Typography>

            <Typography
              sx={{
                mt: 2,
                mb: 3.5,
                mx: "auto",
                maxWidth: 650,
                color: "#E2F7F0",
                lineHeight: 1.9,
              }}
            >
              Sign in to access the research workspace and explore Indian
              patent information with AI-assisted tools.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleSignIn}
              sx={{
                px: 3.5,
                py: 1.5,
                bgcolor: "#FFFFFF",
                color: DARK_GREEN,
                fontWeight: 800,
                borderRadius: 3,
                textTransform: "none",
                "&:hover": { bgcolor: "#EAF7F1" },
              }}
            >
              Sign in to research
            </Button>
          </Box>
        </ScrollReveal>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid #DFEAE4", bgcolor: "#FFFFFF" }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountTree sx={{ color: GREEN }} />
              <Typography fontWeight={800} color="#173B32">
                Patent Intelligence
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Knowledge-Graph-Enhanced RAG for Indian Patent Research
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}