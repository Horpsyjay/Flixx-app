
const global = {
    currentPage: window.location.pathname,
    search: {
      term: '',
      type: '',
      page: 1,
      totalPages: 1,
      totalResults: 0
    },
    api: {
      apiUrl: 'https://api.themoviedb.org/3/',
      apiKey: 'bd97df318f65f6de564d916da8d8cd73'
    }
};


async function fetchAPIData(endpoint) {
  const API_URL = global.api.apiUrl;
  const API_KEY = global.api.apiKey; 

  showSpinner(); 

  const res = await fetch(
      `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

     
  const data = await res.json();

  hideSpinner();

  return data;
}


async function displayPopularMovies() {
    const {results} = await fetchAPIData('movie/popular');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
         ${
           movie.poster_path ?
            ` <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />` :
            ` <img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
         }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>`

        document.getElementById('popular-movies').appendChild(div); 
    });

    
}


// Display showDetails : REQUIRES TO GET THE ID FIRST
async function displayShowDetails() {

const showId = window.location.search.split('=')[1];

const show = await fetchAPIData(`tv/${showId}`);

// Overlay for Background Image
displayBackgroundImages('tv', show.backdrop_path);

const div = document.createElement('div');
div.innerHTML = `
<div class="details-top">
<div>
${
  show.poster_path ?
   ` <img
   src="https://image.tmdb.org/t/p/w500${show.poster_path}"
   class="card-img-top"
   alt="${show.name}"
 />` :
   ` <img
   src="../images/no-image.jpg"
   class="card-img-top"
   alt="${show.name}"
 />`
}
</div>
<div>
  <h2>${show.name}</h2>
  <p>
    <i class="fas fa-star text-primary"></i>
    ${show.vote_average.toFixed(1)} / 10
  </p>
  <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
  <p>
    ${show.overview}
  </p>
  <h5>Genres</h5>
  <ul class="list-group">
   ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
  </ul>
  <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
</div>
</div>
<div class="details-bottom">
<h2>Show Info</h2>
<ul>
  <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
  <li><span class="text-secondary">Number of Seasons:</span> ${show.number_of_seasons}</li>
  <li><span class="text-secondary">Last Episode to Air:</span> ${show.last_episode_to_air.name}</li>
  <li><span class="text-secondary">Status:</span> ${show.status}</li>
</ul>
<h4>Production Companies</h4>
<div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join('')} </div>
</div>
`;

document.getElementById('show-details').appendChild(div);

}


// Display Movie details
async function displayMovieDetails() {

  const movieId = window.location.search.split('=')[1];
  
  const movie = await fetchAPIData(`movie/${movieId}`);
  
  // Overlay for Background Image
  displayBackgroundImages('movie', movie.backdrop_path);
  
  
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path ?
     ` <img
     src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
     class="card-img-top"
     alt="${movie.title}"
   />` :
     ` <img
     src="../images/no-image.jpg"
     class="card-img-top"
     alt="${movie.title}"
   />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
     ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
  </div>
  <div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNum(movie.budget)}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNum(movie.revenue)}</li>
    <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')} </div>
  </div>
  `;
  
  document.getElementById('movie-details').appendChild(div);
  
  }

// Display Backdrop on detailsPages

 function displayBackgroundImages(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh' ;
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0' ;
  overlayDiv.style.left = '0' ;
  overlayDiv.style.zIndex = '-1' ;
  overlayDiv.style.opacity = '0.1' ;

  if(type === 'movie') {
    document.getElementById('movie-details').appendChild(overlayDiv);
  }else{
    document.getElementById('show-details').appendChild(overlayDiv);
  }
} 

// Adds comma to Number after 3digits
function addCommasToNum(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Search movie/shows

async function search() {
  const querystring = document.location.search;
  const urlparams = new URLSearchParams(querystring);

  global.search.type = urlparams.get('type');
  global.search.term = urlparams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null ) {
    const {results, total_pages, page, total_results} = await searchAPIData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    

    if(results.length === 0) {
      showAlert('No result found');
      return;
    }

    displaySearchResult(results);
    document.querySelector('#search-term').value = '';

  }else{
     showAlert('Enter a search term');
  }

}

function displaySearchResult(results) {
  // Clear Previous Result
  document.getElementById('search-results').innerHTML ='';
  document.getElementById('search-results-heading').innerHTML ='';
  document.getElementById('pagination').innerHTML ='';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
     ${
       result.poster_path ?
        ` <img
        src="https://image.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === 'movie' ? result.title : result.name }"
      />` :
        ` <img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${global.search.type === 'movie' ? result.title : result.name}"
      />`
     }
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
      </p>
    </div>`

    document.getElementById('search-results-heading').innerHTML = `
            <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`

    document.getElementById('search-results').appendChild(div); 

   
  })

  displayPagination();
}

// Create function to display Pagination for search

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector('#pagination').appendChild(div);

  // Disable the prev if on firstPage & versa  
  if(global.search.page === 1) {
    document.getElementById('prev').disabled = true;
  }
  if(global.search.page === global.search.totalPages) {
    document.getElementById('next').disabled = true;
  }

  //Next page
  document.getElementById('next').addEventListener('click', async () => {
    global.search.page++;
    const {results, total_pages} = await searchAPIData();
    displaySearchResult(results);
  } );

  //prev page
  document.getElementById('prev').addEventListener('click', async () => {
    global.search.page--;
    const {results, total_pages} = await searchAPIData();
    displaySearchResult(results);
  } );

}

// Display Alert

function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));

  document.getElementById('alert').appendChild(alertEl);

  setTimeout(() =>  alertEl.remove(), 3000)
}


// Display Slider Movies
async function displaySlider() {
  const {results} = await fetchAPIData('movie/now_playing');
 
  results.forEach((movie) => {
  const div = document.createElement('div');
  div.classList.add('swiper-slide')
  div.innerHTML = `
  <a href="movie-details.html?id=${movie.id}">
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average}/ 10
  </h4>
  `
    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
})

};

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    fremode: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      }
    }


  })
};


async function displayPopularTvShows() {

   const {results} = await fetchAPIData('tv/popular');
    results.forEach((show) => {
    const div = document.createElement('div');
      div.classList.add('card');
        div.innerHTML =  `<a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path ?
           ` <img
           src="https://image.tmdb.org/t/p/w500${show.poster_path}"
           class="card-img-top"
           alt="${show.name}"
         />` :
           ` <img
           src="../images/no-image.jpg"
           class="card-img-top"
           alt="${show.name}"
         />`
        }
       </a>
       <div class="card-body">
         <h5 class="card-title">${show.name}</h5>
         <p class="card-text">
           <small class="text-muted">Air Date: ${show.first_air_date}</small>
         </p>
       </div>`

       document.getElementById('popular-shows').appendChild(div)
   } )

}


// Make a request to the search Endpoint
async function searchAPIData() {
    const API_URL = global.api.apiUrl;
    const API_KEY = global.api.apiKey; 

    showSpinner(); 

    const res = await fetch(
        `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
        
        );

       
    const data = await res.json();

    hideSpinner();

    return data;
}



// Highlight Ctive Links

function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage) {
            link.classList.add('active'); 
        }
    } )
};


function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}



// Init App 
function init() {
    switch (global.currentPage) {
        case '/' :
        case '/index.html' :
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows.html' :
           displayPopularTvShows();
            break;
        case '/movie-details.html' :
           displayMovieDetails();
            break;
        case '/tv-details.html' :
            displayShowDetails() ;
            break;
        case '/search.html' :
            search();
            break;
    }

    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);