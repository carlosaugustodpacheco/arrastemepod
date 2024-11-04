const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const episodesRow = document.querySelector('.episodios-row');

let currentSet = 0;
const episodesPerPage = 3; // Número de episódios por página
const totalEpisodes = 6; // Total de episódios (substitua pelo número real de episódios)

function updateEpisodesDisplay() {
    const offset = currentSet * episodesPerPage;
    const maxOffset = Math.ceil(totalEpisodes / episodesPerPage) - 1;

    if (currentSet < 0) currentSet = 0;
    if (currentSet > maxOffset) currentSet = maxOffset;

    episodesRow.style.transform = `translateX(-${offset * 100}%)`;
}

prevBtn.addEventListener('click', () => {
    currentSet--;
    updateEpisodesDisplay();
});

nextBtn.addEventListener('click', () => {
    currentSet++;
    updateEpisodesDisplay();
});

// Inicializa a exibição dos episódios
updateEpisodesDisplay();