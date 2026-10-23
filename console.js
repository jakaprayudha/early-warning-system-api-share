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

function showMenu() {
  const activeId = location.hash === "#swagger-api" ? "swagger-api" : "generate-token";
  const isSwagger = activeId === "swagger-api";

  document.querySelector("#generate-token").hidden = isSwagger;
  document.querySelector("#swagger-api").hidden = !isSwagger;
  document.querySelector("#console-title").textContent = isSwagger ? "Swagger API" : "Generate Token";
  document.querySelector("#console-description").textContent = isSwagger
    ? "Lihat dokumentasi endpoint dan uji pengambilan data API EWS."
    : "Siapkan token akses untuk integrasi aplikasi Anda dengan EWS.";
  document.querySelector("#console-breadcrumb").textContent = isSwagger ? "Swagger API" : "Generate Token";
  document.title = `${isSwagger ? "Swagger API" : "Generate Token"} | EWS`;

  for (const link of navLinks) {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

window.addEventListener("hashchange", showMenu);
showMenu();

    const ewsButton = document.querySelector("#test-ews");
    const sensorForm = document.querySelector("#sensor-form");
    const dateFrom = document.querySelector("#date-from");
    const dateTo = document.querySelector("#date-to");
    const ewsId = document.querySelector("#ews-id");
    const apiToken = document.querySelector("#api-token");
    const apiBase = "http://72.62.124.177:3200/api";

    function validateSensorFields() {
      ewsId.setCustomValidity(ewsId.value.trim() ? "" : "Isi ID EWS.");
      apiToken.setCustomValidity(apiToken.value.trim() ? "" : "Isi token pengujian.");
      dateTo.setCustomValidity(
        dateFrom.value && dateTo.value && dateTo.value < dateFrom.value
          ? "Tanggal akhir tidak boleh sebelum tanggal mulai."
          : "",
      );
    }

    for (const input of [ewsId, apiToken, dateFrom, dateTo]) {
      input.addEventListener("input", validateSensorFields);
    }

    async function testApi(path, options, result, button, secret = "") {
      const status = result.querySelector(".api-result-status");
      const output = result.querySelector("code");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      result.hidden = false;
      result.setAttribute("aria-busy", "true");
      result.dataset.state = "loading";
      status.textContent = "Mengambil data...";
      output.textContent = "";
      button.disabled = true;

      try {
        const response = await fetch(`${apiBase}/${path}`, {
          ...options,
          credentials: "omit",
          cache: "no-store",
          referrerPolicy: "no-referrer",
          signal: controller.signal,
        });
        const text = await response.text();
        let formatted = text;

        if (text) {
          try {
            formatted = JSON.stringify(JSON.parse(text), null, 2);
          } catch (error) {
            if (!(error instanceof SyntaxError)) {
              throw error;
            }
            // Non-JSON responses, including server errors, remain visible as text.
          }
        }

        output.textContent = secret ? formatted.replaceAll(secret, "[TOKEN DISEMBUNYIKAN]") : formatted;
        result.dataset.state = response.ok ? "success" : "error";
        status.textContent = `HTTP ${response.status} — ${
          response.ok ? "Respons diterima." : "Permintaan gagal; lihat respons server."
        }${text ? "" : " Server tidak mengirim isi respons."}`;
      } catch (error) {
        result.dataset.state = "error";
        status.textContent = controller.signal.aborted
          ? "Permintaan melewati batas waktu 30 detik."
          : "Tidak dapat mengambil data. Periksa koneksi dan ketersediaan API. Browser juga dapat memblokir CORS atau mixed content; periksa Console/Network browser.";
        output.textContent = "";
      } finally {
        clearTimeout(timeout);
        result.setAttribute("aria-busy", "false");
        button.disabled = false;
      }
    }

    ewsButton.addEventListener("click", () => {
      testApi("dataEws", { method: "GET" }, document.querySelector("#ews-result"), ewsButton);
    });

    sensorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      validateSensorFields();

      if (!sensorForm.reportValidity()) {
        return;
      }

      const token = apiToken.value.trim();
      testApi(
        "dataSensor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            EWSid: ewsId.value.trim(),
            token,
            datefrom: dateFrom.value,
            dateto: dateTo.value,
          }),
        },
        document.querySelector("#sensor-result"),
        sensorForm.querySelector('button[type="submit"]'),
        token,
      );
    });
