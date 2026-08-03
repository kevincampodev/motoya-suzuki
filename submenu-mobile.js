(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const dropdownLinks = document.querySelectorAll(".dropdown > a");

    dropdownLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            if (!mobileQuery.matches) {
                return;
            }

            event.preventDefault();

            const currentDropdown = this.closest(".dropdown");

            // Cierra cualquier otro submenú que esté abierto.
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

    // Limpia el estado móvil si el usuario cambia a una pantalla grande.
    const resetMobileDropdowns = (event) => {
        if (!event.matches) {
            document
                .querySelectorAll(".dropdown.mobile-open")
                .forEach((dropdown) => {
                    dropdown.classList.remove("mobile-open");
                });
        }
    };

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", resetMobileDropdowns);
    } else {
        mobileQuery.addListener(resetMobileDropdowns);
    }
})();