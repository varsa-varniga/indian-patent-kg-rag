
import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { SearchOff } from "@mui/icons-material";

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <SearchOff sx={{ fontSize: 64, color: "#07866F", mb: 2 }} />
        <Typography variant="h1" sx={{ fontSize: 64 }}>404</Typography>
        <Typography variant="h2" sx={{ fontSize: 25, mt: 1 }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 3, lineHeight: 1.8 }}>
          The page you're looking for doesn't exist or may have moved.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ bgcolor: "#07866F" }}>
          Return to homepage
        </Button>
      </Box>
    </Container>
  );
}
