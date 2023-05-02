/*

Si è voluto utilizzare 2 API
- ChatGPT by xy767 - Autenticazione Normale - (Free Rate Use 100/month) (https://rapidapi.com/xy767/api/chatgpt-api6)
- Spotify API by Spotify - Autenticazione Oauth 2.0 - (Free Rate Use unlimited/month) (https://developer.spotify.com/documentation/web-api)

Per ChatGPT ho dovuto usare un endpoint su RapidAPI in quanto è possibile utilizzare direttamente le API
di OPEN AI ma girando in locale (XAMPP) avrò errore di tipo CURS. Rapid API si occupa di intermediare (Come se fosse un proxy).
Il problema è che non essendo API ufficiali potrebbero non avere un uptime costante o garantito. 

Le key in chiaro non sono sicure, questo è un test a scopo didattico.
Andrebbe fatta chiamata ad un server sul backend, e sarà lui a intermediare i dati con le API e ritornare informazioni.

Per evitare abusi sulle secret e public key, queste stesse saranno disabilitate dopo aver esaminato e valutata
la prova mhw3

 */


function getOpenAI(){
    const prompt = document.querySelector('#prompt');
    const apikey = "cf711159f9msh3df011164105b6bp1cd068jsn85101121dc74";

    document.querySelector('.loader-container').style.display = 'block';

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': `${apikey}`,
            'X-RapidAPI-Host': 'chatgpt-api6.p.rapidapi.com'
        },
        body: JSON.stringify({
            conversation: [{"role":"user","content": `Che sapore ha il vino con nome: ${prompt.value}`}]
        })
    };

    fetch('https://chatgpt-api6.p.rapidapi.com/standard-gpt', options)
    .then(response => {
        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati");
        }
        return response.json();
      })
      .then(data => {
        console.log("Risposta: " + data.answer.content);
        document.querySelector('#results').innerText = data.answer.content
        document.querySelector('.loader-container').style.display = 'none';
      })
      .catch(error => {
        console.error("Si è verificato un errore:", error);
      });

}


const clientId = 'e90c42c94365498b9a02cfc60d7885ed';
const clientSecret = '4fe417c59e8b497a8e28988d8caac24e';
const tokenUrl = 'https://accounts.spotify.com/api/token';
const searchUrl = 'https://api.spotify.com/v1/search';

async function getToken() {
const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    //btoa Codifica BASE64
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
});
const data = await response.json();
return data.access_token;
}

async function searchSongs() {
  document.querySelector('.loader-container').style.display = 'block';
  const token = await getToken();

  const response = await fetch(`${searchUrl}?q=track%3AVino&type=track&market=IT`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const data = await response.json();

  const songs = data.tracks.items;

  songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song.name} - ${song.artists[0].name}`);

    const p = document.createElement("p");
    p.innerHTML = (`${index + 1}. ${song.name} - ${song.artists[0].name}`);
    document.getElementById("results_song").appendChild(p);

  });
  document.querySelector('.loader-container').style.display = 'none';
}


//*********   EVENT LISTENER   ********/
const gpt = document.querySelector('#search');
gpt.addEventListener('click', getOpenAI)

const spotify = document.querySelector('#search2');
spotify.addEventListener('click', searchSongs)
