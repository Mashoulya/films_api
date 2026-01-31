class FavoriteMovie {
    constructor() {
        const saved = localStorage.getItem('favorites');
        this.movies = saved ? JSON.parse(saved) : [];
    }

    add(movie) {
        if (!this.movies.some(m => m.id === movie.id)) {
            this.movies.push(movie);
            this.save();
        }
    }

    remove(movieId) {
        this.movies = this.movies.filter(m => m.id !== movieId);
        this.save();
    }

    getAll(){
        return this.movies
    }

    save() {
        localStorage.setItem('favorites', JSON.stringify(this.movies));
    }

    isFavorite(movieId) {
        return this.movies.some(m => m.id === movieId);
    }
}

const favorites = new FavoriteMovie()

const moviesDiv = document.getElementById('movies')
const favorisDiv = document.getElementById('favoris')
const showFavoris = document.getElementById('showFav')

// masquer les favoris au démarrage
if (favorisDiv) favorisDiv.style.display = 'none'

const API_KEY = 'f4cae5139d261865910d98b7d08d4181'
let allMovies = [] // tableau accessible globalement qui contient tous les films récupérés de l'api
// évite de refaire un fetch à chaque fois qu'on veut réafficher ou mettre à jour les films

async function getFilms() {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
        const data = await response.json()
        const newMovies = data.results.map(mov => ({
            id: mov.id,
            title: mov.title,
            description: mov.overview,
            note: mov.vote_average,
            img: mov.poster_path ? `https://image.tmdb.org/t/p/w500${mov.poster_path}` : ''
        }))
        allMovies = newMovies
        renderMovies(allMovies)
    }catch(error){
        console.log("Erreur lors du chargement des films", error)
    }
}

function renderMovies(movies) {
    moviesDiv.innerHTML = ""
    const ul = document.createElement('ul')

    movies.forEach(m =>{
        const li = document.createElement('li')

        li.innerHTML = `
        <img src="${m.img}">
        <h3>${m.title}</h3>
        <p>${m.description}</p>
        <p>${m.note}</p>
    `

    const btnFav = document.createElement('button')
        btnFav.textContent = favorites.isFavorite(m.id)
        ? '⭐ Retirer'
        : '☆ Ajouter'

        btnFav.addEventListener('click', ()=>{
            if(favorites.isFavorite(m.id)){
                favorites.remove(m.id)
                btnFav.textContent = '☆ Ajouter'
            }else{
                favorites.add(m)
                btnFav.textContent = '⭐ Retirer'
            }
            renderFavoris()
            renderMovies(allMovies)
        })
            
        li.appendChild(btnFav)
        ul.appendChild(li)

    })

    moviesDiv.appendChild(ul)
    
}

function renderFavoris() {
    favorisDiv.innerHTML= ''
    const favs = favorites.getAll()
    if(favs.length === 0){
        favorisDiv.textContent = 'Aucun films en favoris'
        return
    }

    const ul = document.createElement('ul')
    favs.forEach(fav =>{
        const li = document.createElement('li')

        li.innerHTML = `
        <img src="${fav.img}">
        <h3>${fav.title}</h3>
        <p>${fav.description}</p>
        <p>${fav.note}</p>
    `

    const btnFav1 = document.createElement('button')
        btnFav1.textContent = favorites.isFavorite(fav.id)
        ? '⭐ Retirer'
        : '☆ Ajouter'

        btnFav1.addEventListener('click', ()=>{
            if(favorites.isFavorite(fav.id)){
                favorites.remove(fav.id)
                btnFav1.textContent = '☆ Ajouter'
            }else{
                favorites.add(fav)
                btnFav1.textContent = '⭐ Retirer'
            }
            renderFavoris()
            renderMovies(allMovies)
        })
            
        li.appendChild(btnFav1)
        ul.appendChild(li)

    })

    favorisDiv.appendChild(ul)

}

// condition pour montrer ou masquer la liste des films favorits
if (showFavoris) {
  showFavoris.addEventListener('click', () => {
    if (favorisDiv.style.display === 'none') {
      favorisDiv.style.display = 'block';
      showFavoris.textContent = 'Masquer';
    } else {
      favorisDiv.style.display = 'none';
      showFavoris.textContent = 'Afficher';
    }
  });
}

getFilms()
renderFavoris()

