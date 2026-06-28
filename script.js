let codigoAtual = "";

document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
    }
});

document.getElementById('btn-generate').addEventListener('click', async () => {
    const geminiKey = document.getElementById('api-key-input').value.trim();
    const userInput = document.getElementById('user-input').value.trim();

    if (!geminiKey || geminiKey.startsWith("http")) {
        alert("Erro: Insira uma chave de API válida do Gemini (Ex: AIzaSy...).");
        return;
    }
    if (!userInput) {
        alert("Por favor, digite uma instrução para criar ou alterar o app.");
        return;
    }

    localStorage.setItem('gemini_api_key', geminiKey);
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    
    const btn = document.getElementById('btn-generate');
    btn.innerText = "Pensando e Revisando... ⏳";
    btn.disabled = true;

    // INJEÇÃO DAS 12 REGRAS DE SOFTWARE COMERCIAL DIRETAMENTE NO PROMPT INTERNO
    let instrucoesAvançadas = `
    Aja como um Engenheiro de Software Sênior e Especialista em UX/UI das maiores Big Techs (Google, Apple, Notion, Figma).
    
    SIGA OBRIGATORIAMENTE ESTE PROCESSO MENTAL ANTES DE DEVOLVER O CÓDIGO:
    1. Entenda perfeitamente o pedido do usuário.
    2. Planeje toda a arquitetura interna de software.
    3. Escolha os melhores componentes interativos.
    4. Projete um layout moderno baseado em Visual Hierarchy, Spacing equilibrado, White Space elegante, Microinterações e Motion Design premium (estilo Apple Human Interface e Glass UI).
    5. Crie soluções modulares separando a lógica internamente mesmo em arquivo único: [Config, Utils, Components, Services, State, Events, UI, Storage].
    6. SEMPRE implemente componentes Premium funcionais se fizerem sentido para a experiência: Toasts dinâmicos, Modais, Dialogs, Dropdowns, Tooltips, Accordions, Skeletons de carregamento ou filtros avançados.
    7. REGRA ABSOLUTA: Não use soluções improvisadas, placeholders ou dados fictícios estáticos desnecessários. Tudo deve funcionar de verdade em nível de produção (botões, lógicas, submissões e persistências).
    8. Aplique Clean Code rígido: Nomes de variáveis explícitos, sem código morto e sem duplicação de CSS/JS.
    9. SISTEMA DE AUTOCORREÇÃO: Antes de finalizar, faça uma varredura interna e revise procurando por bugs, IDs quebrados, erros de console, falhas de responsividade em dispositivos móveis ou problemas de acessibilidade. Corrija tudo internamente.
    10. Devolva UNICAMENTE o código final purificado dentro de um bloco de código markdown \`\`\`html, sem textos conversacionais fora dele.
    `;

    let promptFinal = "";
    if (codigoAtual === "") {
        // Fluxo Inicial
        promptFinal = `${instrucoesAvançadas}\n\nTarefa: Crie um aplicativo web inovador do zero baseado em: "${userInput}".`;
    } else {
        // Fluxo de Atualização / Manutenção Dinâmica
        promptFinal = `${instrucoesAvançadas}\n\nCódigo de produção atual:\n\`\`\`html\n${codigoAtual}\n\`\`\`\n\nTarefa: Modifique ou acrescente novas camadas profissionais a este código respeitando a base existente para realizar este pedido: "${userInput}". Não envie trechos soltos, refaça o arquivo HTML completo contendo as mudanças aplicadas e revisadas.`;
    }

    // ETAPA 1: Mostra o Prompt Avançado gerado na aba lateral automaticamente
    document.getElementById('output-prompt').value = promptFinal;
    switchTab('prompt');

    try {
        // ETAPA 2: Aciona a API com a estrutura complexa
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Falha ao processar os tokens.");
        }

        const data = await response.json();
        let resultadoTexto = data.candidates[0].content.parts[0].text;

        // Limpeza dos blocos markdown para extrair código de execução limpo
        resultadoTexto = resultadoTexto.replace(/```html/gi, "").replace(/```/gi, "").trim();

        // ETAPA 3: Atualiza código fonte na aba e atualiza o PREVIEW instantaneamente
        codigoAtual = resultadoTexto;
        document.getElementById('output-code').value = codigoAtual;
        document.getElementById('app-preview').srcdoc = codigoAtual;

        // Altera para a aba do código pronto na tela
        switchTab('code');
        document.getElementById('user-input').value = "";

    } catch (error) {
        console.error(error);
        alert(`Erro de Compilação da IA: ${error.message}`);
    } finally {
        btn.innerText = "Processar Aplicativo";
        btn.disabled = false;
    }
});

// Controles de Dispositivos e Tela
function changeDevice(device) {
    const simulator = document.getElementById('device-simulator');
    simulator.className = ''; 

    if (device === 'mobile') simulator.classList.add('device-mobile');
    if (device === 'tablet') simulator.classList.add('device-tablet');
    if (device === 'desktop') simulator.classList.add('device-desktop');
}

function toggleFullscreen() {
    const simulator = document.getElementById('device-simulator');
    const oldBtn = document.querySelector('.close-fs-btn');
    if (oldBtn) oldBtn.remove();

    simulator.classList.toggle('device-fullscreen');

    if (simulator.classList.contains('device-fullscreen')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerText = "❌ Sair da Tela Cheia";
        closeBtn.className = 'close-fs-btn';
        closeBtn.onclick = () => {
            simulator.classList.remove('device-fullscreen');
            closeBtn.remove();
        };
        document.body.appendChild(closeBtn);
    }
}

// Chaveador de Abas Corrigido
function switchTab(tabAlvo) {
    const btnPrompt = document.getElementById('tab-btn-prompt');
    const btnCode = document.getElementById('tab-btn-code');
    const contentPrompt = document.getElementById('tab-content-prompt');
    const contentCode = document.getElementById('tab-content-code');

    if (tabAlvo === 'prompt') {
        btnPrompt.classList.add('active');
        btnCode.classList.remove('active');
        contentPrompt.style.display = 'block';
        contentCode.style.display = 'none';
    } else {
        btnCode.classList.add('active');
        btnPrompt.classList.remove('active');
        contentCode.style.display = 'block';
        contentPrompt.style.display = 'none';
    }
}
