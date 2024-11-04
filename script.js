const rssUrl = 'https://anchor.fm/s/da7e6a28/podcast/rss';
const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
let episodes = [];
let currentIndex = 0;
const episodesPerPage = 3;

async function fetchEpisodes() {
    try {
        const response = await fetch(`${proxyUrl}${encodeURIComponent(rssUrl)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');

        // Limpa o array de episódios
        episodes = [];

        for (let i = 0; i < items.length; i++) {
            const title = items[i].getElementsByTagName('title')[0].textContent;
            const link = items[i].getElementsByTagName('link')[0].textContent;
            const description = items[i].getElementsByTagName('description')[0].textContent;
            const imageUrl = items[i].getElementsByTagName('itunes:image')[0].getAttribute('href');

            episodes.push({
                title,
                link,
                description,
                imageUrl,
            });
        }

        displayEpisodes();
    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

function displayEpisodes() {
    const episodesContainer = document.getElementById('episodes');
    episodesContainer.innerHTML = ''; // Limpa o conteúdo anterior

    // Limitar os episódios exibidos
    const endIndex = Math.min(currentIndex + episodesPerPage, episodes.length);
    for (let i = currentIndex; i < endIndex; i++) {
        const episode = episodes[i];

        const episodeDiv = document.createElement('div');
        episodeDiv.classList.add('episodio');
        episodeDiv.innerHTML = `
            <div class="imagem-episodio">
                <img src="${episode.imageUrl}" alt="${episode.title}">
            </div>
            <div class="info-episodio">
                <h3><a href="${episode.link}" target="_blank">${episode.title}</a></h3>
                <p>${episode.description}</p>
            </div>
        `;
        episodesContainer.appendChild(episodeDiv);
    }
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex -= episodesPerPage;
        displayEpisodes();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex + episodesPerPage < episodes.length) {
        currentIndex += episodesPerPage;
        displayEpisodes();
    }
});

fetchEpisodes();
