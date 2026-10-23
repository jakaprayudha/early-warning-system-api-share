const form = document.querySelector("#register-form");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
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

function validatePasswordMatch() {
  if (confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
    confirmPasswordInput.setCustomValidity("Konfirmasi kata sandi belum cocok.");
  } else {
    confirmPasswordInput.setCustomValidity("");
  }
}

passwordInput.addEventListener("input", validatePasswordMatch);
confirmPasswordInput.addEventListener("input", validatePasswordMatch);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  validatePasswordMatch();

  if (!form.reportValidity()) {
    return;
  }

  message.hidden = false;
  message.textContent =
    "Validasi berhasil. Pendaftaran belum disimpan karena koneksi ke backend/database belum tersedia.";
});
