const openButtons = document.querySelectorAll("[data-open-form]");
const dropdowns = document.querySelectorAll(".dropdown-wrap");
const forms = document.querySelectorAll(".lead-form");
const supabaseUrl = "https://huzyvjzpzzukjmkgwddr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1enl2anpwenp1a2pta2d3ZGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjEyNDgsImV4cCI6MjA5NzA5NzI0OH0.QSA9G4tD_v9Is-83a1KYWSSpMA-kOZQ7I8FsCg-yAB8";
const supabaseClient = window.supabase?.createClient(supabaseUrl, supabaseAnonKey);

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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = form.parentElement.querySelector(".form-message");
    const submitButton = form.querySelector("button[type='submit']");
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();

    if (!name || !phone || !supabaseClient) {
      if (!supabaseClient) {
        console.error("Supabase client failed to load. Check that the Supabase CDN script loaded before script.js.");
      }

      if (message) {
        message.textContent = "Something went wrong, please try again.";
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    let error = null;

    try {
      const result = await supabaseClient
        .from("get-started")
        .insert([{ name, phone_num: phone }]);

      error = result.error;
    } catch (insertError) {
      error = insertError;
    }

    console.log("Supabase get-started insert result:", { error });

    if (submitButton) {
      submitButton.disabled = false;
    }

    if (error) {
      console.error("Supabase get-started insert error:", error);

      if (message) {
        message.textContent = "Something went wrong, please try again.";
      }
      return;
    }

    form.reset();
    form.hidden = true;

    if (message) {
      message.textContent = "Thanks! We'll reach out within 24 hours to get you started.";
    }
  });
});

const testimonialForm = document.querySelector("[data-testimonial-form]");
const testimonialList = document.querySelector("[data-testimonial-list]");

function renderTestimonials(testimonials = []) {
  if (!testimonialList) {
    return;
  }

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

async function loadApprovedTestimonials() {
  if (!testimonialList || !supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("testimonials")
    .select("name, comment")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase testimonials load error:", error);
    return;
  }

  renderTestimonials(data || []);
}

testimonialForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(testimonialForm);
  const name = formData.get("name")?.toString().trim();
  const comment = formData.get("comment")?.toString().trim();
  const submitButton = testimonialForm.querySelector("button[type='submit']");
  const testimonialMessage = document.querySelector("[data-testimonial-message]");

  if (!name || !comment || !supabaseClient) {
    console.error("Could not submit testimonial. Missing fields or Supabase client.");
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  let error = null;

  try {
    const result = await supabaseClient
      .from("testimonials")
      .insert([{ name, comment }]);

    error = result.error;
  } catch (insertError) {
    error = insertError;
  }

  if (submitButton) {
    submitButton.disabled = false;
  }

  if (error) {
    console.error("Supabase testimonials insert error:", error);
    if (testimonialMessage) {
      testimonialMessage.textContent = "Something went wrong, please try again.";
    }
    return;
  }

  testimonialForm.reset();
  if (testimonialMessage) {
    testimonialMessage.textContent = "Thanks! Your testimonial will appear once approved.";
  }
  loadApprovedTestimonials();
});

loadApprovedTestimonials();
