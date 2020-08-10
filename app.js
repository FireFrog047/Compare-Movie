const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '556d73c4',
            s: searchTerm
        }
    })
    if (response.data.Error) {
        return [];
    }
    return response.data.Search;
};

const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWraper = document.querySelector('.results');

const onInput = async (event) => {
    const movies = await fetchData(event.target.value);

    if (movies.length == 0) {
        movies[0] = {
            Poster: 'N/A',
            Title: `No movies found with "${input.value.bold()}"`
        }
    }

    resultsWraper.innerHTML = '';
    dropdown.classList.add('is-active');

    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
        <img src="${imgSrc}"/>
        ${movie.Title}
        `;
        resultsWraper.appendChild(option);
    }
    if (input.value.length == 0) {
        dropdown.classList.remove('is-active');
    }
};

input.addEventListener('input', debounce(onInput));
const root = document.querySelector('.autocomplete');

document.addEventListener('click', (event) => {
    if (input.value.length == 0) {
        dropdown.classList.remove('is-active');
    } else if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    } else {
        dropdown.classList.add('is-active');
    }
})