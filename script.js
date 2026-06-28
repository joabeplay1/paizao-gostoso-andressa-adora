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
    const statusIndicator = document.getElementById('status-global-indicator');

    if (!geminiKey || geminiKey.startsWith("http")) {
        alert("Erro: Insira uma chave de API válida do Gemini (AIzaSy...).");
        return;
    }
    if (!userInput) {
        alert("Por favor, digite sua ideia base.");
        return;
    }

    localStorage.setItem('gemini_api_key', geminiKey);
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    
    const btn = document.getElementById('btn-generate');
    btn.disabled = true;

    try {
        // ==========================================================
        // MOTOR 1: GERAR O PROMPT BÁSICO / OTIMIZADO DA IDEIA
        // ==========================================================
        btn.innerText = "Criando Prompt... ⚙️";
        statusIndicator.innerText = "Fase 1: Expandindo a ideia do usuário...";
        switchTab('prompt');

        const promptInstrucaoM1 = `Você é um Engenheiro de Prompt. Pegue a ideia simples do usuário: "${userInput}" e expanda em um escopo técnico detalhado com as funcionalidades ideais que esse app deve ter. Retorne apenas o escopo direto, sem introduções ou saudações.`;

        const responseM1 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptInstrucaoM1 }] }] })
        });

        if (!responseM1.ok) throw new Error("Erro ao gerar o primeiro prompt.");
        const dataM1 = await responseM1.json();
        const promptOtimizadoM1 = dataM1.candidates[0].content.parts[0].text.trim();

        // Alimenta a Aba 1
        document.getElementById('output-prompt').value = promptOtimizadoM1;

        // Pausa dramática para o usuário conseguir ver o prompt criado
        await new Promise(resolve => setTimeout(resolve, 1500));

        // ==========================================================
        // MOTOR 2: ENVELOPAMENTO SÊNIOR E CONSTRUÇÃO DO CÓDIGO
        // ==========================================================
        btn.innerText = "Aplicando Engenharia Sênior... 🧠";
        statusIndicator.innerText = "Fase 2: Aplicando padrões Big Tech e autocorreção...";
        switchTab('advanced');

        // Suas 10 Regras Rígidas de Engenharia Comercial
        let regrasSenior = `
        Aja como um Engenheiro de Software Sênior e Especialista em UX/UI das maiores Big Techs (Google, Apple, Notion, Figma).
        SIGA OBRIGATORIAMENTE ESTE PROCESSO MENTAL ANTES DE DEVOLVER O CÓDIGO:
        1. Entenda perfeitamente o escopo solicitado.
        2. Planeje toda a arquitetura interna de software.
        3. Escolha os melhores componentes interativos.
        4. Projete um layout moderno baseado em Visual Hierarchy, Spacing equilibrado, White Space elegante, Microinterações e Motion Design premium.
        5. Crie soluções modulares separando a lógica internamente mesmo em arquivo único: [Config, Utils, Components, Services, State, Events, UI, Storage].
        6. SEMPRE implemente componentes Premium funcionais se fizerem sentido: Toasts dinâmicos, Modais, Dropdowns, Tooltips, Accordions ou filtros avançados.
        7. REGRA ABSOLUTA: Não use soluções improvisadas ou dados fictícios estáticos desnecessários. Tudo deve funcionar de verdade em nível de produção.
        8. Aplique Clean Code rígido: Nomes de variáveis explícitos, sem código morto e sem duplicação de CSS/JS.
        9. SISTEMA DE AUTOCORREÇÃO: Antes de finalizar, faça uma varredura interna e revise procurando por bugs, IDs quebrados, erros de console ou falhas de responsividade. Corrija tudo.
        10. Devolva UNICAMENTE o código final purificado dentro de um bloco de código markdown \`\`\`html, sem textos conversacionais fora dele.
        `;

        let promptFinalM2 = "";
        if (codigoAtual === "") {
            promptFinalM2 = `${regrasSenior}\n\nTarefa: Com base no seguinte escopo avançado, crie o aplicativo completo do zero:\n${promptOtimizadoM1}`;
        } else {
            promptFinalM2 = `${regrasSenior}\n\nCódigo atual:\n\`\`\`html\n${codigoAtual}\n\`\`\`\n\nTarefa: Modifique ou acrescente novas camadas profissionais a este código respeitando a base existente para realizar este pedido:\n${promptOtimizadoM1}`;
        }

        // Mostra o prompt avançado consolidado na Aba 2
        document.getElementById('output-advanced').value = promptFinalM2;

        // Pausa para visualização da transição
        await new Promise(resolve => setTimeout(resolve, 1500));

        btn.innerText = "Fabricando Aplicativo... 🚀";
        statusIndicator.innerText = "Fase 3: Executando compilação final...";
        switchTab('code');

        const responseM2 = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptFinalM2 }] }] })
        });

        if (!responseM2.ok) throw new Error("Erro ao compilar o código do aplicativo.");
        const dataM2 = await responseM2.json();
        let codigoGerado = dataM2.candidates[0].content.parts[0].text;

        // Limpeza dos marcadores Markdown
        codigoGerado = codigoGerado.replace(/```html/gi, "").replace(/```/gi, "").trim();

        // Alimenta e atualiza os resultados na Aba 3 e no Iframe
        codigoAtual = codigoGerado;
        document.getElementById('output-code').value = codigoAtual;
        document.getElementById('app-preview').srcdoc = codigoAtual;

        statusIndicator.innerText = "Aplicativo renderizado com sucesso! ✓";
        document.getElementById('user-input').value = "";

    } catch (error) {
        console.error(error);
        statusIndicator.innerText = "Falha no processamento.";
        alert(`Erro de Compilação: ${error.message}`);
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

// Chaveador das 3 Abas
function switchTab(tabAlvo) {
    const btnPrompt = document.getElementById('tab-btn-prompt');
    const btnAdvanced = document.getElementById('tab-btn-advanced');
    const btnCode = document.getElementById('tab-btn-code');

    const contentPrompt = document.getElementById('tab-content-prompt');
    const contentAdvanced = document.getElementById('tab-content-advanced');
    const contentCode = document.getElementById('tab-content-code');

    btnPrompt.classList.remove('active');
    btnAdvanced.classList.remove('active');
    btnCode.classList.remove('active');

    contentPrompt.style.display = 'none';
    contentAdvanced.style.display = 'none';
    contentCode.style.display = 'none';

    if (tabAlvo === 'prompt') {
        btnPrompt.classList.add('active');
        contentPrompt.style.display = 'block';
    } else if (tabAlvo === 'advanced') {
        btnAdvanced.classList.add('active');
        contentAdvanced.style.display = 'block';
    } else if (tabAlvo === 'code') {
        btnCode.classList.add('active');
        contentCode.style.display = 'block';
    }
}
