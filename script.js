const apiKey = '328c595effbd6be28468e053573443e7'; // Your TMDb API Key
const apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=' + apiKey + '&language=fa-IR'; // Default URL for popular movies

// Select the movie container, search input, and form
const movieContainer = document.getElementById('main');
const searchInput = document.getElementById('search');
const form = document.getElementById('form');

// Function to fetch movie data from TMDb
async function fetchMovies(query = '') {
    try {
        // Show loading message
        movieContainer.innerHTML = '<p>در حال بارگذاری...</p>';

        // If there's a search query, fetch search results; otherwise, fetch popular movies
        const url = query 
            ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fa-IR&query=${encodeURIComponent(query)}`
            : apiUrl; // Default to popular movies if no search query

        const response = await fetch(url);
        const data = await response.json();
        
        const movies = data.results;
        
        // Clear any previous content
        movieContainer.innerHTML = '';

        // If no movies are found, display a message
        if (movies.length === 0) {
            movieContainer.innerHTML = '<p>هیچ نتیجه‌ای پیدا نشد.</p>'; // No results found
            return;
        }

        // Loop through the movie data and display it dynamically
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');

            // Check if the movie has a poster path and set a fallback image if not
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Image+Available'; // Fallback image URL

            // Determine the rating color based on vote_average
            let ratingClass = '';
            if (movie.vote_average >= 7) {
                ratingClass = 'green'; // High rating
            } else if (movie.vote_average >= 4) {
                ratingClass = 'orange'; // Medium rating
            } else {
                ratingClass = 'red'; // Low rating
            }

            movieElement.innerHTML = `
                <img class="movie-image" src="${posterPath}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <span class="${ratingClass}">${movie.vote_average}</span>
                </div>
                <div class="overview">
                    <h3>توضیحات</h3>
                    ${movie.overview || 'توضیحات در دسترس نیست.'}
                </div>
            `;

            // Append the movie element to the container
            movieContainer.appendChild(movieElement);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        movieContainer.innerHTML = '<p>مشکلی پیش آمده است. لطفا دوباره امتحان کنید.</p>'; // Error message
    }
}

// Event listener for the search form
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission
    const query = searchInput.value.trim(); // Get the value from the search input
    fetchMovies(query); // Fetch movies based on the search query
});

// Fetch popular movies when the page loads (if no search query is present)
window.onload = () => fetchMovies();
