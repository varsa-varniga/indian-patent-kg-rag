
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccountTree,
  ArrowBack,
  Bookmark,
  BookmarkBorder,
  Business,
  CalendarToday,
  CheckCircle,
  Description,
  GetApp,
  Person,
} from "@mui/icons-material";

const GREEN = "#07866F";
const DARK = "#173B32";
const BLACK = "#111111";
const SAVED_KEY = "patentgraph_saved";
const LOGIN_KEY = "patentgraph_logged_in";

/* Clean Markdown markers and empty values from patent fields. */
function cleanPatentText(value) {
  if (value === null || value === undefined) return "";

  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function readField(patent, ...keys) {
  for (const key of keys) {
    const value = patent?.[key];

    if (
      value === null ||
      value === undefined ||
      typeof value === "object"
    ) {
      continue;
    }

    const text = cleanPatentText(value);

    if (
      text &&
      !["nan", "none", "null", "undefined"].includes(
        text.toLowerCase()
      )
    ) {
      return text;
    }
  }

  return "";
}

function getPatentId(patent, fallback = "") {
  return (
    readField(
      patent,
      "application_number",
      "Application Number",
      "applicationNumber"
    ) ||
    fallback ||
    readField(
      patent,
      "publication_number",
      "Publication Number",
      "publicationNumber"
    ) ||
    readField(patent, "title", "Title")
  );
}

function readSavedPatents() {
  try {
    const items = JSON.parse(
      localStorage.getItem(SAVED_KEY) || "[]"
    );

    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

/* Shared category card. */
function Section({ title, icon, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: { xs: 2, sm: 2.5, md: 3.25 },
        border: "1px solid #DCE8E1",
        borderRadius: { xs: 3, md: 4 },
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 18px rgba(23,59,50,0.045)",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: { xs: 2, md: 2.5 }, minWidth: 0 }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            minWidth: 42,
            display: "grid",
            placeItems: "center",
            borderRadius: 2.5,
            bgcolor: "#E2F4EC",
            color: GREEN,
            "& svg": { fontSize: 22 },
          }}
        >
          {icon}
        </Box>

        <Typography
          component="h2"
          sx={{
            color: BLACK,
            fontWeight: 800,
            fontSize: { xs: 16, sm: 17, md: 19 },
            lineHeight: 1.45,
            overflowWrap: "anywhere",
            minWidth: 0,
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Box sx={{ width: "100%", minWidth: 0 }}>
        {children}
      </Box>
    </Paper>
  );
}

/* Dark labels and responsive patent values. */
function Field({ label, value }) {
  const cleanValue = cleanPatentText(value);

  if (!cleanValue) return null;

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 0.75,
        py: 1.5,
        borderBottom: "1px solid #E8EEEA",
        "&:last-child": {
          borderBottom: "none",
          pb: 0,
        },
      }}
    >
      <Typography
        component="div"
        sx={{
          color: BLACK,
          fontSize: { xs: 11, sm: 12 },
          fontWeight: 800,
          letterSpacing: "0.65px",
          lineHeight: 1.5,
          textTransform: "uppercase",
          overflowWrap: "anywhere",
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          width: "100%",
          minWidth: 0,
          color: "#202520",
          fontSize: { xs: 13.5, sm: 14 },
          fontWeight: 500,
          lineHeight: 1.85,
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
        }}
      >
        {cleanValue}
      </Typography>
    </Box>
  );
}

/* Summary card. */
function OverviewItem({ item }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: { xs: 2, sm: 2.5 },
        border: "1px solid #E1EBE5",
        borderRadius: 3,
        bgcolor: "#FBFDFC",
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": {
          borderColor: "#B6D8C9",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          color: GREEN,
          mb: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        {item.icon}
      </Box>

      <Typography
        component="div"
        sx={{
          color: BLACK,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          lineHeight: 1.5,
          mb: 0.75,
        }}
      >
        {item.label}
      </Typography>

      <Typography
        component="div"
        sx={{
          color: DARK,
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.8,
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
        }}
      >
        {item.value}
      </Typography>
    </Paper>
  );
}

export default function PatentDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicationNumber } = useParams();

  const patent = location.state?.patent;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!patent) {
      setSaved(false);
      return;
    }

    const id = getPatentId(patent, applicationNumber);

    setSaved(
      readSavedPatents().some(
        (item) => getPatentId(item) === id
      )
    );
  }, [patent, applicationNumber]);

  if (!patent) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F5F9F7",
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              color: GREEN,
              mb: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Back to results
          </Button>

          <Alert severity="info" sx={{ borderRadius: 3 }}>
            This page was opened without a patent record. Return to
            the search results and open the patent again. Direct URL
            lookup requires a backend endpoint.
          </Alert>
        </Container>
      </Box>
    );
  }

  const title =
    readField(patent, "title", "Title") ||
    "Patent title unavailable";

  const id =
    getPatentId(patent, applicationNumber) || "Not available";

  const status = readField(
    patent,
    "Application Status",
    "Status",
    "application_status",
    "application_status_text",
    "status"
  );

  const abstract = readField(
    patent,
    "abstract",
    "Abstract",
    "Abstract Text",
    "abstract_text"
  );

  const claims = readField(
    patent,
    "Claims",
    "Claim Text",
    "claims",
    "claims_text"
  );

  const description = readField(
    patent,
    "Description",
    "Detailed Description",
    "description",
    "description_text"
  );

  const pdfUrl = readField(
    patent,
    "pdf_url",
    "PDF URL",
    "Patent PDF URL",
    "Document URL"
  );

  const validPdfUrl = (() => {
    try {
      const url = new URL(pdfUrl);

      return ["https:", "http:"].includes(url.protocol)
        ? url.href
        : "";
    } catch {
      return "";
    }
  })();

  function toggleSave() {
    const isLoggedIn =
      localStorage.getItem(LOGIN_KEY) === "true";

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/workspace/saved",
          pendingSavePatent: patent,
        },
      });
      return;
    }

    const patentId = getPatentId(patent, applicationNumber);

    if (!patentId) {
      window.alert(
        "This patent has no identifiable application number."
      );
      return;
    }

    try {
      const items = readSavedPatents();

      const alreadySaved = items.some(
        (item) => getPatentId(item) === patentId
      );

      const updated = alreadySaved
        ? items.filter(
            (item) => getPatentId(item) !== patentId
          )
        : [...items, patent];

      localStorage.setItem(
        SAVED_KEY,
        JSON.stringify(updated)
      );

      setSaved(!alreadySaved);
    } catch (error) {
      console.error("Unable to update saved patents:", error);
      window.alert("Unable to update saved patents.");
    }
  }

  const overview = [
    {
      label: "Filing date",
      value: readField(
        patent,
        "Application Filing Date",
        "Application Date",
        "application_filing_date",
        "application_date",
        "filing_date"
      ),
      icon: <CalendarToday />,
    },
    {
      label: "Publication number",
      value: readField(
        patent,
        "Publication Number",
        "publication_number",
        "publicationNumber"
      ),
      icon: <Description />,
    },
    {
      label: "Inventor",
      value: readField(
        patent,
        "Inventor Name",
        "Inventor(s)",
        "inventor_name",
        "inventor"
      ),
      icon: <Person />,
    },
    {
      label: "Applicant",
      value: readField(
        patent,
        "Applicant Name",
        "Applicant(s)",
        "applicant_name",
        "applicant"
      ),
      icon: <Business />,
    },
  ].filter((item) => item.value);

  const hasTechnicalDocuments = Boolean(
    abstract || claims || description
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F9F7",
        pb: { xs: 4, sm: 6, md: 8 },
        width: "100%",
        overflowX: "clip",
      }}
    >
      {/* Sticky navigation */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #E1EBE5",
          py: 1.5,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              color: GREEN,
              textTransform: "none",
              fontWeight: 750,
              borderRadius: 2,
              px: 1.5,
            }}
          >
            Back to search results
          </Button>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          boxSizing: "border-box",
          pt: { xs: 2.5, sm: 3.5, md: 5 },
          px: { xs: 2, sm: 3, md: 3 },
        }}
      >
        {/* Patent header */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
            border: "1px solid #DDEAE3",
            borderRadius: { xs: 3, md: 4 },
            bgcolor: "#FFFFFF",
            mb: { xs: 2.5, md: 3.5 },
          }}
        >
          <Box
            sx={{
              px: { xs: 2.25, sm: 3.5, md: 4.5 },
              py: { xs: 2.75, sm: 3.5, md: 4.5 },
              background:
                "linear-gradient(120deg, #E2F4EC 0%, #F8FBF9 75%)",
              borderBottom: "1px solid #DDEAE3",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ mb: 2 }}
            >
              <AccountTree sx={{ color: GREEN }} />

              <Typography
                variant="overline"
                sx={{
                  color: GREEN,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  lineHeight: 1.5,
                }}
              >
                PATENT RECORD
              </Typography>
            </Stack>

            <Typography
              component="h1"
              sx={{
                color: DARK,
                fontWeight: 850,
                fontSize: {
                  xs: 24,
                  sm: 30,
                  md: 38,
                },
                lineHeight: 1.35,
                letterSpacing: "-0.5px",
                overflowWrap: "anywhere",
              }}
            >
              {title}
            </Typography>

            <Box sx={{ mt: 2.5, minWidth: 0 }}>
              <Typography
                component="div"
                sx={{
                  color: BLACK,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.65,
                  textTransform: "uppercase",
                  mb: 0.75,
                }}
              >
                Application number
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: DARK,
                  fontWeight: 750,
                  fontSize: { xs: 14, sm: 15 },
                  lineHeight: 1.8,
                  overflowWrap: "anywhere",
                }}
              >
                {id}
              </Typography>
            </Box>

            {status && (
              <Box sx={{ mt: 2.5 }}>
                <Chip
                  icon={<CheckCircle />}
                  label={status}
                  sx={{
                    height: "auto",
                    maxWidth: "100%",
                    bgcolor: "#DDF3E7",
                    color: "#176348",
                    fontWeight: 700,
                    borderRadius: 2,
                    alignItems: "flex-start",
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      py: 1,
                      lineHeight: 1.6,
                    },
                  }}
                />
              </Box>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Button
                fullWidth={false}
                variant="contained"
                startIcon={
                  saved ? <Bookmark /> : <BookmarkBorder />
                }
                onClick={toggleSave}
                sx={{
                  bgcolor: GREEN,
                  borderRadius: 2.5,
                  px: 2.5,
                  py: 1.25,
                  minHeight: 44,
                  textTransform: "none",
                  fontWeight: 750,
                  boxShadow: "none",
                  alignSelf: {
                    xs: "stretch",
                    sm: "flex-start",
                  },
                  "&:hover": {
                    bgcolor: "#056653",
                    boxShadow: "none",
                  },
                }}
              >
                {saved ? "Remove saved patent" : "Save patent"}
              </Button>

              {validPdfUrl && (
                <Button
                  variant="outlined"
                  component="a"
                  href={validPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GetApp />}
                  sx={{
                    borderColor: "#C8DDD2",
                    color: GREEN,
                    borderRadius: 2.5,
                    px: 2.5,
                    py: 1.25,
                    minHeight: 44,
                    textTransform: "none",
                    fontWeight: 750,
                    alignSelf: {
                      xs: "stretch",
                      sm: "flex-start",
                    },
                    "&:hover": {
                      borderColor: GREEN,
                      bgcolor: "#F2F9F5",
                    },
                  }}
                >
                  Open original PDF
                </Button>
              )}
            </Stack>
          </Box>

          {/* Patent summary */}
          {overview.length > 0 && (
            <Box
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Typography
                component="h2"
                sx={{
                  color: BLACK,
                  fontWeight: 850,
                  fontSize: { xs: 18, md: 21 },
                  lineHeight: 1.5,
                }}
              >
                Patent at a glance
              </Typography>

              <Typography
                sx={{
                  color: "#59675F",
                  fontSize: 13,
                  lineHeight: 1.8,
                  mt: 0.5,
                  mb: 2.5,
                }}
              >
                Key information about this patent record.
              </Typography>

              <Grid
                container
                spacing={{ xs: 1.5, sm: 2 }}
                alignItems="stretch"
              >
                {overview.map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={item.label}
                    sx={{ minWidth: 0, display: "flex" }}
                  >
                    <OverviewItem item={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Details heading */}
        <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
          <Typography
            component="h2"
            sx={{
              color: BLACK,
              fontSize: { xs: 21, sm: 23, md: 26 },
              fontWeight: 850,
              lineHeight: 1.4,
            }}
          >
            Patent details
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              color: "#59675F",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            Review inventor, applicant, legal, and technical information.
          </Typography>
        </Box>

        {/* Responsive information cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 2.5, md: 3 }}
          alignItems="stretch"
          sx={{ width: "100%", minWidth: 0 }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{ minWidth: 0, display: "flex" }}
          >
            <Section
              title="Inventor information"
              icon={<Person />}
            >
              <Field
                label="Inventor name"
                value={readField(
                  patent,
                  "Inventor Name",
                  "Inventor(s)",
                  "inventor_name",
                  "inventor"
                )}
              />

              <Field
                label="Address"
                value={readField(
                  patent,
                  "Inventor Address",
                  "Inventor Addresses",
                  "inventor_address",
                  "inventor_addresses"
                )}
              />

              <Field
                label="Country"
                value={readField(
                  patent,
                  "Inventor Country",
                  "inventor_country"
                )}
              />

              <Field
                label="Nationality"
                value={readField(
                  patent,
                  "Inventor Nationality",
                  "inventor_nationality"
                )}
              />
            </Section>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ minWidth: 0, display: "flex" }}
          >
            <Section
              title="Applicant information"
              icon={<Business />}
            >
              <Field
                label="Applicant name"
                value={readField(
                  patent,
                  "Applicant Name",
                  "Applicant(s)",
                  "applicant_name",
                  "applicant"
                )}
              />

              <Field
                label="Address"
                value={readField(
                  patent,
                  "Applicant Address",
                  "Applicant Addresses",
                  "applicant_address",
                  "applicant_addresses"
                )}
              />

              <Field
                label="Country"
                value={readField(
                  patent,
                  "Applicant Country",
                  "applicant_country"
                )}
              />

              <Field
                label="Nationality"
                value={readField(
                  patent,
                  "Applicant Nationality",
                  "applicant_nationality"
                )}
              />
            </Section>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ minWidth: 0, display: "flex" }}
          >
            <Section
              title="Dates and legal status"
              icon={<CalendarToday />}
            >
              <Field
                label="Application date"
                value={readField(
                  patent,
                  "Application Date",
                  "application_date"
                )}
              />

              <Field
                label="Filing date"
                value={readField(
                  patent,
                  "Application Filing Date",
                  "application_filing_date",
                  "filing_date"
                )}
              />

              <Field
                label="Publication date"
                value={readField(
                  patent,
                  "Publication Date(U/S 11A)",
                  "Publication Date",
                  "publication_date"
                )}
              />

              <Field
                label="Priority date"
                value={readField(
                  patent,
                  "Priority Date",
                  "priority_date"
                )}
              />

              <Field
                label="Priority number"
                value={readField(
                  patent,
                  "Priority Number",
                  "priority_number"
                )}
              />

              <Field
                label="Application status"
                value={readField(
                  patent,
                  "Application Status",
                  "application_status",
                  "application_status_text"
                )}
              />

              <Field
                label="Status"
                value={readField(
                  patent,
                  "Status",
                  "status"
                )}
              />

              <Field
                label="Examination request date"
                value={readField(
                  patent,
                  "REQUEST FOR EXAMINATION DATE",
                  "Examination Request Date",
                  "request_for_examination_date"
                )}
              />
            </Section>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ minWidth: 0, display: "flex" }}
          >
            <Section
              title="Technical classification"
              icon={<AccountTree />}
            >
              <Field
                label="Field of invention"
                value={readField(
                  patent,
                  "Field Of Invention",
                  "Field of Invention",
                  "field_of_invention"
                )}
              />

              <Field
                label="IPC classification"
                value={readField(
                  patent,
                  "Classification (IPC)",
                  "IPC",
                  "ipc",
                  "ipc_classification"
                )}
              />

              <Field
                label="Application type"
                value={readField(
                  patent,
                  "Application Type",
                  "application_type"
                )}
              />

              <Field
                label="Publication type"
                value={readField(
                  patent,
                  "Publication Type",
                  "publication_type"
                )}
              />

              <Field
                label="PCT application number"
                value={readField(
                  patent,
                  "PCT INTERNATIONAL APPLICATION NUMBER",
                  "PCT Application Number",
                  "pct_application_number"
                )}
              />

              <Field
                label="PCT filing date"
                value={readField(
                  patent,
                  "PCT INTERNATIONAL FILING DATE",
                  "PCT Filing Date",
                  "pct_filing_date"
                )}
              />
            </Section>
          </Grid>

          {/* Technical documents */}
          <Grid
            item
            xs={12}
            sx={{ minWidth: 0, display: "flex" }}
          >
            <Section
              title="Technical documents"
              icon={<Description />}
            >
              {hasTechnicalDocuments ? (
                <Stack
                  spacing={{ xs: 2, md: 2.5 }}
                  divider={<Divider flexItem />}
                  sx={{ minWidth: 0 }}
                >
                  {abstract && (
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="h3"
                        sx={{
                          color: BLACK,
                          fontSize: 15,
                          fontWeight: 800,
                          lineHeight: 1.5,
                          mb: 1,
                        }}
                      >
                        Abstract
                      </Typography>

                      <Typography
                        sx={{
                          color: "#34483D",
                          fontSize: 14,
                          lineHeight: 1.95,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {abstract}
                      </Typography>
                    </Box>
                  )}

                  {claims && (
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="h3"
                        sx={{
                          color: BLACK,
                          fontSize: 15,
                          fontWeight: 800,
                          lineHeight: 1.5,
                          mb: 1,
                        }}
                      >
                        Claims
                      </Typography>

                      <Typography
                        sx={{
                          color: "#34483D",
                          fontSize: 14,
                          lineHeight: 1.95,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {claims}
                      </Typography>
                    </Box>
                  )}

                  {description && (
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="h3"
                        sx={{
                          color: BLACK,
                          fontSize: 15,
                          fontWeight: 800,
                          lineHeight: 1.5,
                          mb: 1,
                        }}
                      >
                        Detailed description
                      </Typography>

                      <Typography
                        sx={{
                          color: "#34483D",
                          fontSize: 14,
                          lineHeight: 1.95,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {description}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Box
                  sx={{
                    p: { xs: 2.5, md: 4 },
                    border: "1px dashed #C9DDD2",
                    borderRadius: 3,
                    bgcolor: "#F8FBF9",
                    textAlign: "center",
                  }}
                >
                  <Description
                    sx={{
                      color: "#719487",
                      fontSize: 38,
                      mb: 1.5,
                    }}
                  />

                  <Typography
                    sx={{
                      color: BLACK,
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    Technical document not available
                  </Typography>

                  <Typography
                    sx={{
                      color: "#59675F",
                      mt: 1,
                      lineHeight: 1.8,
                      fontSize: 14,
                      maxWidth: 500,
                      mx: "auto",
                    }}
                  >
                    This record does not contain an abstract, claims,
                    or detailed description.
                  </Typography>
                </Box>
              )}

              {validPdfUrl && (
                <Button
                  component="a"
                  href={validPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GetApp />}
                  sx={{
                    mt: 2.5,
                    color: GREEN,
                    textTransform: "none",
                    fontWeight: 750,
                  }}
                >
                  View or download patent document
                </Button>
              )}
            </Section>
          </Grid>
        </Grid>

        <Typography
          sx={{
            mt: 3,
            color: "#59675F",
            fontSize: 12,
            lineHeight: 1.8,
            textAlign: "center",
          }}
        >
          Patent details are displayed from the available record.
          Verify legal status and official bibliographic information
          against the original patent source when required.
        </Typography>
      </Container>
    </Box>
  );
}
