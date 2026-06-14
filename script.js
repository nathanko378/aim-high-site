const openButtons = document.querySelectorAll("[data-open-form]");
const dropdowns = document.querySelectorAll(".dropdown-wrap");
const forms = document.querySelectorAll(".lead-form");

function closeDropdowns(except) {
  dropdowns.forEach((dropdown) => {
    if (dropdown !== except) {
      dropdown.classList.remove("is-open");
    }
  });
}

openButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const dropdown = button.closest(".dropdown-wrap") || document.querySelector(".dropdown-wrap");

    if (!dropdown) {
      return;
    }

    const willOpen = !dropdown.classList.contains("is-open");
    closeDropdowns(dropdown);
    dropdown.classList.toggle("is-open", willOpen);

    if (willOpen) {
      const firstInput = dropdown.querySelector("input");
      firstInput?.focus();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown-wrap") && !event.target.matches("[data-open-form]")) {
    closeDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdowns();
  }
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.parentElement.querySelector(".form-message");
    form.reset();

    if (message) {
      message.textContent = "Thanks! We'll reach out within 24 hours to get you started.";
    }
  });
});
