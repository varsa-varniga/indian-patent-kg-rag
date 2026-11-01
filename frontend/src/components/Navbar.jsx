
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import { AccountTree } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  function handleSearchClick() {
    const searchInput = document.getElementById("patent-search-input");

    if (!searchInput) return;

    searchInput.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    searchInput.focus({ preventScroll: true });
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.96)",
        color: "#17221F",
        borderBottom: "1px solid #DFE7E3",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          px: { xs: 2, md: "7%" },
          gap: 2,
        }}
      >
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{
            textDecoration: "none",
            color: "inherit",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: "13px",
              bgcolor: "#07866F",
              color: "#FFFFFF",
            }}
          >
            <AccountTree />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography fontSize={19} fontWeight={850} lineHeight={1.2}>
              Patent<span style={{ color: "#07866F" }}>Graph</span>
            </Typography>

            <Typography
              sx={{
                fontSize: 9,
                letterSpacing: { xs: 0.8, sm: 1.7 },
                color: "#66736F",
                mt: 0.4,
                whiteSpace: "nowrap",
              }}
            >
              INTELLIGENT PATENT RESEARCH
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 2 }}
          alignItems="center"
        >
          <Button
            onClick={handleSearchClick}
            color="inherit"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Search
          </Button>

          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={{
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Sign in
          </Button>

          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            sx={{
              bgcolor: "#07866F",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              textTransform: "none",
              px: { xs: 1.25, sm: 2 },
              "&:hover": { bgcolor: "#056653" },
            }}
          >
            Get started
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
