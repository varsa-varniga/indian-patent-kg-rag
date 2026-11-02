
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
import { useEffect, useState } from "react";

const LOGIN_KEY = "patentgraph_logged_in";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(LOGIN_KEY) === "true"
  );

  useEffect(() => {
    function checkLoginStatus() {
      setIsLoggedIn(localStorage.getItem(LOGIN_KEY) === "true");
    }

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("patentgraph-auth-change", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("patentgraph-auth-change", checkLoginStatus);
    };
  }, []);

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
        {/* Logo */}
        <Stack
          component={RouterLink}
          to={isLoggedIn ? "/workspace" : "/"}
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

        {/* Navigation */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 2 }}
          alignItems="center"
        >
          {isLoggedIn ? (
            <Button
              component={RouterLink}
              to="/workspace"
              color="inherit"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Workspace
            </Button>
          ) : (
            <>
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
                  "&:hover": {
                    bgcolor: "#056653",
                  },
                }}
              >
                Get started
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
