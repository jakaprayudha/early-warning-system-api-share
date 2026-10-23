const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");

for (const toggle of document.querySelectorAll("[data-password-toggle]")) {
  toggle.addEventListener("click", () => {
    const input = document.getElementById(toggle.dataset.passwordToggle);
    const showPassword = input.type === "password";

    input.type = showPassword ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(showPassword));
    toggle.setAttribute(
      "aria-label",
      showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi",
    );
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  message.hidden = false;
  message.textContent =
    "Form login valid. Proses masuk belum tersedia karena koneksi ke backend/API belum tersedia.";
});
