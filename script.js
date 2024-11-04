const rssUrl = 'https://anchor.fm/s/da7e6a28/podcast/rss';
const episodesPerPage = 3; // Número de episódios por página
let currentIndex = 0; // Índice do episódio atual
let episodes = []; // Armazena os episódios

// Função para buscar os episódios
async function fetchEpisodes() {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        const items = xml.getElementsByTagName('item');

        // Loop através dos itens e cria um objeto para cada episódio
        for (let i = 0; i < items.length; i++) {
            const title = items[i].getElementsByTagName('title')[0].textContent;
            const description = items[i].getElementsByTagName('description')[0].textContent;
            const link = items[i].getElementsByTagName('link')[0].textContent;
            const imageUrl = items[i].getElementsByTagName('itunes:image')[0].getAttribute('href');

            episodes.push({
                title,
                description,
                link,
                imageUrl
            });
        }

        displayEpisodes(); // Chama a função para exibir os episódios
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

// Função para limitar a descrição a 20 palavras
function truncateDescription(description, maxWords) {
    const words = description.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...'; // Adiciona '...' se a descrição for cortada
    }
    return description;
}

// Função para exibir os episódios
function displayEpisodes() {
    const episodesContainer = document.getElementById('episodes');
    episodesContainer.innerHTML = ''; // Limpa o conteúdo anterior

    // Limitar os episódios exibidos
    const endIndex = Math.min(currentIndex + episodesPerPage, episodes.length);
    for (let i = currentIndex; i < endIndex; i++) {
        const episode = episodes[i];
        const truncatedDescription = truncateDescription(episode.description, 20); // Limita a descrição a 20 palavras

        const episodeDiv = document.createElement('div');
        episodeDiv.classList.add('episodio');
        episodeDiv.innerHTML = `
            <div class="imagem-episodio">
                <img src="${episode.imageUrl}" alt="${episode.title}">
            </div>
            <div class="info-episodio">
                <h3><a href="${episode.link}" target="_blank">${episode.title}</a></h3>
                <p>${truncatedDescription}</p>
            </div>
        `;
        episodesContainer.appendChild(episodeDiv);
    }
}

// Função para navegar entre os episódios
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex -= episodesPerPage; // Reduz o índice
        displayEpisodes(); // Atualiza a exibição
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex + episodesPerPage < episodes.length) {
        currentIndex += episodesPerPage; // Aumenta o índice
        displayEpisodes(); // Atualiza a exibição
    }
});

// Inicia a busca pelos episódios ao carregar a página
fetchEpisodes();