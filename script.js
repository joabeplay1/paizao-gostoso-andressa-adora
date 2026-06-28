// Base de dados simulada para rodar localmente no Preview de forma dinâmica
const textosBiblicos = {
    "salmos-1": [
        "Bem-aventurado o homem que não anda segundo o conselho dos ímpios.",
        "Antes tem o seu prazer na lei do Senhor, e na sua lei medita de dia e de noite.",
        "Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto no seu tempo."
    ],
    "salmos-23": [
        "O Senhor é o meu pastor, nada me faltará.",
        "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
        "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome."
    ],
    "joao-1": [
        "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
        "Ele estava no princípio com Deus.",
        "Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez."
    ],
    "joao-23": [
        "Conteúdo demonstrativo para o capítulo selecionado."
    ]
};

// 1. Controle de Navegação entre Abas (Telas)
function switchTab(screenId) {
    // Esconder todas as telas
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Desativar botões do menu
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativar a tela e o botão corretos
    document.getElementById(`screen-${screenId}`).classList.add('active');
    
    // Encontrar o botão correspondente para dar feedback visual
    const btnIndex = ['home', 'biblia', 'louvores', 'chat'].indexOf(screenId);
    if(btnIndex !== -1) {
        document.querySelectorAll('.nav-nav-btn, .nav-btn')[btnIndex].classList.add('active');
    }

    // Carregar conteúdo inicial se for a tela da Bíblia
    if(screenId === 'biblia') {
        renderBibleText();
    }
}

// 2. Lógica da Bíblia Dinâmica
const bookSelect = document.getElementById('bible-book');
const chapterSelect = document.getElementById('bible-chapter');

if(bookSelect && chapterSelect) {
    bookSelect.addEventListener('change', renderBibleText);
    chapterSelect.addEventListener('change', renderBibleText);
}

function renderBibleText() {
    const book = bookSelect.value;
    const chapter = chapterSelect.value;
    const container = document.getElementById('bible-text');
    
    const chave = `${book}-${chapter}`;
    const versiculos = textosBiblicos[chave] || ["Texto não disponível para esta simulação."];
    
    container.innerHTML = versiculos.map((v, i) => `
        <div class="verse"><span class="verse-num">${i + 1}</span>${v}</div>
    `).join('');
}

// 3. Lógica do Player de Louvores (Simulado)
function playMusic(title, artist) {
    const player = document.getElementById('player');
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-artist').innerText = artist;
    player.classList.remove('hidden');
    document.getElementById('play-icon').className = "fa-solid fa-pause";
}

function togglePlay() {
    const icon = document.getElementById('play-icon');
    if(icon.classList.contains('fa-pause')) {
        icon.className = "fa-solid fa-play";
    } else {
        icon.className = "fa-solid fa-pause";
    }
}

// 4. Lógica de Mensagens do Chat
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if(chatSend && chatInput) {
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function sendMessage() {
    const text = chatInput.value.trim();
    if(text === "") return;

    // Adiciona mensagem do usuário
    const msgDiv = document.createElement('div');
    msgDiv.className = "message user";
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll para baixo

    // Resposta automática da IA/Igreja simulando interação após 1.5s
    setTimeout(() => {
        const replyDiv = document.createElement('div');
        replyDiv.className = "message";
        replyDiv.innerText = "Amém! Que Deus abençoe o seu dia e ouça a sua prece.";
        chatMessages.appendChild(replyDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

// 5. Controle do Modal de Login
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');

if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });
}

function closeLogin() {
    loginModal.classList.add('hidden');
}
