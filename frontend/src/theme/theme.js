
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#07866F",
      dark: "#056653",
      light: "#D9F5EB",
    },
    secondary: {
      main: "#0E9F86",
    },
    background: {
      default: "#F8FAF9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#17221F",
      secondary: "#66736F",
    },
    divider: "#DFE7E3",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.045em",
    },
    h2: {
      fontWeight: 750,
      letterSpacing: "-0.03em",
    },
    button: {
      textTransform: "none",
      fontWeight: 650,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});

export default theme;
