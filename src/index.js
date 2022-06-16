import './styles.css';

const player = document.querySelector('.name');
const score = document.querySelector('.score');
const submitbtn = document.querySelector('.submit');
const refreshbtn = document.querySelector('.refresh');
const scoresdiv = document.querySelector('.scores-div');
const msg = document.querySelector('#message');
const gameid = localStorage.getItem('scores');
const api = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';

const hide = () => {
  msg.classList.remove('active');
  msg.classList.remove('empty');
};

const gamename = async (gameid) => {
  let response = await fetch(api, {
    method: 'POST',
    body: JSON.stringify({ name: "Xxx Game" }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  response = await response.json();
  gameid = await response.result.slice(14, 34);
  localStorage.setItem('scores', gameid);
  window.location.reload();
};

const submitfun = async (player, score, gameid) => {
  if (player.value !== '' && score.value !== '') {
    await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameid}/scores`, {
      method: 'POST',
      body: JSON.stringify({
        user: `${player.value}`,
        score: `${score.value}`,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    msg.textContent = 'Score Added';
    msg.classList.add('active');
    player.value = '';
    score.value = '';
    setTimeout(hide, 2000);
  } else {
    msg.textContent = "Inputs shouldn't be empty";
    msg.classList.add('empty');
    setTimeout(hide, 2000);
  }
};

const refreshfun = async (gameid, scoresdiv) => {
  msg.textContent = 'Getting Data';
  msg.classList.add('active');
  setTimeout(hide, 2000);
  scoresdiv.innerHTML = '';
  let response = await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameid}/scores`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  response = await response.json();
  response.result.forEach((element) => {
    scoresdiv.innerHTML += `<li class="scores-li">${element.user}  ${element.score}</li>`;
  });
};

if (gameid === null) { gamename(); }

submitbtn.addEventListener('click', () => {
  submitfun(player, score, gameid);
});

refreshbtn.addEventListener('click', () => {
  refreshfun(gameid, scoresdiv);
});
