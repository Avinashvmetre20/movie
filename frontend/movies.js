const baseURL = "http://localhost:8080/movie"; // adjust backend URL if needed

const moviesList = document.getElementById("movies-list");
const movieForm = document.getElementById("movieForm");
const messageEl = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

// Create and insert the modal popup elements dynamically
const modal = document.createElement("div");
modal.id = "movieModal";
modal.style.display = "none";
modal.style.position = "fixed";
modal.style.zIndex = "1000";
modal.style.left = "0";
modal.style.top = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.overflow = "auto";
modal.style.backgroundColor = "rgba(0,0,0,0.5)";
modal.innerHTML = `
  <div style="
    background: white;
    margin: 10% auto;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    position: relative;
  ">
    <span id="closeModal" style="
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    ">&times;</span>
    <h2>Add New Movie</h2>
  </div>
`;
document.body.appendChild(modal);

// Move the form inside the modal container (replace the <h2> placeholder inside modal)
const modalContent = modal.querySelector("div");
modalContent.appendChild(movieForm);

// Hide the original form container (in HTML) so it only appears in modal
movieForm.style.display = "block"; // inside modal, keep visible

// Create and insert an "Add Movie" button above the movies list
const addMovieBtn = document.createElement("button");
addMovieBtn.textContent = "Add Movie";
addMovieBtn.style.marginBottom = "20px";
addMovieBtn.style.padding = "10px 16px";
addMovieBtn.style.fontSize = "16px";
addMovieBtn.style.cursor = "pointer";
addMovieBtn.style.backgroundColor = "#007bff";
addMovieBtn.style.color = "white";
addMovieBtn.style.border = "none";
addMovieBtn.style.borderRadius = "4px";
addMovieBtn.style.display = "block";
addMovieBtn.style.marginLeft = "auto";
addMovieBtn.style.marginRight = "auto";

const container = document.querySelector(".container");
const moviesListContainer = document.getElementById("movies-list");
container.insertBefore(addMovieBtn, moviesListContainer);

// Show modal on Add Movie button click
addMovieBtn.addEventListener("click", () => {
  messageEl.textContent = ""; // clear any messages
  modal.style.display = "block";
});

// Close modal when clicking the X
document.getElementById("closeModal").addEventListener("click", () => {
  modal.style.display = "none";
  movieForm.reset();
});

// Also close modal if clicking outside the modal content area
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    movieForm.reset();
  }
});

// Check for token on load
const token = localStorage.getItem("token");
if (!token) {
  alert("Please login first");
  window.location.href = "index.html";
}

// Fetch and display all movies
async function fetchMovies() {
  try {
    const res = await fetch(baseURL);
    const data = await res.json();
    if (data.Movies && data.Movies.length) {
      moviesList.innerHTML = "";
      data.Movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
          <img 
            src="${movie.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'}" 
            alt="${movie.title}" 
            onerror="this.onerror=null; this.src='https://via.placeholder.com/200x300?text=No+Image';"
          />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Release Date:</strong> ${new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${movie.duration} mins</p>
            <p><strong>Rating:</strong> ${movie.rating}</p>
            <p>${movie.description}</p>
          </div>
          <button class="delete-btn" data-id="${movie._id}">Delete</button>
        `;
        moviesList.appendChild(card);
      });
      addDeleteListeners();
    } else {
      moviesList.innerHTML = "<p>No movies available.</p>";
    }
  } catch (err) {
    moviesList.innerHTML = `<p>Error fetching movies</p>`;
  }
}

// Add delete event listeners for each delete button
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const movieId = button.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this movie?")) {
        try {
          const res = await fetch(`${baseURL}/${movieId}`, {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            messageEl.style.color = "green";
            messageEl.textContent = "Movie deleted successfully";
            fetchMovies();
          } else {
            messageEl.style.color = "red";
            messageEl.textContent = data.msg || "Failed to delete";
          }
        } catch (err) {
          messageEl.style.color = "red";
          messageEl.textContent = "Error deleting movie";
        }
      }
    });
  });
}

// Handle form submit to create new movie
movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const movieData = {
    title: movieForm.title.value.trim(),
    director: movieForm.director.value.trim(),
    genre: movieForm.genre.value.trim(),
    releaseDate: movieForm.releaseDate.value,
    duration: Number(movieForm.duration.value),
    rating: Number(movieForm.rating.value),
    description: movieForm.description.value.trim(),
    posterUrl: movieForm.posterUrl.value.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${baseURL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(movieData),
    });

    const data = await res.json();
    if (res.ok) {
      messageEl.style.color = "green";
      messageEl.textContent = "Movie added successfully";
      movieForm.reset();
      modal.style.display = "none";  // close modal on success
      fetchMovies();
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = data.msg || "Failed to add movie";
    }
  } catch (err) {
    messageEl.style.color = "red";
    messageEl.textContent = "Error adding movie";
  }
});

// Logout button clears token and redirects to auth page
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Initial fetch of movies
fetchMovies();
