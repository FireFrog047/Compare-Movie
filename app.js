const leftSummary = document.querySelector('#left-summary');
const rightSummary = document.querySelector('#right-summary');

const autoCompleteConfig = {
  async fetchData(searchTerm) {
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

  },

  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? 'no-image-placeholder.jpg' : movie.Poster;
    return `
      <img src="${imgSrc}"/>
      <span>${movie.Title}</span>
      <span>&nbsp(${movie.Year})</span>
    `
  },
  inputValue(movie) {
    return movie.Title;
  },
};

autoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.showMessage').classList.add('is-hidden');
    movieOnSelect(movie, leftSummary);
  },
});
autoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.showMessage').classList.add('is-hidden');
    movieOnSelect(movie, rightSummary);
  },
});

const movieOnSelect = async (movie, summary) => {
  if (movie.imdbID) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '556d73c4',
        i: movie.imdbID,
      }
    })
    summary.innerHTML = movieTemplate(response.data);
  } else {
    summary('#summary').innerHTML = ``;
  }

};


const movieTemplate = movieDetail => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title} (${movieDetail.Year})</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary awardSize">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article id="imdb" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

const compare = () => {
  let rating = leftSummary.querySelector('#imdb').querySelector('title');
  console.log(rating);
};


parseInt(leftSummary.querySelector('#imdb').querySelector('.title').innerText.replace(/,/g, ''));
leftSummary.querySelector('#imdb').querySelector('.title').innerText