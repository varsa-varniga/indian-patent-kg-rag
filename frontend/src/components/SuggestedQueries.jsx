
import { Box, Chip, Stack, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

const suggestions = [
  "Solar-powered irrigation systems",
  "Electric vehicle battery cooling",
  "AI-based medical diagnosis",
  "Smart agriculture monitoring",
];

export default function SuggestedQueries({ onSelect }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <AutoAwesome sx={{ color: "#07866F", fontSize: 18 }} />
        <Typography fontSize={13} fontWeight={700} color="#52615B">
          Try a sample search
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {suggestions.map((query) => (
          <Chip
            key={query}
            label={query}
            clickable
            onClick={() => onSelect?.(query)}
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #DDE8E2",
              borderRadius: "10px",
              py: 2.2,
              color: "#52615B",
              "&:hover": {
                bgcolor: "#E5F5EF",
                borderColor: "#07866F",
                color: "#056653",
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
