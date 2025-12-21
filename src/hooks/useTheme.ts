import { useTheme } from "@components/theme-provider";

export const useThemeToggle = () => {
    const {theme, setTheme} = useTheme();
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }
    return {theme, toggleTheme};
}