import { COMPANY_INFO } from "./business-config.js";
import { SERVICE_OPTIONS } from "./site-content.js";
export function validateEnquiry(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Please enter your full name.";
  if (
    !data.phone?.trim() ||
    !/^[+\d\s().-]+$/.test(data.phone) ||
    data.phone.replace(/\D/g, "").length < 7 ||
    data.phone.replace(/\D/g, "").length > 15
  )
    errors.phone =
      "Enter a valid phone number, including the area or country code.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email?.trim() || ""))
    errors.email = "Enter a valid email address, such as you@company.co.za.";
  if (!SERVICE_OPTIONS.includes(data.service))
    errors.service = "Please select the service you need.";
  if (!data.message?.trim())
    errors.message = "Please tell us a little about your project.";
  return errors;
}
export function prepareEnquiry(data, company = COMPANY_INFO) {
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) return { errors };
  const message = [
    "Hi Brington Group, I'd like to request a quote for HSE services.",
    "",
    `Full name: ${data.name.trim()}`,
    data.company?.trim() ? `Company: ${data.company.trim()}` : "",
    `Phone: ${data.phone.trim()}`,
    `Email: ${data.email.trim()}`,
    `Service: ${data.service}`,
    data.location?.trim() ? `Project location: ${data.location.trim()}` : "",
    "",
    "Project requirements:",
    data.message.trim(),
  ]
    .filter((line, i, lines) => line || (i && lines[i - 1]))
    .join("\n");
  return {
    message,
    whatsappUrl: `https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
    emailUrl: `mailto:${company.email}?subject=${encodeURIComponent(`HSE quote request — ${data.service}`)}&body=${encodeURIComponent(message)}`,
  };
}
export function setupQuoteForm(form, prepare = prepareEnquiry) {
  const view = form.ownerDocument.defaultView;
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector(".form-status");
  const result = form.querySelector(".quote-result");
  const getData = () => Object.fromEntries(new view.FormData(form));
  let preparedMessage = "";
  form.noValidate = true;
  button.disabled = false;
  function showErrors(errors, fieldName) {
    for (const name of ["name", "phone", "email", "service", "message"]) {
      if (fieldName && fieldName !== name) continue;
      const input = form.elements.namedItem(name);
      const error = form.querySelector(`#${name}-error`);
      input.setAttribute("aria-invalid", String(Boolean(errors[name])));
      error.textContent = errors[name] || "";
    }
  }
  form.addEventListener("focusout", (event) => {
    if (event.target.name)
      showErrors(validateEnquiry(getData()), event.target.name);
  });
  form.addEventListener("input", () => {
    result.hidden = true;
    preparedMessage = "";
    status.textContent = "";
    for (const element of form.querySelectorAll('[aria-invalid="true"]'))
      showErrors(validateEnquiry(getData()), element.name);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    result.hidden = true;
    const data = getData();
    const errors = validateEnquiry(data);
    showErrors(errors);
    if (Object.keys(errors).length) {
      status.textContent =
        "Please check the highlighted fields. Your enquiry has not been sent.";
      form.elements.namedItem(Object.keys(errors)[0]).focus();
      return;
    }
    try {
      const prepared = prepare(data);
      if (prepared.errors) throw new Error("Unable to prepare enquiry");
      preparedMessage = prepared.message;
      result.querySelector(".quote-preview").textContent = prepared.message;
      result.querySelector("[data-send-whatsapp]").href = prepared.whatsappUrl;
      result.querySelector("[data-send-email]").href = prepared.emailUrl;
      result.hidden = false;
      status.textContent =
        "Your draft is ready. Review it below; nothing has been sent yet.";
      result.querySelector("#review-title").focus();
    } catch {
      status.textContent =
        "We could not prepare your request. Please use the call, email or WhatsApp links to contact us.";
    }
  });
  form.querySelector(".copy-request").addEventListener("click", async () => {
    if (!preparedMessage) return;
    try {
      await view.navigator.clipboard.writeText(preparedMessage);
      status.textContent =
        "Message copied. Paste it into your email or messaging app to send.";
    } catch {
      status.textContent =
        "Copy is unavailable. Select and copy the message above, or use WhatsApp or email.";
    }
  });
}
