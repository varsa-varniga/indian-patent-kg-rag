
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountTree,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const GREEN = "#07866F";
const DARK = "#173B32";
const LOGIN_KEY = "patentgraph_logged_in";
const USER_KEY = "patentgraph_user";
const SAVED_KEY = "patentgraph_saved";

function getPatentId(patent) {
  return (
    patent?.application_number ||
    patent?.applicationNumber ||
    patent?.["Application Number"] ||
    patent?.publication_number ||
    patent?.["Publication Number"] ||
    patent?.title ||
    patent?.Title ||
    ""
  );
}

function savePendingPatent(patent) {
  if (!patent) return;

  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    const items = Array.isArray(saved) ? saved : [];
    const patentId = getPatentId(patent);

    if (!items.some((item) => getPatentId(item) === patentId)) {
      localStorage.setItem(
        SAVED_KEY,
        JSON.stringify([...items, patent])
      );
    }
  } catch (error) {
    console.error("Could not save patent:", error);
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem(LOGIN_KEY) !== "true") return;

    const pendingPatent = location.state?.pendingSavePatent;

    if (pendingPatent) {
      savePendingPatent(pendingPatent);
      navigate("/workspace/saved", { replace: true });
    } else {
      navigate(location.state?.from || "/workspace", {
        replace: true,
      });
    }
  }, [navigate, location.state]);

  function handleLogin(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo login only; no server authentication.
    localStorage.setItem(LOGIN_KEY, "true");
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        name: normalizedEmail
  .split("@")[0]
  .split(".")[0]
  .replace(/[0-9]/g, "")
  .replace(/[^a-zA-Z]/g, ""),
        email: normalizedEmail,
      })
    );

    window.dispatchEvent(new Event("patentgraph-auth-change"));

    const pendingPatent = location.state?.pendingSavePatent;

    if (pendingPatent) {
      savePendingPatent(pendingPatent);
      navigate("/workspace/saved", { replace: true });
      return;
    }

    navigate(location.state?.from || "/workspace", {
      replace: true,
    });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 5,
        background:
          "linear-gradient(135deg, #F0FAF5 0%, #FFFFFF 55%, #E2F4EC 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            border: "1px solid #DDEAE3",
            borderRadius: 4,
            boxShadow: "0 18px 55px rgba(23,59,50,0.08)",
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 64,
                height: 64,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                bgcolor: "#E2F4EC",
                color: GREEN,
              }}
            >
              <AccountTree sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: 850, color: DARK, mt: 1 }}
            >
              PatentGraph
            </Typography>

            <Typography sx={{ color: "#687970", textAlign: "center" }}>
              Connect ideas. Discover prior art.
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            sx={{ mt: 4, mb: 1, fontWeight: 800, color: DARK }}
          >
            Welcome back
          </Typography>

          <Typography sx={{ color: "#687970", mb: 3 }}>
            Sign in to save and organize your patents.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.4,
                  bgcolor: GREEN,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#056653" },
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", color: "#687970" }}
          >
            Demo login: enter any non-empty email and password.
          </Typography>

          <Button
            component={RouterLink}
            to="/"
            fullWidth
            sx={{ mt: 1, color: GREEN, textTransform: "none" }}
          >
            Back to home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
