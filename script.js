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

const testimonialForm = document.querySelector("[data-testimonial-form]");
const testimonialList = document.querySelector("[data-testimonial-list]");
const testimonialStorageKey = "aimHighTestimonials";

function getTestimonials() {
  try {
    return JSON.parse(localStorage.getItem(testimonialStorageKey)) || [];
  } catch {
    return [];
  }
}

function saveTestimonials(testimonials) {
  localStorage.setItem(testimonialStorageKey, JSON.stringify(testimonials));
}

function renderTestimonials() {
  if (!testimonialList) {
    return;
  }

  const testimonials = getTestimonials();
  testimonialList.replaceChildren();

  testimonials.forEach((testimonial) => {
    const card = document.createElement("article");
    const name = document.createElement("strong");
    const comment = document.createElement("p");

    card.className = "testimonial-card";
    name.textContent = testimonial.name;
    comment.textContent = testimonial.comment;

    card.append(name, comment);
    testimonialList.append(card);
  });
}

testimonialForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(testimonialForm);
  const name = formData.get("name")?.toString().trim();
  const comment = formData.get("comment")?.toString().trim();

  if (!name || !comment) {
    return;
  }

  const testimonials = getTestimonials();
  testimonials.unshift({ name, comment });
  saveTestimonials(testimonials);
  testimonialForm.reset();
  renderTestimonials();
});

renderTestimonials();
