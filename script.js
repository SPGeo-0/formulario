document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-spgeo");
  const submitButton = form.querySelector(".spgeo-button");

  // Configurações críticas
  const config = {
    vendasNumbers: ["5516992751436"],
    locacaoNumbers: ["5516997888377"],
    countryCode: "55",
    requiredPrefix: "55",
    maxURLLength: 2000,
    vendasCounter: 0,
    locacaoCounter: 0,
  };

  // Função para alternar entre os números de uma lista
  const getNextNumber = (type) => {
    const numbers = config[`${type}Numbers`];
    const counterKey = `${type}Counter`;
    const number = numbers[config[counterKey] % numbers.length];
    config[counterKey]++;
    return number;
  };

  // Função para construir a URL do WhatsApp
  const buildWhatsAppURL = (message, number) => {
    const baseURL = `https://wa.me/${number}`;
    const params = new URLSearchParams({ text: message });
    return `${baseURL}?${params.toString()}`;
  };

  // Validação do número de WhatsApp
  const validateWhatsAppNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    return (
      cleanNumber.startsWith(config.countryCode) &&
      cleanNumber.length >= config.countryCode.length + 10
    );
  };

  // Validação geral do formulário
  const validateFormData = (data) => {
    if (
      !data.nome ||
      !data.cpf ||
      !data.cep ||
      !data.endereco ||
      !data.cidade ||
      !data.vendaLocacao ||
      !data.email
    ) {
      alert("Todos os campos obrigatórios devem ser preenchidos!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("E-mail inválido!");
      return false;
    }
    return true;
  };

  // Construção da mensagem
  const buildMessage = (data) => {
    return `*NOVO CONTATO SPGEO*
*Nome:* ${data.nome}
*CPF/CNPJ:* ${data.cpf}
*CEP:* ${data.cep}
*Endereço:* ${data.endereco}
*Cidade:* ${data.cidade}
*Venda/Locação:* ${data.vendaLocacao}
*E-mail:* ${data.email}

*Detalhes:*
${data.detalhes}`;
  };

  // Função principal de envio
  const handleSubmit = (e) => {
    e.preventDefault();

    // Coleta de dados
    const formData = {
      nome: document.getElementById("nome").value.trim(),
      cpf: document.getElementById("cpf").value.trim(),
      cep: document.getElementById("cep").value.trim(),
      endereco: document.getElementById("endereco").value.trim(),
      cidade: document.getElementById("cidade").value.trim(),
      vendaLocacao: document.querySelector('input[name="vendaLocacao"]:checked')
        ?.value,
      email: document.getElementById("email").value.trim(),
      detalhes: document.getElementById("detalhes").value.trim(),
    };

    // Validação dos dados
    if (!validateFormData(formData)) return;

    // Escolha do número de WhatsApp
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const whatsappNumber = getNextNumber(normalizeText(formData.vendaLocacao));

    if (!validateWhatsAppNumber(whatsappNumber)) {
      alert("Erro: Número do WhatsApp inválido!");
      return;
    }

    // Construção da URL do WhatsApp
    const whatsappURL = buildWhatsAppURL(
      buildMessage(formData),
      whatsappNumber,
    );
    if (whatsappURL.length > config.maxURLLength) {
      alert("Mensagem muito longa! Reduza o texto.");
      return;
    }

    // Feedback visual durante o envio
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar";
    }, 3000);

    // Abrir link em nova aba
    window.open(whatsappURL, "_blank");
  };

  // Event listener de envio do formulário
  form.addEventListener("submit", handleSubmit);
});
