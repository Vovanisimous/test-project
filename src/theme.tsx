import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        type: "light",
        primary: { 500: "#1937e0" },
        secondary: {
            main: "#1db09c",
        },
        action: {
            hover: "#b71dbc"
        }
    },
});

export default theme;
