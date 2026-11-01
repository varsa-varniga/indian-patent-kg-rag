
import { useState } from "react";
import {
  Alert, Box, Button, Container, Divider, Paper, Stack,
  Switch, Typography,
} from "@mui/material";
import { Settings } from "@mui/icons-material";

export default function SettingsPage() {
  const [compact, setCompact] = useState(
    localStorage.getItem("patentgraph_compact") === "true"
  );
  const [message, setMessage] = useState("");

  function updateCompact(value) {
    setCompact(value);
    localStorage.setItem("patentgraph_compact", String(value));
    setMessage("Preference saved in this browser.");
  }

  function clearHistory() {
    localStorage.removeItem("patentgraph_history");
    setMessage("Search history cleared.");
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <Settings sx={{ color: "#07866F", fontSize: 32 }} />
        <Typography variant="h2" fontSize={32}>Settings</Typography>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Manage preferences for this research interface.
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: "1px solid #DFE7E3", borderRadius: 4 }}>
        <Typography fontWeight={750} fontSize={17}>Appearance</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2 }}>
          <Box>
            <Typography fontWeight={600}>Compact layout preference</Typography>
            <Typography fontSize={13} color="text.secondary">
              Save a preference for a denser workspace layout.
            </Typography>
          </Box>
          <Switch checked={compact} onChange={(event) => updateCompact(event.target.checked)} />
        </Stack>

        <Divider />

        <Typography fontWeight={750} fontSize={17} sx={{ mt: 3 }}>Local data</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2, gap: 2 }}>
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
      </Paper>
    </Container>
  );
}
