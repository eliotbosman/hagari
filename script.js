// Web colors array
const webColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#C0C0C0', '#808080', '#F00000', '#00F000', '#0000F0', '#F0F000',
    '#F000F0', '#00F0F0', '#C00000', '#00C000', '#0000C0', '#C0C000', '#C000C0', '#00C0C0'
];

let lastColor1 = null;
let lastColor2 = null;

function getRandomColor(excludeColor) {
    let availableColors = webColors.filter(color => color !== excludeColor);
    return availableColors[Math.floor(Math.random() * availableColors.length)];
}

function updateBackgroundStripes() {
    const newColor1 = getRandomColor(lastColor2);
    const newColor2 = getRandomColor(newColor1);
    
    document.body.style.setProperty('--color1', newColor1);
    document.body.style.setProperty('--color2', newColor2);
    
    lastColor1 = newColor1;
    lastColor2 = newColor2;
}

function updateFrameStripes() {
    const containers = document.querySelectorAll('.image-container');
    containers.forEach(container => {
        const frameColor1 = getRandomColor(null);
        const frameColor2 = getRandomColor(frameColor1);
        container.style.setProperty('--frame-color1', frameColor1);
        container.style.setProperty('--frame-color2', frameColor2);
    });
}

function loadImages() {
    const quotes = [
        "Friendship is born at that moment when one person says to another, 'What! You too?'",
        "A friend is someone who knows all about you and still loves you.",
        "True friends are never apart, maybe in distance but never in heart.",
        "Friendship is the only cement that will ever hold the world together.",
        "A real friend is one who walks in when the rest of the world walks out.",
        "Friends are the family we choose for ourselves.",
        "A friend is someone who gives you total freedom to be yourself.",
        "Friendship is not about whom you know the longest but who came and never left.",
        "Friends are the siblings God never gave us.",
        "Good friends are like stars, you don't always see them but you know they're always there.",
        "Friendship marks a life even more deeply than love.",
        "A friend knows the song in my heart and sings it to me when my memory fails.",
        "The greatest gift of life is friendship.",
        "Friends are those rare people who ask how we are and then wait to hear the answer.",
        "A friend is one of the best things you can be and the greatest things you can have."
    ];

    let availableQuotes = [...quotes];

    function getUniqueQuote() {
        if (availableQuotes.length === 0) {
            availableQuotes = [...quotes]; 
        }
        const randomIndex = Math.floor(Math.random() * availableQuotes.length);
        return availableQuotes.splice(randomIndex, 1)[0];
    }

    fetch('images')
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const imageFiles = Array.from(doc.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.match(/\.(jpg|jpeg|png|gif)$/i));

            const gallery = document.getElementById('gallery');
            imageFiles.forEach(imagePath => {
                const container = document.createElement('div');
                container.className = 'image-container';
                
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = imagePath;
                
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = getUniqueQuote();
                
                figure.appendChild(img);
                figure.appendChild(figcaption);
                container.appendChild(figure);
                gallery.appendChild(container);
            });
            
            // Initial frame colors
            updateFrameStripes();
        });
}

// Music Player
const audio = document.getElementById('song');
const playPauseButton = document.getElementById('playPause');
const progress = document.querySelector('.progress');
let isPlaying = false;

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    progress.style.width = '0%';
});

function updateMusicPlayerColors() {
    const musicIcon = document.querySelector('.song-info i');
    if (musicIcon) {
        musicIcon.style.color = lastColor1;
    }
}

const originalUpdateBackgroundStripes = updateBackgroundStripes;
updateBackgroundStripes = function() {
    originalUpdateBackgroundStripes();
    updateMusicPlayerColors();
};

updateBackgroundStripes();

setInterval(() => {
    updateBackgroundStripes();
    updateFrameStripes();
}, 2000);

window.addEventListener('load', loadImages);
