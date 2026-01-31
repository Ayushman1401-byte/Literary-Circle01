 const API_KEY = 'e603721329918893e97280e3f2edc290'; 
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/w500';
    // 1. Toggle Dropdown visibility
    function toggleDropdown() {
        document.getElementById("genreDropdown").classList.toggle("show");
    }
    // Close dropdown if clicked outside
    window.onclick = function(event) {
        if (!event.target.matches('.genre-trigger')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
        if (event.target == document.getElementById('movieModal')) closeModal();
    }
    // 2. Load Genres into Dropdown
    async function getGenres() {
        const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await res.json();
        const container = document.getElementById('genreDropdown');    
        data.genres.forEach(genre => {
            const btn = document.createElement('button');
            btn.innerText = genre.name;
            btn.onclick = () => {
                fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`);
                document.getElementById('viewTitle').innerText = genre.name;
            };
            container.appendChild(btn);
        });
    }
    // 3. Main Movie Fetcher
    async function fetchMovies(url) {
        const res = await fetch(url);
        const data = await res.json();
        const grid = document.getElementById('movieGrid');
        grid.innerHTML = '';
        data.results.forEach(movie => {
            if(!movie.poster_path) return;
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `<img src="${IMG_URL + movie.poster_path}">`;
            card.onclick = () => showModal(movie.id);
            grid.appendChild(card);
        });
    }
    // 4. Modal Display
    async function showModal(id) {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        const movie = await res.json();
        document.getElementById('modalImg').src = IMG_URL + movie.poster_path;
        document.getElementById('modalTitle').innerText = movie.title;
        document.getElementById('modalRating').innerText = `Rating: ★ ${movie.vote_average.toFixed(1)}`;
        document.getElementById('modalDesc').innerText = movie.overview;
        document.getElementById('movieModal').style.display = "flex";
    }
    function closeModal() { document.getElementById('movieModal').style.display = "none"; }
    function loadPopular() {
        document.getElementById('viewTitle').innerText = "Popular Movies";
        fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    }
    // 5. Search
    document.getElementById('search').addEventListener('input', (e) => {
        const query = e.target.value;
        if(query) fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        else loadPopular();
    });
    // Init
    getGenres();
    loadPopular();