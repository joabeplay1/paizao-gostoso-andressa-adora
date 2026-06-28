// Variável global para armazenar o estado atual do código criado
let codigoAtual = "";

// Carrega a chave salva do navegador ao iniciar
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
        alert("Erro: Insira uma chave de API válida do Gemini (Ex: AIzaSy...). Não coloque links!");
        return;
    }
    if (!userInput) {
        alert("Por favor, digite o que deseja fazer no aplicativo.");
        return;
    }

    // Salva a chave válida localmente
    localStorage.setItem('gemini_api_key', geminiKey);

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    const btn = document.getElementById('btn-generate');
    btn.innerText = "Processando... ⏳";
    btn.disabled = true;

    // Montagem inteligente do Prompt baseado no estado atual da aplicação
    let promptFinal = "";
    if (codigoAtual === "") {
        // Fluxo Inicial: Criar um app do zero
        promptFinal = `Você é uma IA programadora especialista. Crie um aplicativo de página única (Single Page Application) completo com base no seguinte pedido: "${userInput}". Regras estritas: Devolva APENAS o código HTML funcional com estilos CSS embutidos na tag <style> e lógicas JavaScript embutidas na tag <script>. Não inclua explicações em texto nem introduções. Envolva o resultado estritamente em um bloco de código markdown \`\`\`html.`;
    } else {
        // Fluxo de Atualização: Editar o app sem recomeçar do zero
        promptFinal = `Você é uma IA programadora especialista. Atualmente, o código do aplicativo é este: \n\n${codigoAtual}\n\nO usuário quer fazer a seguinte alteração/melhoria: "${userInput}". Modifique o código atual para realizar o pedido. Regras estritas: Retorne o código HTML modificado por completo. Não forneça trechos parciais, explicações em texto ou comentários sobre o que foi alterado. Retorne APENAS o código completo envolvido em bloco de código markdown \`\`\`html.`;
    }

    // Exibe o prompt gerado na aba lateral
    document.getElementById('output-prompt').value = promptFinal;
    switchTab('prompt');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptFinal }] }]
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Falha na requisição.");
        }

        const data = await response.json();
        let resultadoTexto = data.candidates[0].content.parts[0].text;

        // Limpa blocos de formatação markdown (```html) para obter código puro
        resultadoTexto = resultadoTexto.replace(/```html/gi, "").replace(/```/gi, "").trim();

        // Atualiza as referências locais e visuais
        codigoAtual = resultadoTexto;
        document.getElementById('output-code').value = codigoAtual;

        // Injeta o código dinamicamente no iframe
        document.getElementById('app-preview').srcdoc = codigoAtual;

        // Exibe a aba de código automaticamente ao finalizar
        switchTab('code');
        document.getElementById('user-input').value = ""; // Limpa a entrada para o próximo comando

    } catch (error) {
        console.error(error);
        alert(`Erro técnico: ${error.message}`);
    } finally {
        btn.innerText = "Processar Aplicativo";
        btn.disabled = false;
    }
});

// Manipuladores de tamanho dos dispositivos
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

// Chaveador das abas (Corrigido para evitar o erro .nav-nav-btn do arquivo original)
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
