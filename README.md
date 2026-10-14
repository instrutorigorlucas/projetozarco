# Site institucional Zarco — guia rápido

## Arquivos
- `index.html`: estrutura e conteúdo do site.
- `style.css`: cores, layout responsivo e aparência.
- `script.js`: menu mobile, links do WhatsApp e envio do formulário.
- `Code.gs`: código do Google Apps Script para registrar as mensagens em uma planilha.
- `assets/logo-zarco.jpg`: imagem da logo fornecida.

## 1. Configurar o WhatsApp
Abra `script.js` e altere:
`const WHATSAPP_NUMBER = "5531999999999";`
Use o número real com código do país e DDD, apenas números. Exemplo de formato: `55` + DDD + número.

## 2. Conectar o formulário a uma planilha Google
1. Crie uma planilha Google.
2. Abra **Extensões > Apps Script**.
3. Copie o conteúdo de `Code.gs` para o editor do Apps Script e salve.
4. Execute `setupSheet` uma vez e aceite as permissões solicitadas.
5. Clique em **Implantar > Nova implantação**.
6. Escolha **Aplicativo da Web**; executar como **Eu**; acesso **Qualquer pessoa**.
7. Implante e copie a URL terminada em `/exec`.
8. Em `script.js`, cole a URL em `GOOGLE_SCRIPT_URL`.
9. Salve e publique novamente o site.

O envio usa `no-cors`; por isso o navegador não consegue confirmar a resposta do Google. A mensagem de sucesso significa que o navegador concluiu a tentativa de envio, não é uma confirmação transacional da planilha. Faça um teste e confirme que a linha apareceu na planilha.

## 3. Visualizar o site
Abra `index.html` no navegador. Para publicar, envie a pasta inteira para um serviço de hospedagem estática (por exemplo, GitHub Pages, Netlify ou hospedagem própria). Mantenha `assets/`, `index.html`, `style.css` e `script.js` juntos.

## Antes de publicar
- Troque o número do WhatsApp.
- Confirme nome comercial, produtos, formas de atendimento e demais informações.
- Se houver endereço, horário, telefone ou redes sociais, adicione os dados corretos.
- Atualize o aviso de privacidade conforme a forma real de tratamento dos dados.
- Não inclua dados fictícios como se fossem informações oficiais da empresa.
