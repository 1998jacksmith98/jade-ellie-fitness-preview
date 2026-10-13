const steps = [
  { key: "name", label: "What's your name?", type: "text", required: true, placeholder: "Your name" },
  {
    key: "help",
    label: "How can I help you?",
    type: "choice",
    required: true,
    options: ["Weight loss", "Build muscle", "Healthy lifestyle"],
  },
  {
    key: "gender",
    label: "Are you",
    type: "choice",
    options: ["Male", "Female", "Prefer not to say"],
  },
  {
    key: "age",
    label: "How old are you?",
    type: "choice",
    options: ["20 or below", "21–30", "Over 30", "Prefer not to say"],
  },
  { key: "email", label: "What's your email?", type: "email", required: true, placeholder: "you@email.com" },
  { key: "phone", label: "What's the best number for you?", type: "tel", required: true, placeholder: "07..." },
  { key: "instagram", label: "What's your Instagram?", type: "text", required: true, placeholder: "@yourhandle" },
  {
    key: "contact",
    label: "How should I get back to you?",
    type: "choice",
    required: true,
    options: ["Email", "Text / WhatsApp", "Call", "Instagram"],
  },
  {
    key: "interest",
    label: "What are you interested in?",
    type: "choice",
    required: true,
    options: [
      "1-2-1 PT sessions",
      "Group classes",
      "Online coaching",
      "Small group / buddy PT",
      "Not sure yet",
    ],
  },
  {
    key: "why",
    label: "What's holding you back, and what's making you start now?",
    type: "textarea",
    placeholder: "A few lines is plenty.",
  },
];

const answers = {};
let index = 0;

const root = document.querySelector("[data-enquire-form]");
if (!root) {
  /* no form on this page */
} else {
  const count = root.querySelector("[data-count]");
  const bar = root.querySelector("[data-bar]");
  const body = root.querySelector("[data-body]");
  const error = root.querySelector("[data-error]");

  function render() {
    const step = steps[index];
    const value = answers[step.key] || "";
    count.textContent = `${index + 1} of ${steps.length}`;
    bar.style.width = `${((index + 1) / steps.length) * 100}%`;
    error.textContent = "";

    let field = "";
    if (step.type === "choice") {
      field = `<div class="enquire-choices">${step.options
        .map(
          (option) =>
            `<button type="button" class="enquire-choice${value === option ? " is-on" : ""}" data-choice="${option}">${option}</button>`,
        )
        .join("")}</div>`;
    } else if (step.type === "textarea") {
      field = `<textarea class="enquire-area" data-input placeholder="${step.placeholder || ""}">${value}</textarea>`;
    } else {
      field = `<input class="enquire-field" data-input type="${step.type}" value="${value}" placeholder="${step.placeholder || ""}" />`;
    }

    body.innerHTML = `
      <h2 class="enquire-q">${step.label}</h2>
      ${field}
      <div class="enquire-nav">
        <button type="button" class="enquire-back" data-back ${index === 0 ? "hidden" : ""}>Back</button>
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
    const input = body.querySelector("[data-input]");
    if (input) answers[step.key] = input.value.trim();
  }

  function valid() {
    const step = steps[index];
    const value = answers[step.key] || "";
    if (step.required && !value) return "This one needs an answer.";
    if (step.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "That email doesn't look right.";
    }
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
          <h2 class="enquire-q">Got it.</h2>
          <p>I'll be in touch the way you asked. If it's easier, WhatsApp me on 07476 929022.</p>
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
