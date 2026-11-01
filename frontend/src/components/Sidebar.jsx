
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountTree,
  Add,
  BookmarkBorder,
  History,
  Hub,
  Logout,
  Settings,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const drawerWidth = 260;

const menuItems = [
  { label: "New Search", path: "/workspace", icon: <Add /> },
  { label: "Search History", path: "/workspace/history", icon: <History /> },
  { label: "Knowledge Graph", path: "/workspace/graph", icon: <Hub /> },
  { label: "Saved Patents", path: "/workspace/saved", icon: <BookmarkBorder /> },
  { label: "Settings", path: "/workspace/settings", icon: <Settings /> },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 0, md: drawerWidth },
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #DFE7E3",
          bgcolor: "#FFFFFF",
          p: 2,
        },
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ textDecoration: "none", color: "#17221F", px: 1, py: 1.5, mb: 3 }}
        >
          <Box sx={{
            width: 42, height: 42, borderRadius: "13px",
            bgcolor: "#07866F", color: "#FFFFFF",
            display: "grid", placeItems: "center",
          }}>
            <AccountTree />
          </Box>
          <Box>
            <Typography fontWeight={850} fontSize={19}>
              Patent<span style={{ color: "#07866F" }}>Graph</span>
            </Typography>
            <Typography sx={{ fontSize: 9, letterSpacing: 1.5, color: "#66736F" }}>
              RESEARCH WORKSPACE
            </Typography>
          </Box>
        </Stack>

        <Button
          component={RouterLink}
          to="/workspace"
          variant="contained"
          startIcon={<Add />}
          fullWidth
          sx={{ mb: 3, py: 1.3, bgcolor: "#07866F", "&:hover": { bgcolor: "#056653" } }}
        >
          New Search
        </Button>

        <Typography sx={{
          px: 1.5, mb: 1, fontSize: 11, fontWeight: 750,
          letterSpacing: 1.2, color: "#87938F",
        }}>
          WORKSPACE
        </Typography>

        <List disablePadding>
          {menuItems.map((item) => {
            const active = item.path === "/workspace"
              ? pathname === "/workspace"
              : pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: "12px",
                  mb: 0.7,
                  py: 1.2,
                  color: active ? "#07866F" : "#66736F",
                  "& .MuiListItemIcon-root": {
                    minWidth: 40,
                    color: active ? "#07866F" : "#7D8985",
                  },
                  "&.Mui-selected": { bgcolor: "#E5F5EF" },
                  "&.Mui-selected:hover": { bgcolor: "#D9F0E7" },
                  "&:hover": { bgcolor: "#F3F8F5" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ mb: 2 }} />

        <Box sx={{
          bgcolor: "#F0F8F4", border: "1px solid #DDEEE5",
          borderRadius: "14px", p: 1.8, mb: 2,
        }}>
          <Typography fontWeight={750} fontSize={13} mb={0.5}>
            Indian Patent Research
          </Typography>
          <Typography fontSize={11} color="text.secondary" lineHeight={1.7}>
            Knowledge Graph enhanced retrieval for evidence-based patent discovery.
          </Typography>
        </Box>

        <ListItemButton
          component={RouterLink}
          to="/"
          sx={{ borderRadius: "12px", color: "#66736F" }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "#7D8985" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Back to Website" primaryTypographyProps={{ fontSize: 13 }} />
        </ListItemButton>
      </Stack>
    </Drawer>
  );
}
