
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Search, Hub, VerifiedOutlined } from "@mui/icons-material";

const features = [
  {
    icon: <Search />,
    title: "Semantic Search",
    description:
      "Find relevant patents by describing an idea, even when the wording differs from the original patent.",
  },
  {
    icon: <Hub />,
    title: "Knowledge Graph",
    description:
      "Explore connections between inventions, inventors, applicants, technologies, and classifications.",
  },
  {
    icon: <VerifiedOutlined />,
    title: "Evidence-Based AI",
    description:
      "Get answers grounded in retrieved patent information, with supporting results for further review.",
  },
];

export default function FeatureCards() {
  return (
    <Grid container spacing={2.5}>
      {features.map((feature) => (
        <Grid item xs={12} md={4} key={feature.title}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid #E1EAE5",
              borderRadius: "18px",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 30px rgba(7,134,111,0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                bgcolor: "#E5F5EF",
                color: "#07866F",
                mb: 2,
              }}>
                {feature.icon}
              </Box>

              <Typography fontWeight={750} fontSize={17} mb={1}>
                {feature.title}
              </Typography>

              <Typography fontSize={13.5} color="text.secondary" lineHeight={1.8}>
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
