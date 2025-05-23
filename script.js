// Dados dos times (caminho atualizado para /images/)
const teamsData = {
  "brasileirao-a": [
    { id: 1, name: "Flamengo", logo: "images/flamengo.png" },
    { id: 2, name: "Palmeiras", logo: "images/palmeiras.png" },
    { id: 3, name: "Atlético-MG", logo: "images/atletico-mg.png" },
    { id: 4, name: "Fluminense", logo: "images/fluminense.png" },
    { id: 5, name: "Corinthians", logo: "images/corinthians.png" },
    { id: 6, name: "Internacional", logo: "images/internacional.png" },
    { id: 7, name: "Athletico-PR", logo: "images/athletico-pr.png" },
    { id: 8, name: "São Paulo", logo: "images/sao-paulo.png" },
  ],
  "brasileirao-b": [
    { id: 9, name: "Cruzeiro", logo: "images/cruzeiro.png" },
    { id: 10, name: "Grêmio", logo: "images/gremio.png" },
    { id: 11, name: "Vasco", logo: "images/vasco.png" },
    { id: 12, name: "Bahia", logo: "images/bahia.png" },
    { id: 13, name: "Sport", logo: "images/sport.png" },
    { id: 14, name: "Sampaio Corrêa", logo: "images/sampaio-correa.png" },
    { id: 15, name: "Londrina", logo: "images/londrina.png" },
    { id: 16, name: "CRB", logo: "images/crb.png" },
  ],
  libertadores: [
    { id: 1, name: "Flamengo", logo: "images/flamengo.png" },
    { id: 2, name: "Palmeiras", logo: "images/palmeiras.png" },
    { id: 17, name: "River Plate", logo: "images/river.png" },
    { id: 18, name: "Boca Juniors", logo: "images/boca.png" },
    { id: 19, name: "Peñarol", logo: "images/penarol.png" },
    { id: 20, name: "Olimpia", logo: "images/olimpia.png" },
    { id: 21, name: "Nacional", logo: "images/nacional.png" },
    { id: 22, name: "Atlético Nacional", logo: "images/atletico-nacional.png" },
  ],
  champions: [
    { id: 23, name: "Real Madrid", logo: "images/real-madrid.png" },
    { id: 24, name: "Barcelona", logo: "images/barcelona.png" },
    { id: 25, name: "Bayern de Munique", logo: "images/bayern.png" },
    { id: 26, name: "Liverpool", logo: "images/liverpool.png" },
    { id: 27, name: "Manchester City", logo: "images/manchester-city.png" },
    { id: 28, name: "PSG", logo: "images/psg.png" },
    { id: 29, name: "Juventus", logo: "images/juventus.png" },
    { id: 30, name: "Chelsea", logo: "images/chelsea.png" },
  ],
};

// Estado da aplicação
let state = {
  balance: 100,
  currentLeague: "brasileirao-a",
  matches: [],
  pendingBets: [], // Apostas não confirmadas
  confirmedBets: [], // Apostas confirmadas
  results: [],
  history: [],
  selectedMatch: null,
  selectedBetType: "winner",
  selectedOption: null,
};

// Elementos do DOM
const elements = {
  balance: document.getElementById("balance"),
  leagueSelect: document.getElementById("league-select"),
  matchesContainer: document.getElementById("matches-container"),
  betsContainer: document.getElementById("bets-container"),
  resultsContainer: document.getElementById("results-container"),
  tabs: document.querySelectorAll(".tab"),
  tabContents: document.querySelectorAll(".tab-content"),
  betModal: document.getElementById("bet-modal"),
  addFundsModal: document.getElementById("add-funds-modal"),
  closeModals: document.querySelectorAll(".close-modal"),
  cancelBet: document.getElementById("cancel-bet"),
  confirmBet: document.getElementById("confirm-bet"),
  cancelAddFunds: document.getElementById("cancel-add-funds"),
  confirmAddFunds: document.getElementById("confirm-add-funds"),
  matchTitle: document.getElementById("match-title"),
  betTypeSelect: document.getElementById("bet-type-select"),
  betDetails: document.querySelectorAll(".bet-details"),
  homeTeamOption: document.getElementById("home-team-option"),
  drawOption: document.getElementById("draw-option"),
  awayTeamOption: document.getElementById("away-team-option"),
  homeTeamName: document.getElementById("home-team-name"),
  awayTeamName: document.getElementById("away-team-name"),
  homeTeamLogo: document.getElementById("home-team-logo"),
  awayTeamLogo: document.getElementById("away-team-logo"),
  homeTeamOdd: document.getElementById("home-team-odd"),
  drawOdd: document.getElementById("draw-odd"),
  awayTeamOdd: document.getElementById("away-team-odd"),
  homeScore: document.getElementById("home-score"),
  awayScore: document.getElementById("away-score"),
  scoreOdd: document.getElementById("score-odd"),
  yellowCards: document.getElementById("yellow-cards"),
  yellowCardsOdd: document.getElementById("yellow-cards-odd"),
  totalGoals: document.getElementById("total-goals"),
  totalGoalsOdd: document.getElementById("total-goals-odd"),
  betAmount: document.getElementById("bet-amount"),
  potentialWin: document.getElementById("potential-win"),
  customAmount: document.getElementById("custom-amount"),
  fundOptions: document.querySelectorAll(".fund-option"),
  addFundsButton: document.createElement("button"),
};

function init() {
  createAddFundsButton();
  updateBalance();
  
  // Gerar partidas iniciais
  generateMatches();
  
  // Renderizar apostas existentes
  renderBets();
  
  setupEventListeners();
}

function createAddFundsButton() {
  elements.addFundsButton.className = "add-funds-button";
  elements.addFundsButton.textContent = "Saldo"; // Alterado para texto
  elements.addFundsButton.addEventListener("click", openAddFundsModal);
  document.body.appendChild(elements.addFundsButton);
}

function setupEventListeners() {
  // Filtro de liga
  elements.leagueSelect.addEventListener("change", (e) => {
    state.currentLeague = e.target.value;
    generateMatches();
  });

  // Tabs
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Modal de aposta
  elements.closeModals[0].addEventListener("click", closeBetModal);
  elements.cancelBet.addEventListener("click", closeBetModal);
  elements.confirmBet.addEventListener("click", addBetToPending);

  // Modal de adicionar fundos
  elements.closeModals[1].addEventListener("click", closeAddFundsModal);
  elements.cancelAddFunds.addEventListener("click", closeAddFundsModal);
  elements.confirmAddFunds.addEventListener("click", addFunds);

  // Seleção de valor rápido
  elements.fundOptions.forEach((option) => {
    option.addEventListener("click", () => {
      elements.fundOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      elements.customAmount.value = option.dataset.amount;
    });
  });

  // Tipo de aposta
  elements.betTypeSelect.addEventListener("change", (e) => {
    state.selectedBetType = e.target.value;
    updateBetDetails();
  });

  // Seleção de time/opção
  elements.homeTeamOption.addEventListener("click", () => selectOption("home"));
  elements.drawOption.addEventListener("click", () => selectOption("draw"));
  elements.awayTeamOption.addEventListener("click", () => selectOption("away"));

  // Cálculo de ganho potencial
  elements.betAmount.addEventListener("input", calculatePotentialWin);
  elements.homeScore.addEventListener("input", calculatePotentialWin);
  elements.awayScore.addEventListener("input", calculatePotentialWin);
  elements.yellowCards.addEventListener("input", calculatePotentialWin);
  elements.totalGoals.addEventListener("input", calculatePotentialWin);

  // Valor personalizado
  elements.customAmount.addEventListener("input", () => {
    elements.fundOptions.forEach((opt) => opt.classList.remove("selected"));
  });
}

// Atualizar saldo
function updateBalance() {
  elements.balance.textContent = `R$ ${state.balance
    .toFixed(2)
    .replace(".", ",")}`;
}

function generateMatches() {
  const league = state.currentLeague;
  const teams = teamsData[league];

  // Limpar completamente os jogos existentes antes de gerar novos
  state.matches = [];
  elements.matchesContainer.innerHTML = "";

  // Limpa resultados antigos quando gerar novas partidas
  state.results = state.results.filter(result => 
    state.confirmedBets.some(bet => bet.match.id === result.matchId && bet.status === "pending")
  );

  // Gerar novos jogos apenas para a liga selecionada
  for (let i = 0; i < 4; i++) {
    const homeIndex = Math.floor(Math.random() * teams.length);
    let awayIndex;

    do {
      awayIndex = Math.floor(Math.random() * teams.length);
    } while (awayIndex === homeIndex);

    const homeTeam = teams[homeIndex];
    const awayTeam = teams[awayIndex];

    const match = {
      id: Date.now() + i,
      league,
      homeTeam,
      awayTeam,
      date: generateRandomDate(),
      odds: {
        home: (Math.random() * 2 + 1).toFixed(2),
        draw: (Math.random() * 3 + 1).toFixed(2),
        away: (Math.random() * 2 + 1).toFixed(2),
        score: (Math.random() * 5 + 5).toFixed(2),
        yellowCards: (Math.random() * 3 + 2).toFixed(2),
        totalGoals: (Math.random() * 3 + 2).toFixed(2),
      },
    };

    state.matches.push(match);
    renderMatch(match);
  }
}

function generateRandomDate() {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * 7);
  const date = new Date(today);
  date.setDate(date.getDate() + daysToAdd);

  const hours = Math.floor(Math.random() * 12) + 12;
  const minutes = Math.floor(Math.random() * 60);

  return `${date.getDate()}/${date.getMonth() + 1} às ${hours}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function renderMatch(match) {
  const matchCard = document.createElement("div");
  matchCard.className = "match-card";
  matchCard.dataset.id = match.id;

  matchCard.innerHTML = `
        <div class="match-teams">
            <div class="team">
                <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}">
                <span class="team-name">${match.homeTeam.name}</span>
            </div>
            <div class="vs">VS</div>
            <div class="team">
                <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}">
                <span class="team-name">${match.awayTeam.name}</span>
            </div>
        </div>
        <div class="match-info">${match.date}</div>
        <div class="bet-buttons">
            <button class="bet-button" data-type="winner" data-option="home">
                <span>${match.homeTeam.name}</span>
                <span class="odd">${match.odds.home}</span>
            </button>
            <button class="bet-button" data-type="winner" data-option="draw">
                <span>Empate</span>
                <span class="odd">${match.odds.draw}</span>
            </button>
            <button class="bet-button" data-type="winner" data-option="away">
                <span>${match.awayTeam.name}</span>
                <span class="odd">${match.odds.away}</span>
            </button>
        </div>
        <div class="bet-buttons">
            <button class="bet-button" data-type="score">
                <span>Placar Exato</span>
                <span class="odd">${match.odds.score}</span>
            </button>
            <button class="bet-button" data-type="yellow-cards">
                <span>Cartões Amarelos</span>
                <span class="odd">${match.odds.yellowCards}</span>
            </button>
            <button class="bet-button" data-type="total-goals">
                <span>Total de Gols</span>
                <span class="odd">${match.odds.totalGoals}</span>
            </button>
        </div>
    `;

  elements.matchesContainer.appendChild(matchCard);

  const betButtons = matchCard.querySelectorAll(".bet-button");
  betButtons.forEach((button) => {
    button.addEventListener("click", () =>
      openBetModal(match, button.dataset.type, button.dataset.option)
    );
  });
}

function switchTab(tabId) {
  const container = document.querySelector('.tabs-container');
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  
  // Mostrar spinner
  container.appendChild(spinner);
  
  // Esconder conteúdo atual
  elements.tabContents.forEach(content => {
    content.style.display = 'none';
  });
  
  // Atualizar tabs
  elements.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.getAttribute("data-tab") === tabId);
  });
  
  // Pequeno delay para animação
  setTimeout(() => {
    // Remover spinner
    spinner.remove();
    
    // Mostrar novo conteúdo
    elements.tabContents.forEach((content) => {
      if (content.id === `${tabId}-tab`) {
        content.style.display = 'block';
        content.classList.add("active");
      } else {
        content.classList.remove("active");
        content.style.display = 'none';
      }
    });
    
    // Carregar conteúdo específico
  if (tabId === "bets") {
    renderBets();
  } else if (tabId === "results") {
    calculateResults();
    renderResults();
  } else if (tabId === "history") {
    renderHistory(); // Adicione esta linha
  }
  }, 300);
}

// Modal de aposta
function openBetModal(match, betType, option) {
  const hasResult = state.results.some((r) => r.matchId === match.id);

  if (hasResult) {
    showToast(
      "Esta partida já foi encerrada. Apostas não são mais permitidas.",
      "error"
    );
    return;
  }

  state.selectedMatch = match;
  state.selectedBetType = betType;
  state.selectedOption = option || null;

  // Restante da função permanece igual
  elements.matchTitle.textContent = `${match.homeTeam.name} vs ${match.awayTeam.name}`;

  elements.homeTeamName.textContent = match.homeTeam.name;
  elements.awayTeamName.textContent = match.awayTeam.name;
  elements.homeTeamLogo.src = match.homeTeam.logo;
  elements.awayTeamLogo.src = match.awayTeam.logo;

  elements.homeTeamOdd.textContent = match.odds.home;
  elements.drawOdd.textContent = match.odds.draw;
  elements.awayTeamOdd.textContent = match.odds.away;
  elements.scoreOdd.textContent = `Odd: ${match.odds.score}`;
  elements.yellowCardsOdd.textContent = `Odd: ${match.odds.yellowCards}`;
  elements.totalGoalsOdd.textContent = `Odd: ${match.odds.totalGoals}`;

  elements.betTypeSelect.value = betType;
  updateBetDetails();

  if (betType === "winner") {
    selectOption(option);
  } else {
    state.selectedOption = null;
  }

  elements.betAmount.value = "";
  elements.homeScore.value = "";
  elements.awayScore.value = "";
  elements.yellowCards.value = "";
  elements.totalGoals.value = "";
  elements.potentialWin.textContent = "R$ 0,00";

  elements.betModal.style.display = "block";
}

function closeBetModal() {
  elements.betModal.style.display = "none";
}

function updateBetDetails() {
  elements.betDetails.forEach((detail) => {
    detail.classList.add("hidden");
  });

  document
    .getElementById(`${state.selectedBetType}-details`)
    .classList.remove("hidden");
}

function selectOption(option) {
  state.selectedOption = option;

  elements.homeTeamOption.classList.remove("selected");
  elements.drawOption.classList.remove("selected");
  elements.awayTeamOption.classList.remove("selected");

  if (option === "home") {
    elements.homeTeamOption.classList.add("selected");
  } else if (option === "draw") {
    elements.drawOption.classList.add("selected");
  } else if (option === "away") {
    elements.awayTeamOption.classList.add("selected");
  }

  calculatePotentialWin();
}

function calculatePotentialWin() {
  const amount = parseFloat(elements.betAmount.value) || 0;
  let odd = 1;

  if (state.selectedBetType === "winner") {
    if (state.selectedOption === "home") {
      odd = parseFloat(state.selectedMatch.odds.home);
    } else if (state.selectedOption === "draw") {
      odd = parseFloat(state.selectedMatch.odds.draw);
    } else if (state.selectedOption === "away") {
      odd = parseFloat(state.selectedMatch.odds.away);
    }
  } else if (state.selectedBetType === "score") {
    odd = parseFloat(state.selectedMatch.odds.score);
  } else if (state.selectedBetType === "yellow-cards") {
    odd = parseFloat(state.selectedMatch.odds.yellowCards);
  } else if (state.selectedBetType === "total-goals") {
    odd = parseFloat(state.selectedMatch.odds.totalGoals);
  }

  const potentialWin = amount * odd;
  elements.potentialWin.textContent = `R$ ${potentialWin
    .toFixed(2)
    .replace(".", ",")}`;
}

// Adicionar aposta às pendentes
function addBetToPending() {
  const amount = parseFloat(elements.betAmount.value);

  if (!amount || amount <= 0) {
    showToast("Por favor, insira um valor válido para a aposta.");
    return;
  }

  if (state.selectedBetType === "winner" && !state.selectedOption) {
    showToast("Por favor, selecione uma opção para a aposta.");
    return;
  }

  if (
    state.selectedBetType === "score" &&
    (!elements.homeScore.value || !elements.awayScore.value)
  ) {
    showToast("Por favor, insira um placar válido.");
    return;
  }

  if (state.selectedBetType === "yellow-cards" && !elements.yellowCards.value) {
    showToast("Por favor, insira a quantidade de cartões amarelos.");
    return;
  }

  if (state.selectedBetType === "total-goals" && !elements.totalGoals.value) {
    showToast("Por favor, insira o total de gols.");
    return;
  }

  const bet = {
    id: Date.now(),
    match: state.selectedMatch,
    type: state.selectedBetType,
    amount: amount,
    date: new Date().toLocaleString(),
    status: "pending",
  };

  if (state.selectedBetType === "winner") {
    bet.option = state.selectedOption;
    bet.odd =
      state.selectedOption === "home"
        ? parseFloat(state.selectedMatch.odds.home)
        : state.selectedOption === "draw"
        ? parseFloat(state.selectedMatch.odds.draw)
        : parseFloat(state.selectedMatch.odds.away);
  } else if (state.selectedBetType === "score") {
    bet.homeScore = parseInt(elements.homeScore.value);
    bet.awayScore = parseInt(elements.awayScore.value);
    bet.odd = parseFloat(state.selectedMatch.odds.score);
  } else if (state.selectedBetType === "yellow-cards") {
    bet.yellowCards = parseInt(elements.yellowCards.value);
    bet.odd = parseFloat(state.selectedMatch.odds.yellowCards);
  } else if (state.selectedBetType === "total-goals") {
    bet.totalGoals = parseInt(elements.totalGoals.value);
    bet.odd = parseFloat(state.selectedMatch.odds.totalGoals);
  }

  state.pendingBets.push(bet);
  closeBetModal();

  if (document.getElementById("bets-tab").classList.contains("active")) {
    renderBets();
  }

  showToast(
    'Aposta adicionada às pendentes! Confirme na aba "Minhas Apostas".'
  );
}

// Modal de adicionar fundos
function openAddFundsModal() {
  elements.addFundsModal.style.display = "block";
  elements.customAmount.value = "";
  elements.fundOptions.forEach((opt) => opt.classList.remove("selected"));
}

function closeAddFundsModal() {
  elements.addFundsModal.style.display = "none";
}

function addFunds() {
  let amount = parseFloat(elements.customAmount.value);

  if (!amount || amount <= 0) {
    showToast("Por favor, insira um valor válido.");
    return;
  }

  state.balance += amount;
  updateBalance();
  closeAddFundsModal();
  showToast(`R$ ${amount.toFixed(2)} adicionados ao seu saldo com sucesso!`);
}

// Renderizar apostas
function renderBets() {
  elements.betsContainer.innerHTML = "";

  if (state.pendingBets.length === 0 && state.confirmedBets.length === 0) {
    elements.betsContainer.innerHTML =
      '<p class="empty-message">Você ainda não fez nenhuma aposta.</p>';
    return;
  }

  if (state.pendingBets.length > 0) {
    const pendingHeader = document.createElement("h3");
    pendingHeader.textContent = "Apostas Pendentes";
    pendingHeader.style.margin = "10px 0 5px";
    pendingHeader.style.color = "var(--primary-color)";
    elements.betsContainer.appendChild(pendingHeader);

    state.pendingBets.forEach((bet) => {
      renderBetItem(bet, true);
    });
  }

  if (state.confirmedBets.length > 0) {
    const confirmedHeader = document.createElement("h3");
    confirmedHeader.textContent = "Apostas Confirmadas";
    confirmedHeader.style.margin = "20px 0 5px";
    confirmedHeader.style.color = "var(--primary-color)";
    elements.betsContainer.appendChild(confirmedHeader);

    state.confirmedBets.forEach((bet) => {
      renderBetItem(bet, false);
    });
  }
}

function renderBetItem(bet, isPending) {
  const betItem = document.createElement("div");
  betItem.className = "bet-item";
  betItem.dataset.id = bet.id;

  let betDetails = "";

  if (bet.type === "winner") {
    let optionText = "";
    if (bet.option === "home") {
      optionText = `${bet.match.homeTeam.name} ganha`;
    } else if (bet.option === "draw") {
      optionText = "Empate";
    } else {
      optionText = `${bet.match.awayTeam.name} ganha`;
    }
    betDetails = `Aposta: ${optionText} (Odd: ${bet.odd.toFixed(2)})`;
  } else if (bet.type === "score") {
    betDetails = `Aposta: Placar ${bet.homeScore}-${
      bet.awayScore
    } (Odd: ${bet.odd.toFixed(2)})`;
  } else if (bet.type === "yellow-cards") {
    betDetails = `Aposta: ${
      bet.yellowCards
    } cartões amarelos (Odd: ${bet.odd.toFixed(2)})`;
  } else if (bet.type === "total-goals") {
    betDetails = `Aposta: ${
      bet.totalGoals
    } gols no total (Odd: ${bet.odd.toFixed(2)})`;
  }

  const statusClass =
    bet.status === "won" ? "won" : bet.status === "lost" ? "lost" : "pending";
  const statusText = isPending
    ? "Pendente"
    : bet.status === "won"
    ? "Ganhou"
    : bet.status === "lost"
    ? "Perdeu"
    : "Confirmada";

  betItem.innerHTML = `
    <div class="bet-header">
        <span>${bet.match.league.toUpperCase()}</span>
        <span>${bet.date}</span>
    </div>
    <div class="bet-teams">
        <div class="bet-team">
            <img src="${bet.match.homeTeam.logo}" alt="${
    bet.match.homeTeam.name
  }">
            <span class="bet-team-name">${bet.match.homeTeam.name}</span>
        </div>
        <div class="bet-vs">VS</div>
        <div class="bet-team">
            <img src="${bet.match.awayTeam.logo}" alt="${
    bet.match.awayTeam.name
  }">
            <span class="bet-team-name">${bet.match.awayTeam.name}</span>
        </div>
    </div>
    <div class="bet-details">${betDetails}</div>
    <div class="bet-amount">
        <span>Valor:</span>
        <span>R$ ${bet.amount.toFixed(2).replace(".", ",")}</span>
    </div>
    <div class="bet-status ${statusClass}">
        ${statusText}
    </div>
    ${
      isPending
        ? `
        <div class="bet-actions">
            <button class="confirm-bet-button">🎯 Confirmar</button>
            <button class="remove-bet">🗑️ Cancelar</button>
        </div>
    `
        : ""
    }
`;

  elements.betsContainer.appendChild(betItem);

  if (isPending) {
    const confirmButton = betItem.querySelector(".confirm-bet-button");
    confirmButton.addEventListener("click", () => confirmBet(bet.id));

    const removeButton = betItem.querySelector(".remove-bet");
    removeButton.addEventListener("click", () => removePendingBet(bet.id));
  }
}

function confirmBet(betId) {
  const betIndex = state.pendingBets.findIndex((bet) => bet.id === betId);

  if (betIndex !== -1) {
    const bet = state.pendingBets[betIndex];

    if (bet.amount > state.balance) {
      showToast("Saldo insuficiente para confirmar esta aposta.");
      return;
    }

    state.balance -= bet.amount;
    updateBalance();

    // Mover para apostas confirmadas
    state.confirmedBets.push(bet);
    state.pendingBets.splice(betIndex, 1);

    // Calcular resultado imediatamente
    const result = state.results.find((r) => r.matchId === bet.match.id);
    if (result) {
      let won = false;

      if (bet.type === "winner") {
        won = bet.option === result.result.winner;
      } else if (bet.type === "score") {
        won = bet.homeScore === result.result.homeGoals && 
              bet.awayScore === result.result.awayGoals;
      } else if (bet.type === "yellow-cards") {
        won = bet.yellowCards === result.result.yellowCards;
      } else if (bet.type === "total-goals") {
        won = bet.totalGoals === result.result.totalGoals;
      }

      bet.status = won ? "won" : "lost";

      if (won) {
        const winAmount = bet.amount * bet.odd;
        state.balance += winAmount;
        showToast(`Você ganhou R$ ${winAmount.toFixed(2)} na aposta!`, "success");
      } else {
        showToast(`Você perdeu R$ ${bet.amount.toFixed(2)} na aposta.`, "error");
      }

      updateBalance();
    }

    renderBets();
    showToast("Aposta confirmada com sucesso!");
  }
}

function removePendingBet(betId) {
  const betIndex = state.pendingBets.findIndex((bet) => bet.id === betId);

  if (betIndex !== -1) {
    state.pendingBets.splice(betIndex, 1);
    renderBets();
  }
}

// Carregar e calcular resultados
function loadResults() {
  state.results = state.matches.map((match) => {
    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 5);
    const yellowCards = Math.floor(Math.random() * 7);
    const totalGoals = homeGoals + awayGoals;

    return {
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      date: match.date,
      result: {
        homeGoals,
        awayGoals,
        yellowCards,
        totalGoals,
        winner:
          homeGoals > awayGoals
            ? "home"
            : awayGoals > homeGoals
            ? "away"
            : "draw",
      },
    };
  });

  calculateResults();
}

function calculateResults() {
  let anyChange = false;

  // Verifica todas as apostas confirmadas pendentes
  state.confirmedBets.forEach((bet) => {
    if (bet.status !== "pending") return;

    const result = state.results.find((r) => r.matchId === bet.match.id);

    if (result) {
      let won = false;

      if (bet.type === "winner") {
        won = bet.option === result.result.winner;
      } else if (bet.type === "score") {
        won = bet.homeScore === result.result.homeGoals && 
              bet.awayScore === result.result.awayGoals;
      } else if (bet.type === "yellow-cards") {
        won = bet.yellowCards === result.result.yellowCards;
      } else if (bet.type === "total-goals") {
        won = bet.totalGoals === result.result.totalGoals;
      }

      bet.status = won ? "won" : "lost";
      anyChange = true;

      if (won) {
        const winAmount = bet.amount * bet.odd;
        state.balance += winAmount;
        showToast(`Você ganhou R$ ${winAmount.toFixed(2)} na aposta!`, "success");
      } else {
        showToast(`Você perdeu R$ ${bet.amount.toFixed(2)} na aposta.`, "error");
      }

      // Move a aposta para o histórico
      state.history.push(bet);
    }
  });

  // Remove apostas finalizadas da lista de confirmadas
  state.confirmedBets = state.confirmedBets.filter(bet => bet.status === "pending");

  if (anyChange) {
    updateBalance();
    renderBets();
    renderHistory(); // Atualiza o histórico
  }
}

function renderResults() {
  elements.resultsContainer.innerHTML = "";

  // Só carrega resultados se houver apostas confirmadas
  if (state.confirmedBets.length === 0) {
    elements.resultsContainer.innerHTML =
      '<p class="empty-message">Confirme suas apostas para ver os resultados.</p>';
    return;
  }

  // Filtra apenas apostas de partidas que ainda existem
  const validBets = state.confirmedBets.filter(bet => 
    state.matches.some(match => match.id === bet.match.id)
  );

  // Se não houver apostas válidas, mostra mensagem
  if (validBets.length === 0) {
    elements.resultsContainer.innerHTML =
      '<p class="empty-message">Nenhuma aposta válida para mostrar resultados.</p>';
    return;
  }

  // Gera resultados apenas para partidas com apostas confirmadas que ainda existem
  const matchesWithBets = [...new Set(validBets.map(bet => bet.match.id))];
  
  // Gera resultados apenas para essas partidas
  state.results = matchesWithBets.map(matchId => {
    const match = state.matches.find(m => m.id === matchId);
    // Garante que a partida ainda existe
    if (!match) return null;
    
    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 5);
    const yellowCards = Math.floor(Math.random() * 7);
    const totalGoals = homeGoals + awayGoals;

    return {
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      date: match.date,
      result: {
        homeGoals,
        awayGoals,
        yellowCards,
        totalGoals,
        winner:
          homeGoals > awayGoals
            ? "home"
            : awayGoals > homeGoals
            ? "away"
            : "draw",
      },
    };
  }).filter(result => result !== null); // Filtra resultados nulos

  // Calcula os resultados das apostas
  calculateResults();

  // Renderiza os resultados
  state.results.forEach((result) => {
    const resultCard = document.createElement("div");
    resultCard.className = "result-card";

    resultCard.innerHTML = `
            <div class="result-header">
                <span>${result.league.toUpperCase()}</span>
                <span>${result.date}</span>
            </div>
            <div class="result-teams">
                <div class="result-team">
                    <img src="${result.homeTeam.logo}" alt="${result.homeTeam.name}">
                    <span class="result-team-name">${result.homeTeam.name}</span>
                </div>
                <div class="result-score">${result.result.homeGoals} - ${result.result.awayGoals}</div>
                <div class="result-team">
                    <img src="${result.awayTeam.logo}" alt="${result.awayTeam.name}">
                    <span class="result-team-name">${result.awayTeam.name}</span>
                </div>
            </div>
            <div class="result-details">
                Vencedor: ${
                  result.result.winner === "home"
                    ? result.homeTeam.name
                    : result.result.winner === "away"
                    ? result.awayTeam.name
                    : "Empate"
                }
            </div>
            <div class="result-stats">
                <span>Cartões Amarelos: ${result.result.yellowCards}</span>
                <span>Total de Gols: ${result.result.totalGoals}</span>
            </div>
        `;

    elements.resultsContainer.appendChild(resultCard);
  });

  // Gerar novas partidas após ver os resultados
  setTimeout(() => {
    // Remove apostas confirmadas que já foram resolvidas
    state.confirmedBets = state.confirmedBets.filter(bet => 
      bet.status === "pending" || !state.results.some(r => r.matchId === bet.match.id)
    );
    
    // Gera novas partidas
    generateMatches();
    showToast("Novas partidas disponíveis para apostas!");
    
    // Atualiza a lista de apostas se estiver visível
    if (document.getElementById("bets-tab").classList.contains("active")) {
      renderBets();
    }
  }, 1000);
}

function renderHistory() {
  const container = document.getElementById("history-container");
  container.innerHTML = "";

  if (state.history.length === 0) {
    container.innerHTML = '<p class="empty-message">Nenhuma aposta no histórico.</p>';
    return;
  }

  // Agrupa por data (simplificado - você pode melhorar isso)
  const groupedByDate = {};
  state.history.forEach(bet => {
    const date = bet.date.split(",")[0]; // Pega apenas a data
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(bet);
  });

  // Renderiza por data
  for (const date in groupedByDate) {
    const dateHeader = document.createElement("h3");
    dateHeader.textContent = date;
    dateHeader.style.margin = "20px 0 10px";
    dateHeader.style.color = "var(--primary-color)";
    container.appendChild(dateHeader);

    groupedByDate[date].forEach(bet => {
      const betItem = document.createElement("div");
      betItem.className = "bet-item";
      
      let betDetails = "";
      if (bet.type === "winner") {
        let optionText = bet.option === "home" ? bet.match.homeTeam.name : 
                         bet.option === "away" ? bet.match.awayTeam.name : "Empate";
        betDetails = `Aposta: ${optionText} (Odd: ${bet.odd.toFixed(2)})`;
      } else if (bet.type === "score") {
        betDetails = `Aposta: Placar ${bet.homeScore}-${bet.awayScore} (Odd: ${bet.odd.toFixed(2)})`;
      } else if (bet.type === "yellow-cards") {
        betDetails = `Aposta: ${bet.yellowCards} cartões amarelos (Odd: ${bet.odd.toFixed(2)})`;
      } else if (bet.type === "total-goals") {
        betDetails = `Aposta: ${bet.totalGoals} gols no total (Odd: ${bet.odd.toFixed(2)})`;
      }

      const statusClass = bet.status === "won" ? "won" : "lost";
      const statusText = bet.status === "won" ? "Ganhou" : "Perdeu";

      betItem.innerHTML = `
        <div class="bet-header">
          <span>${bet.match.league.toUpperCase()}</span>
          <span>${bet.date.split(",")[1]?.trim() || ""}</span>
        </div>
        <div class="bet-teams">
          <div class="bet-team">
            <img src="${bet.match.homeTeam.logo}" alt="${bet.match.homeTeam.name}">
            <span class="bet-team-name">${bet.match.homeTeam.name}</span>
          </div>
          <div class="bet-vs">VS</div>
          <div class="bet-team">
            <img src="${bet.match.awayTeam.logo}" alt="${bet.match.awayTeam.name}">
            <span class="bet-team-name">${bet.match.awayTeam.name}</span>
          </div>
        </div>
        <div class="bet-details">${betDetails}</div>
        <div class="bet-amount">
          <span>Valor:</span>
          <span>R$ ${bet.amount.toFixed(2).replace(".", ",")}</span>
        </div>
        <div class="bet-amount">
          <span>Retorno:</span>
          <span>R$ ${(bet.amount * bet.odd).toFixed(2).replace(".", ",")}</span>
        </div>
        <div class="bet-status ${statusClass}">
          ${statusText}
        </div>
      `;

      container.appendChild(betItem);
    });
  }
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// Sistema de Toasts Robusto
function showToast(message, type = "info", duration = 5000) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const messageSpan = document.createElement("span");
  messageSpan.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.className = "close-toast";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", () => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  });

  toast.appendChild(messageSpan);
  toast.appendChild(closeButton);
  container.appendChild(toast);

  // Inicia a animação após a inserção no DOM
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 10);

  // Remove automaticamente após a duração
  if (duration) {
    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return {
    element: toast,
    close: () => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    },
  };
}

// Inicializar aplicação
document.addEventListener("DOMContentLoaded", init);
