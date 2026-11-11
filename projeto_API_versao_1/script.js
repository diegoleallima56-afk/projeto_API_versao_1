// Constante com a imagem padrão de fallback esportivo caso ocorra erro no carregamento da foto do jogador
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80';

// Base de Dados Estendida contendo o acervo inicial de jogadores e dados complementares para a busca dinâmica
const PLAYERS_DATABASE = [
  {
    id: 1,
    name: 'Lionel Messi',
    position: 'Atacante / Ponta',
    club: 'Inter Miami',
    photo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
    description: 'Vencedor de 8 Bolas de Ouro e campeão da Copa do Mundo FIFA 2022.',
    story: 'Lionel Messi começou no Newell Old Boys e construiu uma carreira lendária no FC Barcelona antes de defender a Argentina no título mundial de 2022.'
  },
  {
    id: 2,
    name: 'Erling Haaland',
    position: 'Centroavante',
    club: 'Manchester City',
    photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    description: 'Artilheiro implacável e campeão da Tríplice Coroa da UEFA.',
    story: 'Com velocidade e precisão física assustadoras, Haaland quebrou recordes de gols na Premier League em sua temporada de estreia no futebol inglês.'
  },
  {
    id: 3,
    name: 'Vinícius Júnior',
    position: 'Ponta Esquerda',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80',
    description: 'Protagonista nas conquistas de UEFA Champions League pelo clube espanhol.',
    story: 'Revelado no Flamengo, Vini Jr. tornou-se um dos jogadores mais incisivos do futebol moderno, brilhando em finais mundiais e europeias.'
  },
  {
    id: 4,
    name: 'Kylian Mbappé',
    position: 'Atacante',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    description: 'Campeão do Mundo em 2018 com apenas 19 anos e hat-trick em final de Copa.',
    story: 'Com arranque veloz e capacidade decisiva, Mbappé despontou no Mônaco, dominou o futebol francês e hoje lidera o setor ofensivo do Real Madrid.'
  },
  {
    id: 5,
    name: 'Pelé',
    position: 'Atacante / Camisa 10',
    club: 'Santos FC / Seleção Brasileira',
    photo: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=600&q=80',
    description: 'O Rei do Futebol, único jogador a vencer três Copas do Mundo (1958, 1962, 1970).',
    story: 'Com mais de 1000 gols marcados na carreira, Edson Arantes do Nascimento encantou o planeta e definiu a essência do futebol arte brasileiro.'
  },
  {
    id: 6,
    name: 'Cristiano Ronaldo',
    position: 'Atacante',
    club: 'Al-Nassr',
    photo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80',
    description: 'Maior artilheiro em jogos oficiais da história do futebol e 5x Bola de Ouro.',
    story: 'Conhecido por sua obsessão por excelência e preparo físico, CR7 marcou época no Manchester United, Real Madrid e Seleção Portuguesa.'
  }
];

// Dicionário de Internacionalização contendo os textos estáticos traduzíveis da interface
const i18nDictionary = {
  pt: {
    heroTitle: "Craques do Futebol Mundial",
    heroSubtitle: "Explore histórias, estatísticas e trajetórias dos maiores jogadores da história do futebol.",
    loadingText: "Consultando base de dados esportiva...",
    notFoundTitle: "Jogador não encontrado",
    notFoundDesc: "Tente pesquisar por outros nomes como Messi, Ronaldo, Mbappé, Neymar ou Pelé.",
    footerRights: "Todos os direitos reservados.",
    listenStory: "Ouvir História",
    speaking: "Lendo..."
  },
  en: {
    heroTitle: "World Football Stars",
    heroSubtitle: "Explore stories, stats, and career journeys of the greatest football players in history.",
    loadingText: "Querying sports database...",
    notFoundTitle: "Player not found",
    notFoundDesc: "Try searching for other names like Messi, Ronaldo, Mbappe, Neymar, or Pele.",
    footerRights: "All rights reserved.",
    listenStory: "Listen Story",
    speaking: "Speaking..."
  }
};

// Declaração de variáveis globais de estado da aplicação
let currentLanguage = 'pt';
let displayedPlayers = [...PLAYERS_DATABASE];

// Mapeamento de elementos chave do DOM para fácil manipulação
const playersGrid = document.getElementById('players-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const noResultsDiv = document.getElementById('no-results');
const loadingSpinner = document.getElementById('loading-spinner');
const themeToggleBtn = document.getElementById('theme-toggle');
const languageSelect = document.getElementById('language-select');

// Função de inicialização da aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o tema visual persistido do usuário
  initTheme();
  // Renderiza a lista inicial de jogadores
  renderPlayers(displayedPlayers);
  // Registra todos os manipuladores de eventos de interatividade
  setupEventListeners();
});

// Inicializa a preferência de tema (Claro/Escuro) armazenada no localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('footstats_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

// Atualiza o ícone visual do botão de troca de tema
function updateThemeIcon(theme) {
  const icon = themeToggleBtn.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// Função responsável por renderizar a lista de cards de jogadores no DOM
function renderPlayers(players) {
  // Limpa o conteúdo atual do grid de jogadores
  playersGrid.innerHTML = '';

  // Verifica se a lista retornada está vazia para exibir feedback amigável
  if (players.length === 0) {
    noResultsDiv.classList.remove('hidden');
    return;
  }

  // Oculta a mensagem de erro caso existam resultados válidos
  noResultsDiv.classList.add('hidden');

  // Itera sobre cada jogador e constrói dinamicamente seu card HTML
  players.forEach(player => {
    const card = document.createElement('article');
    card.className = 'player-card';

    // Injeta a estrutura interna do card com tratamento de imagem onerror para evitar imagens quebradas
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img 
          src="${player.photo}" 
          alt="Foto oficial de ${player.name}" 
          onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';"
        />
        <span class="position-badge">${player.position}</span>
      </div>
      <div class="card-body">
        <h3 class="player-name">${player.name}</h3>
        <p class="player-club"><i class="fa-solid fa-shield-halved"></i> ${player.club}</p>
        <p class="player-desc">${player.description}</p>
        <div class="player-story">${player.story}</div>
        <button class="btn-speech" onclick="speakStory('${escapeQuotes(player.story)}', this)">
          <i class="fa-solid fa-volume-high"></i>
          <span>${i18nDictionary[currentLanguage].listenStory}</span>
        </button>
      </div>
    `;

    // Adiciona o card gerado à seção de grid do DOM
    playersGrid.appendChild(card);
  });
}

// Função para sanitizar aspas em textos passados inline nos manipuladores de evento
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

// Configuração centralizada de ouvintes de evento da interface
function setupEventListeners() {
  // Evento de submissão do formulário de pesquisa
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch(searchInput.value.trim());
  });

  // Evento de alternância dinâmica do tema claro e escuro
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('footstats_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  // Evento de troca de idioma dinâmico
  languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateLanguageTexts();
  });
}

// Lógica de manipulação de busca avançada dinamicamente com suporte a novos jogadores
function handleSearch(searchTerm) {
  if (!searchTerm) {
    // Se o termo estiver vazio, restaura a exibição de todos os jogadores padrão
    renderPlayers(PLAYERS_DATABASE);
    return;
  }

  // Exibe o spinner de carregamento para simular consulta remota/interna
  loadingSpinner.classList.remove('hidden');
  playersGrid.innerHTML = '';
  noResultsDiv.classList.add('hidden');

  setTimeout(() => {
    // Oculta o carregamento após o tempo de resposta simulado
    loadingSpinner.classList.add('hidden');

    // 1. Filtra a busca entre os jogadores já existentes na base local
    const matches = PLAYERS_DATABASE.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matches.length > 0) {
      renderPlayers(matches);
    } else {
      // 2. Se não estiver na lista inicial, gera um card dinâmico em tempo real para o jogador pesquisado
      const dynamicPlayer = fetchDynamicPlayerMock(searchTerm);
      if (dynamicPlayer) {
        renderPlayers([dynamicPlayer]);
      } else {
        renderPlayers([]);
      }
    }
  }, 400);
}

// Simula consulta externa/endpoint estendido para gerar novos jogadores buscados pelo usuário
function fetchDynamicPlayerMock(nameQuery) {
  const formattedQuery = nameQuery.charAt(0).toUpperCase() + nameQuery.slice(1).toLowerCase();
  
  return {
    id: Date.now(),
    name: formattedQuery,
    position: 'Atleta Profissional',
    club: 'Clube Internacional',
    photo: PLACEHOLDER_IMAGE,
    description: `Registro estatístico e dados de carreira do atleta ${formattedQuery}.`,
    story: `${formattedQuery} é um jogador profissional de destaque internacional, reconhecido por sua habilidade tática, visão de jogo e atuações decisivas em grandes campeonatos.`
  };
}

// Recurso de Acessibilidade: Leitura de texto via SpeechSynthesis API do navegador
function speakStory(text, btnElement) {
  // Verifica se o navegador possui suporte nativo para síntese de voz
  if (!('speechSynthesis' in window)) {
    alert('Seu navegador não suporta leitura de texto por voz.');
    return;
  }

  // Cancela qualquer fala em andamento antes de iniciar a nova leitura
  window.speechSynthesis.cancel();

  // Cria uma nova instância de pronúncia de texto
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
  utterance.rate = 1.0;

  // Atualiza dinamicamente o estado visual do botão durante a fala
  const span = btnElement.querySelector('span');
  const originalText = span.textContent;
  span.textContent = i18nDictionary[currentLanguage].speaking;
  btnElement.disabled = true;

  // Restaura o estado original do botão ao concluir a leitura
  utterance.onend = () => {
    span.textContent = originalText;
    btnElement.disabled = false;
  };

  // Restaura o botão em caso de erro na reprodução de áudio
  utterance.onerror = () => {
    span.textContent = originalText;
    btnElement.disabled = false;
  };

  // Dispara a reprodução do áudio sintético
  window.speechSynthesis.speak(utterance);
}

// Atualiza dinamicamente todos os elementos traduzíveis marcados com data-i18n
function updateLanguageTexts() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18nDictionary[currentLanguage][key]) {
      el.textContent = i18nDictionary[currentLanguage][key];
    }
  });

  // Atualiza também os textos dos cards renderizados
  renderPlayers(displayedPlayers);
}