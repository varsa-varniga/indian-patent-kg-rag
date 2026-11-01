
import {
  Box, Chip, Container, Paper, Stack, Typography,
} from "@mui/material";
import { Hub } from "@mui/icons-material";

const nodes = [
  { label: "Patent", x: "40%", y: "40%", main: true },
  { label: "Inventor", x: "12%", y: "15%" },
  { label: "Applicant", x: "70%", y: "12%" },
  { label: "Technology", x: "75%", y: "65%" },
  { label: "IPC Class", x: "12%", y: "75%" },
];

const edges = [
  { from: [28, 25], to: [43, 40] },
  { from: [70, 22], to: [52, 40] },
  { from: [52, 47], to: [75, 65] },
  { from: [28, 72], to: [43, 48] },
];

export default function KnowledgeGraphPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <Hub sx={{ color: "#07866F", fontSize: 32 }} />
        <Typography variant="h2" fontSize={32}>Knowledge Graph</Typography>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
        Explore how patent records can connect inventors, applicants, technologies, and classifications.
      </Typography>

      <Paper elevation={0} sx={{ p: 2, border: "1px solid #DFE7E3", borderRadius: 4 }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip label="Patent" sx={{ bgcolor: "#E5F5EF", color: "#056653" }} />
          <Chip label="Inventor" variant="outlined" />
          <Chip label="Applicant" variant="outlined" />
          <Chip label="Technology" variant="outlined" />
          <Chip label="IPC Class" variant="outlined" />
        </Stack>

        <Box sx={{
          position: "relative",
          height: { xs: 350, md: 480 },
          overflow: "hidden",
          borderRadius: 3,
          bgcolor: "#F6FAF7",
          border: "1px solid #E5EEE8",
          backgroundImage: "radial-gradient(#C8DDD3 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            {edges.map((edge, i) => (
              <line
                key={i}
                x1={edge.from[0]}
                y1={edge.from[1]}
                x2={edge.to[0]}
                y2={edge.to[1]}
                stroke="#85B9A6"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {nodes.map((node) => (
            <Box
              key={node.label}
              sx={{
                position: "absolute",
                left: node.x,
                top: node.y,
                transform: "translate(-50%, -50%)",
                p: node.main ? 2 : 1.5,
                minWidth: node.main ? 105 : 90,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: node.main ? "#07866F" : "#FFFFFF",
                color: node.main ? "#FFFFFF" : "#17221F",
                border: node.main ? "none" : "1px solid #CFE2D8",
                boxShadow: "0 5px 18px rgba(18,70,52,0.08)",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {node.label}
            </Box>
          ))}
        </Box>

        <Typography color="text.secondary" fontSize={12} sx={{ mt: 2 }}>
          Illustrative graph preview. Live patent graph integration can be added using your backend graph data.
        </Typography>
      </Paper>
    </Container>
  );
}
