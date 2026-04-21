const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    createErrorCard("Kullanıcı bulunamadı: @" + username);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = "";
  }
});

function createUserCard(user) {
  const userName = user.name || user.login;
  const userBio = user.bio ? `<p class="bio-text">${user.bio}</p>` : "";

  const cardHTML = `
    <div class="card">
      <div class="avatar-wrap">
        <img class="user-image" src="${user.avatar_url}" alt="${userName}" />
      </div>
      <div class="user-info">
        <div class="user-name">
          <h2>${userName}</h2>
          <small>@${user.login}</small>
        </div>
      </div>
      ${userBio}
      <ul>
        <li>
          <i class="fa-solid fa-user-group"></i>
          <span class="stat-number">${user.followers}</span>
          <span class="stat-label">Followers</span>
        </li>
        <li>
          <i class="fa-solid fa-user-plus"></i>
          <span class="stat-number">${user.following}</span>
          <span class="stat-label">Following</span>
        </li>
        <li>
          <i class="fa-solid fa-book-bookmark"></i>
          <span class="stat-number">${user.public_repos}</span>
          <span class="stat-label">Repos</span>
        </li>
      </ul>
      <div class="divider"></div>
      <p class="repos-title">// repositories</p>
      <div class="repos" id="repos"></div>
    </div>
  `;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  main.innerHTML = `
    <div class="card">
      <h2>${msg}</h2>
    </div>
  `;
}

async function getRepos(username) {
  try {
    const { data } = await axios(
      API_URL + username + "/repos?sort=updated&per_page=10",
    );
    addReposToCard(data);
  } catch (err) {
    console.log(err);
  }
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 10).forEach((repo) => {
    const reposLink = document.createElement("a");
    reposLink.href = repo.html_url;
    reposLink.target = "_blank";
    reposLink.innerHTML = `<i class="fa-solid fa-code-branch"></i>${repo.name}`;
    reposEl.appendChild(reposLink);
  });
}
