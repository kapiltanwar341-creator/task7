const usersContainer = document.getElementById("users");
const statusEl = document.getElementById("status");
const reloadBtn = document.getElementById("reloadBtn");
const countSelect = document.getElementById("countSelect");

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { 
    return iso; 
  }
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function createUserCard(user) {
  const card = document.createElement('article');
  card.className = 'user-card';

  const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
  const age = user.dob?.age ?? '—';
  const gender = capitalize(user.gender) || '—';
  const nat = (user.nat || '').toUpperCase();

  card.innerHTML = `
    <div class="card-header">
      <img src="${user.picture?.large || user.picture?.medium || ''}" alt="${fullName}" class="user-avatar">
      <div class="user-header-info">
        <h2 class="user-name">${fullName}</h2>
        <div class="user-username">@${user.login?.username || 'user'}</div>
        <div class="meta-badges">
          <span class="badge">👤 ${age} yrs</span>
          <span class="badge">${gender === 'Male' ? '♂️' : '♀️'} ${gender}</span>
          <span class="badge">🌍 ${nat}</span>
        </div>
      </div>
    </div>

    <div class="card-section">
      <div class="section-title">Contact Information</div>
      <div class="info-row">
        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <div class="info-content">
          <div class="info-label">Email</div>
          <div class="info-value"><a href="mailto:${user.email}">${user.email || '—'}</a></div>
        </div>
      </div>
    </div>



    <div class="divider"></div>

  
  `;

  return card;
}

async function fetchUsers() {
  const count = parseInt(countSelect.value, 10) || 9;
  const API = `https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,fr,de`;
  
  usersContainer.innerHTML = '<div class="loading">Loading users...</div>';
  statusEl.textContent = "Fetching new users...";
  reloadBtn.disabled = true;

  try {
    const res = await fetch(API, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const users = data.results || [];

    usersContainer.innerHTML = '';
    statusEl.textContent = `✓ Loaded ${users.length} user${users.length !== 1 ? 's' : ''} successfully`;

    users.forEach(user => {
      const card = createUserCard(user);
      usersContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Fetch error:", err);
    statusEl.textContent = " Failed to load users. Please try again.";
    usersContainer.innerHTML = `
      <div class="user-card">
        <p style="color:var(--text-muted); text-align: center;">
          Unable to fetch data. Please check your connection and try again.
        </p>
      </div>
    `;
  } finally {
    reloadBtn.disabled = false;
  }
}

reloadBtn.addEventListener("click", fetchUsers);
countSelect.addEventListener("change", fetchUsers);

fetchUsers();