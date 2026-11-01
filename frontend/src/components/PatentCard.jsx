
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowOutward, DescriptionOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function PatentCard({ patent }) {
  const navigate = useNavigate();

  if (!patent) return null;

  const applicationNumber =
    patent.application_number ??
    patent.applicationNumber ??
    patent.id ??
    "";

  const title = patent.title || "Untitled patent";
  const score = Number(patent.score);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E1EAE5",
        borderRadius: "16px",
        overflow: "hidden",
        "&:hover": { borderColor: "#8ACDBA", boxShadow: "0 8px 24px rgba(7,134,111,0.06)" },
      }}
    >
      <CardActionArea
        onClick={() => {
          if (applicationNumber) {
            navigate(`/patent/${encodeURIComponent(applicationNumber)}`, {
              state: { patent },
            });
          }
        }}
        disabled={!applicationNumber}
        sx={{ p: 2.5 }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: "12px",
            bgcolor: "#E5F5EF",
            color: "#07866F",
            display: "grid",
            placeItems: "center",
          }}>
            <DescriptionOutlined />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontSize={15} fontWeight={750} lineHeight={1.6}>
              {title}
            </Typography>

            <Typography
              sx={{ fontSize: 12, color: "#74817C", mt: 0.8, overflowWrap: "anywhere" }}
            >
              Application number: {applicationNumber || "Not available"}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Chip
                label="Patent result"
                size="small"
                sx={{ bgcolor: "#F0F8F4", color: "#056653", fontWeight: 600 }}
              />

              {Number.isFinite(score) && (
                <Chip
                  label={`Similarity: ${score.toFixed(3)}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: "#DDE8E2", color: "#52615B" }}
                />
              )}
            </Stack>
          </Box>

          <ArrowOutward sx={{ color: "#07866F", mt: 0.5 }} />
        </Stack>
      </CardActionArea>
    </Card>
  );
}
