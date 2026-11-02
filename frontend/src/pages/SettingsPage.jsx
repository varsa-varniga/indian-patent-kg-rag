import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Settings, Person, Logout } from "@mui/icons-material";

const LOGIN_KEY = "patentgraph_logged_in";
const USER_KEY = "patentgraph_user";

function getProfileName() {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    if (!savedUser) return "Profile name not available";

    try {
      const user = JSON.parse(savedUser);

      if (typeof user === "string") return user;

      return (
        user.name ||
        user.fullName ||
        user.full_name ||
        user.username ||
        user.email ||
        "Profile name not available"
      );
    } catch {
      return savedUser;
    }
  } catch {
    return "Profile name not available";
  }
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const [compact, setCompact] = useState(
    localStorage.getItem("patentgraph_compact") === "true"
  );
  const [message, setMessage] = useState("");
  const profileName = getProfileName();

  function updateCompact(value) {
    setCompact(value);
    localStorage.setItem("patentgraph_compact", String(value));
    setMessage("Preference saved in this browser.");
  }

  function clearHistory() {
    localStorage.removeItem("patentgraph_history");
    setMessage("Search history cleared.");
  }

  function handleLogout() {
    localStorage.removeItem(LOGIN_KEY);
    navigate("/login", { replace: true });
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <Settings sx={{ color: "#07866F", fontSize: 32 }} />
        <Typography variant="h2" fontSize={32}>
          Settings
        </Typography>
      </Stack>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Manage preferences for this research interface.
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: "1px solid #DFE7E3",
          borderRadius: 4,
        }}
      >
        <Typography fontWeight={750} fontSize={17}>
          Profile
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
          <Person sx={{ color: "#07866F", fontSize: 32 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
              {profileName}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Your account profile
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Typography fontWeight={750} fontSize={17} sx={{ mt: 3 }}>
          Appearance
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 2, gap: 2 }}
        >
          <Box>
            <Typography fontWeight={600}>
              Compact layout preference
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Save a preference for a denser workspace layout.
            </Typography>
          </Box>
          <Switch
            checked={compact}
            onChange={(event) => updateCompact(event.target.checked)}
          />
        </Stack>

        <Divider />

        <Typography fontWeight={750} fontSize={17} sx={{ mt: 3 }}>
          Local data
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 2, gap: 2, flexWrap: "wrap" }}
        >
          <Box>
            <Typography fontWeight={600}>Search history</Typography>
            <Typography fontSize={13} color="text.secondary">
              Delete recent search history stored in this browser.
            </Typography>
          </Box>
          <Button color="error" variant="outlined" onClick={clearHistory}>
            Clear history
          </Button>
        </Stack>

        <Divider />

        <Typography fontWeight={750} fontSize={17} sx={{ mt: 3 }}>
          Account
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ py: 2, gap: 2 }}
        >
          <Box>
            <Typography fontWeight={600}>Logout</Typography>
            <Typography fontSize={13} color="text.secondary">
              Sign out of your current session.
            </Typography>
          </Box>
          <Button
            color="error"
            variant="contained"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
