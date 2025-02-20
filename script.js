document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-spgeo');
    const submitButton = form.querySelector('.spgeo-button');

    // Configurações críticas
    const config = {
        vendasNumbers: [ // Números para vendas
            '551633076662', // Número 1 (já existente)
            '5516992751436' // Número 2 (Roberto)
        ],
        locacaoNumbers: [ // Números para locação
            '5516999628066', // Número 1 (Jonathan)
            '5516997888377'  // Número 2 (Gustavo)
        ],
        countryCode: '55', // Código do Brasil
        requiredPrefix: '55', // Garantir prefixo correto
        maxURLLength: 2000, // Limite seguro para URLs
        // Contadores para alternar entre os números
        vendasCounter: 0,
        locacaoCounter: 0
    };

    // Função para alternar entre os números de uma lista
    const getNextNumber = (numbers, counter) => {
        const number = numbers[counter % numbers.length]; // Alterna entre os números
        return number;
    };

    // Função para construir a URL do WhatsApp
    const buildWhatsAppURL = (message, number) => {
        const baseURL = `https://wa.me/${number}`;
        const params = new URLSearchParams({
            text: message
        });
        return `${baseURL}?${params.toString()}`;
    };

    // Validação reforçada do número
    const validateWhatsAppNumber = (number) => {
        const cleanNumber = number.replace(/\D/g, ''); // Remove caracteres não numéricos
        return cleanNumber.startsWith(config.countryCode) && 
               cleanNumber.length >= (config.countryCode.length + 10); // Aceita números com 10 ou mais dígitos após o código do país
    };

    // Construção da mensagem sem emojis
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
            nome: document.getElementById('nome').value.trim(),
            cpf: document.getElementById('cpf').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            vendaLocacao: document.querySelector('input[name="vendaLocacao"]:checked').value,
            email: document.getElementById('email').value.trim(),
            detalhes: document.getElementById('detalhes').value.trim()
        };

        // Escolhe o número com base no tipo de solicitação
        let whatsappNumber;
        if (formData.vendaLocacao === 'Venda') {
            whatsappNumber = getNextNumber(config.vendasNumbers, config.vendasCounter);
            config.vendasCounter++; // Incrementa o contador de vendas
        } else if (formData.vendaLocacao === 'Locação') {
            whatsappNumber = getNextNumber(config.locacaoNumbers, config.locacaoCounter);
            config.locacaoCounter++; // Incrementa o contador de locação
        }

        // Validação do número
        if (!validateWhatsAppNumber(whatsappNumber)) {
            alert('Erro: Número do WhatsApp inválido!');
            return;
        }

        // Construção da mensagem
        const rawMessage = buildMessage(formData);
        const whatsappURL = buildWhatsAppURL(rawMessage, whatsappNumber);

        // Verificação de tamanho da URL
        if (whatsappURL.length > config.maxURLLength) {
            alert('Mensagem muito longa! Reduza o texto.');
            return;
        }

        // Redirecionamento seguro
        try {
            window.location.href = whatsappURL; // Método mais confiável
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            alert('Erro ao abrir WhatsApp!');
        }
    };

    // Event listeners
    form.addEventListener('submit', handleSubmit);
});