import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#144659" },
    secondary: { main: "#248ea6" },
    success: { main: "#28a745" },
    danger: { main: "#dc3545" },
    warning: { main: "#ffc107" },
    info: { main: "#32c8d9", contrastText: "#fff" },
    light: { main: "#c4eaf2" },
    dark: { main: "#05080d" },
    gi: { main: "#05aff2" },
    noGi: { main: "#f2c12e" },
  },
});

const cardHeaderTheme = createTheme({
  ...theme,
  components: {
    "MuiCardHeader-title": {
      color: "red",
    },
  },
});

export { theme, cardHeaderTheme };
