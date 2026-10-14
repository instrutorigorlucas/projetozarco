/**
 * Zarco — endpoint de formulário para Google Sheets
 *
 * CONFIGURAÇÃO:
 * 1. Crie uma planilha Google.
 * 2. Na planilha, abra Extensões > Apps Script.
 * 3. Substitua o conteúdo do editor por este código e salve.
 * 4. Em Configurações do projeto, defina o fuso horário se desejar.
 * 5. Execute setupSheet uma vez e autorize o acesso.
 * 6. Implantar > Nova implantação > Aplicativo da Web.
 *    Executar como: Eu | Quem tem acesso: Qualquer pessoa.
 * 7. Copie a URL terminada em /exec para GOOGLE_SCRIPT_URL no script.js.
 *
 * A URL do Web App é pública. Use validações e controles adicionais se o
 * formulário passar a receber grande volume de mensagens.
 */

const SHEET_NAME = "Dúvidas do site";

function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Data de recebimento", "Nome", "Telefone", "E-mail", "Assunto",
      "Veículo", "Peça desejada", "Mensagem", "Consentimento"
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
    sheet.autoResizeColumns(1, 9);
  }
}

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheet();
      sheet = spreadsheet.getSheetByName(SHEET_NAME);
    }

    const p = (e && e.parameter) ? e.parameter : {};
    const nome = clean_(p.nome);
    const telefone = clean_(p.telefone);
    const mensagem = clean_(p.mensagem);

    // Validação básica no servidor; não confie apenas na validação do navegador.
    if (!nome || !telefone || !mensagem) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false, message: "Campos obrigatórios ausentes."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      safeCell_(nome),
      safeCell_(telefone),
      safeCell_(clean_(p.email)),
      safeCell_(clean_(p.assunto)),
      safeCell_(clean_(p.veiculo)),
      safeCell_(clean_(p.peca)),
      safeCell_(mensagem),
      p.consentimento === "Sim" ? "Sim" : "Não"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true, message: "Mensagem registrada."
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false, message: "Erro ao registrar mensagem."
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function clean_(value) {
  return String(value || "").trim().slice(0, 2000);
}

// Evita que conteúdo enviado seja interpretado como fórmula pelo Google Sheets.
function safeCell_(value) {
  const s = String(value || "");
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
