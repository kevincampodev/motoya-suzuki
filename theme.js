(() => {
    "use strict";

    const STORAGE_KEY = "motoya-theme";
    const DEFAULT_THEME = "dark";
    const VALID_THEMES = new Set(["dark", "light"]);

    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEY);

            return VALID_THEMES.has(savedTheme)
                ? savedTheme
                : DEFAULT_THEME;
        } catch (error) {
            return DEFAULT_THEME;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            // La página puede seguir funcionando aunque localStorage no esté disponible.
        }
    }

    function syncThemeAssets(theme) {
        document
            .querySelectorAll("[data-theme-src-dark][data-theme-src-light]")
            .forEach((element) => {
                const nextSrc =
                    theme === "light"
                        ? element.getAttribute("data-theme-src-light")
                        : element.getAttribute("data-theme-src-dark");
    
                if (nextSrc && element.getAttribute("src") !== nextSrc) {
                    element.setAttribute("src", nextSrc);
                }
            });
    }

    function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    syncThemeAssets(theme);

    const button = document.getElementById("themeToggle");

        if (!button) {
            return;
        }

        const lightModeActive = theme === "light";

        button.setAttribute(
            "aria-label",
            lightModeActive
                ? "Activar modo oscuro"
                : "Activar modo claro"
        );

        button.setAttribute(
            "title",
            lightModeActive
                ? "Activar modo oscuro"
                : "Activar modo claro"
        );

        button.setAttribute(
            "aria-pressed",
            String(lightModeActive)
        );

        const icon = button.querySelector("i");

        if (icon) {
            icon.className = lightModeActive
                ? "fa-solid fa-moon"
                : "fa-solid fa-sun";
        }
    }

    function createThemeButton() {
        const nav = document.querySelector("nav");
        const hamburger = document.querySelector(".hamburger");

        if (
            !nav ||
            !hamburger ||
            document.getElementById("themeToggle")
        ) {
            return;
        }

        const button = document.createElement("button");

        button.id = "themeToggle";
        button.className = "theme-toggle";
        button.type = "button";
        button.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';

        button.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme");

            const nextTheme =
                currentTheme === "light" ? "dark" : "light";

            applyTheme(nextTheme);
            saveTheme(nextTheme);
        });

        nav.insertBefore(button, hamburger);
        applyTheme(getSavedTheme());
    }

    const initialTheme = getSavedTheme();

    // Se ejecuta inmediatamente para evitar un cambio brusco de color al cargar.
    applyTheme(initialTheme);

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            createThemeButton,
            { once: true }
        );
    } else {
        createThemeButton();
    }
})();