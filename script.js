/*
  CONFIGURAÇÃO:
  1. Troque WHATSAPP_NUMBER pelo número da empresa, com código do país e DDD,
     somente números. Exemplo: 5531999999999.
  2. Para enviar as dúvidas à planilha Google, publique o Apps Script incluído
     em Code.gs como Aplicativo da Web e cole a URL em GOOGLE_SCRIPT_URL.
*/
const WHATSAPP_NUMBER = "5537998090025"; // ALTERAR para o WhatsApp real da Zarco
const GOOGLE_SCRIPT_URL = ""; // COLE A URL /exec do Apps Script publicado

const defaultWhatsAppText = "Olá! Gostaria de informações sobre peças e acessórios automotivos.";
document.querySelectorAll(".whatsapp-link").forEach(link => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultWhatsAppText)}`;
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("questionForm");
const statusBox = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async event => {
  event.preventDefault();
  statusBox.className = "form-status";
  statusBox.textContent = "";
  if (!form.reportValidity()) return;

  if (!GOOGLE_SCRIPT_URL) {
    statusBox.classList.add("error");
    statusBox.textContent = "O formulário ainda precisa ser conectado à planilha Google. Configure a URL no arquivo script.js.";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  data.consentimento = form.elements.consentimento.checked ? "Sim" : "Não";
  data.dataEnvio = new Date().toISOString();
  submitButton.disabled = true;
  submitButton.innerHTML = "Enviando...";

  try {
    // Apps Script recebe os dados via POST. O modo no-cors impede a leitura da resposta,
    // mas permite enviar o formulário a um Web App publicado publicamente.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(data).toString()
    });
    statusBox.classList.add("success");
    statusBox.textContent = "Mensagem enviada! Obrigado pelo contato. Se necessário, fale também pelo WhatsApp.";
    form.reset();
  } catch (error) {
    statusBox.classList.add("error");
    statusBox.textContent = "Não foi possível enviar agora. Tente novamente ou entre em contato pelo WhatsApp.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Enviar mensagem <span>→</span>';
  }
});
