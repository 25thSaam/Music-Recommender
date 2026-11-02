// ---------- Config ----------
// The one place that knows about your backend. Change this if your route differs.
const API_URL = "/api/recommendations";

// ---------- State ----------
// In React this becomes useState: loading, error, songs, hasSearched.
const state = {
  loading: false,
  error: null,
  songs: [],
  hasSearched: false,
};

// ---------- Helpers ----------
// Prevents text from the API being treated as HTML.
// React does this for you automatically, so this goes away in the migration.
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

// ---------- "Components" ----------
// Each function takes props and returns markup, just like a React component.

function SongCard(song) {
  return `
    <li class="song-card">
      <div class="song-card__main">
        <h3 class="song-card__title">${escapeHtml(song.title)}</h3>
        <p class="song-card__artist">${escapeHtml(song.artist)}</p>
      </div>
      ${song.genre ? `<span class="song-card__tag">${escapeHtml(song.genre)}</span>` : ""}
      ${song.reason ? `<p class="song-card__reason">${escapeHtml(song.reason)}</p>` : ""}
    </li>
  `;
}

function Results({ loading, error, songs, hasSearched }) {
  if (loading) {
    return `<p class="status">Finding songs...</p>`;
  }
  if (error) {
    return `<p class="status status--error">${escapeHtml(error)}</p>`;
  }
  if (!hasSearched) {
    return `<p class="status">Your recommendations will show up here.</p>`;
  }
  if (songs.length === 0) {
    return `<p class="status">No recommendations found. Try a different song or mood.</p>`;
  }
  return `<ul class="song-list">${songs.map(SongCard).join("")}</ul>`;
}

// ---------- Rendering ----------
// In React, re-rendering happens automatically when state changes.
function render() {
  document.getElementById("results").innerHTML = Results(state);
  document.getElementById("submit-btn").disabled = state.loading;
}

// ---------- API call ----------
// Expects the backend to return: { "recommendations": [ { title, artist, genre?, reason? }, ... ] }
async function fetchRecommendations(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }

  const data = await response.json();
  return data.recommendations;
}

// ---------- Event handler ----------
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const payload = {
    query: form.query.value.trim(),
    mood: form.mood.value || null,
    limit: Number(form.limit.value),
  };

  if (!payload.query) return;

  state.loading = true;
  state.error = null;
  render();

  try {
    state.songs = await fetchRecommendations(payload);
  } catch (err) {
    state.error = err.message;
    state.songs = [];
  } finally {
    state.loading = false;
    state.hasSearched = true;
    render();
  }
}

// ---------- Init ----------
document.getElementById("search-form").addEventListener("submit", handleSubmit);
render();
