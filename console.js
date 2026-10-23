const tokenForm = document.querySelector("#token-form");
const tokenMessage = document.querySelector("#token-message");
const navLinks = document.querySelectorAll(".console-nav-link");

tokenForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!tokenForm.reportValidity()) {
    return;
  }

  tokenMessage.hidden = false;
  tokenMessage.textContent =
    "Form siap. Token belum dibuat karena layanan backend/API belum tersedia.";
});

for (const link of navLinks) {
  link.addEventListener("click", () => {
    for (const navLink of navLinks) {
      navLink.classList.remove("is-active");
      navLink.removeAttribute("aria-current");
    }

    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  });
}
