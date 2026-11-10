const steps = [
  { key: "name", label: "What’s your name?", type: "text", required: true, placeholder: "Your name" },
  {
    key: "contact_details",
    label: "What’s your contact details?",
    type: "group",
    required: true,
    fields: [
      { key: "email", label: "Email address", type: "email", placeholder: "you@email.com", required: true },
      { key: "phone", label: "Phone number", type: "tel", placeholder: "07..." },
      { key: "instagram", label: "Instagram", type: "text", placeholder: "@yourhandle" },
    ],
  },
  {
    key: "interest",
    label: "What are you interested in?",
    type: "choice",
    required: true,
    options: [
      "1:1 Personal Training",
      "Buddy / Small Group PT",
      "Reformer Pilates",
      "Private Reformer Pilates",
      "Not sure yet",
    ],
  },
  {
    key: "journey",
    label: "Tell me about your current fitness journey and what you’d like help with.",
    type: "textarea",
    required: true,
    placeholder: "A few lines is plenty.",
  },
  {
    key: "prefer",
    label: "How would you prefer me to contact you?",
    type: "choice",
    required: true,
    options: ["WhatsApp", "Text", "Email", "Instagram"],
  },
];

const answers = {};
let index = 0;

const root = document.querySelector("[data-enquire-form]");
if (root) {
  const count = root.querySelector("[data-count]");
  const bar = root.querySelector("[data-bar]");
  const body = root.querySelector("[data-body]");
  const error = root.querySelector("[data-error]");

  function render() {
    const step = steps[index];
    count.textContent = `${index + 1} of ${steps.length}`;
    bar.style.width = `${((index + 1) / steps.length) * 100}%`;
    error.textContent = "";

    let field = "";
    if (step.type === "choice") {
      const value = answers[step.key] || "";
      field = `<div class="enquire-choices">${step.options
        .map(
          (option) =>
            `<button type="button" class="enquire-choice${value === option ? " is-on" : ""}" data-choice="${option}">${option}</button>`,
        )
        .join("")}</div>`;
    } else if (step.type === "textarea") {
      field = `<textarea class="enquire-area" data-input placeholder="${step.placeholder || ""}">${answers[step.key] || ""}</textarea>`;
    } else if (step.type === "group") {
      field = step.fields
        .map(
          (f) => `
          <label class="enquire-label">${f.label}</label>
          <input class="enquire-input" data-input data-key="${f.key}" type="${f.type}" placeholder="${f.placeholder || ""}" value="${answers[f.key] || ""}" />
        `,
        )
        .join("");
    } else {
      field = `<input class="enquire-input" data-input type="${step.type}" placeholder="${step.placeholder || ""}" value="${answers[step.key] || ""}" />`;
    }

    body.innerHTML = `
      <h2 class="enquire-q">${step.label}</h2>
      ${field}
      <div class="enquire-nav">
        <button type="button" class="btn ghost" data-back ${index === 0 ? "hidden" : ""}>Back</button>
        <button type="button" class="btn" data-next>${index === steps.length - 1 ? "Send" : "Next"}</button>
      </div>
    `;

    const input = body.querySelector("[data-input]");
    if (input) input.focus();

    body.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        answers[step.key] = button.dataset.choice;
        body.querySelectorAll("[data-choice]").forEach((el) => el.classList.remove("is-on"));
        button.classList.add("is-on");
      });
    });

    body.querySelector("[data-next]").addEventListener("click", next);
    const back = body.querySelector("[data-back]");
    if (back) back.addEventListener("click", () => {
      save();
      index = Math.max(0, index - 1);
      render();
    });
  }

  function save() {
    const step = steps[index];
    if (step.type === "group") {
      body.querySelectorAll("[data-input]").forEach((input) => {
        answers[input.dataset.key] = input.value.trim();
      });
    } else {
      const input = body.querySelector("[data-input]");
      if (input) answers[step.key] = input.value.trim();
    }
  }

  function valid() {
    const step = steps[index];
    if (step.type === "group") {
      const email = answers.email || "";
      if (step.required && !email) return "Please add your email address.";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "That email doesn't look right.";
      return "";
    }
    const value = answers[step.key] || "";
    if (step.required && !value) return "This one needs an answer.";
    return "";
  }

  async function next() {
    save();
    const problem = valid();
    if (problem) {
      error.textContent = problem;
      return;
    }
    if (index < steps.length - 1) {
      index += 1;
      render();
      return;
    }

    const button = body.querySelector("[data-next]");
    button.disabled = true;
    button.textContent = "Sending…";
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("send failed");
      body.innerHTML = `
        <div class="enquire-done">
          <h2 class="enquire-q">Thank you for your enquiry!</h2>
          <p>I’ll be in touch shortly. If you have any questions in the meantime, you can reach me directly on WhatsApp at 07476 929022.</p>
          <p>Jade Ellie🤍</p>
          <div class="enquire-nav">
            <a class="btn" href="index.html">Back to site</a>
          </div>
        </div>
      `;
      count.textContent = "Done";
      bar.style.width = "100%";
    } catch (err) {
      error.textContent = "Couldn't send that. Try again, or WhatsApp 07476 929022.";
      button.disabled = false;
      button.textContent = "Send";
    }
  }

  render();
}
