(() => {
    "use strict";

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const menu = document.getElementById("mainMenu");
    const hamburger = document.querySelector(".hamburger");
    const dropdownLinks = document.querySelectorAll(".dropdown > a");

    if (!menu || !hamburger) {
        return;
    }

    // Crea automáticamente el fondo oscuro del menú.
    let overlay = document.querySelector(".menu-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "menu-overlay";
        overlay.setAttribute("aria-hidden", "true");
        document.body.appendChild(overlay);
    }

    hamburger.setAttribute("aria-controls", "mainMenu");
    hamburger.setAttribute("aria-expanded", "false");

    function cerrarSubmenus() {
        document
            .querySelectorAll(".dropdown.mobile-open")
            .forEach((dropdown) => {
                dropdown.classList.remove("mobile-open");
            });
    }

    function sincronizarEstadoMenu() {
        const menuAbierto =
            mobileQuery.matches &&
            menu.classList.contains("active");

        overlay.classList.toggle("active", menuAbierto);
        document.body.classList.toggle("menu-open", menuAbierto);

        hamburger.setAttribute(
            "aria-expanded",
            String(menuAbierto)
        );

        overlay.setAttribute(
            "aria-hidden",
            String(!menuAbierto)
        );
    }

    function cerrarMenu() {
        menu.classList.remove("active");
        cerrarSubmenus();
        sincronizarEstadoMenu();
    }

    // Control de los submenús en dispositivos móviles.
    dropdownLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            if (!mobileQuery.matches) {
                return;
            }

            event.preventDefault();

            const currentDropdown = this.closest(".dropdown");

            document
                .querySelectorAll(".dropdown.mobile-open")
                .forEach((dropdown) => {
                    if (dropdown !== currentDropdown) {
                        dropdown.classList.remove("mobile-open");
                    }
                });

            currentDropdown?.classList.toggle("mobile-open");
        });
    });

    // Cerrar al tocar directamente el fondo oscuro.
    overlay.addEventListener("click", cerrarMenu);

    // Cerrar al tocar cualquier lugar fuera del menú.
    document.addEventListener("click", (event) => {
        if (
            !mobileQuery.matches ||
            !menu.classList.contains("active")
        ) {
            return;
        }

        const clicDentroDelMenu = menu.contains(event.target);
        const clicEnHamburguesa = hamburger.contains(event.target);

        if (!clicDentroDelMenu && !clicEnHamburguesa) {
            cerrarMenu();
        }
    });

    // Cerrar con la tecla Escape.
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            menu.classList.contains("active")
        ) {
            cerrarMenu();
        }
    });

    // Detecta cuando toggleMenu() abre o cierra el menú.
    const menuObserver = new MutationObserver(() => {
        sincronizarEstadoMenu();
    });

    menuObserver.observe(menu, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // Limpia los estados móviles al pasar a escritorio.
    const resetMobileMenu = (event) => {
        if (!event.matches) {
            cerrarMenu();
        }
    };

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", resetMobileMenu);
    } else {
        mobileQuery.addListener(resetMobileMenu);
    }

    sincronizarEstadoMenu();
})();