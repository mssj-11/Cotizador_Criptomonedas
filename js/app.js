const formContainer = document.querySelector('.form-container');
const form = document.querySelector('#form-search');
const currency = document.querySelector('#currency');
const cryptocurrency = document.querySelector('#cryptocurrencies');
const containerAnswer = document.querySelector('.container-answer');

// Creacion del objeto (busqueda)
const objSearch = {
    currency: '',
    cryptocurrencies: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultCryptocurrencies();

    form.addEventListener('submit', submitForm);
    currency.addEventListener('change', getValue);
    cryptocurrency.addEventListener('change', getValue);
});



// Funcion para enviar el formulario
function submitForm(e){
    e.preventDefault();
    const {currency, cryptocurrency} = objSearch;

    if (!currency || !cryptocurrency) {
        showError('Select both currencies');
        return;
    }
    consultAPI(currency, cryptocurrency);
}


// Funcion para consultar a la API
function consultAPI(currency, cryptocurrency){
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            showQuote(responseJson.DISPLAY[cryptocurrency][currency])
        })
        .catch(error => console.log(error));
}


// Funcion Mostrar Cotizacion
function showQuote(data){
    clearHTML();

// Recuperando (Precio, Dia alto, Dia bajo, cambio de 24h, ultima actualizacion) & eso sera igual a data
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = data;
    const answer = document.createElement('div');
    answer.classList.add('display-info');
    answer.innerHTML= `
        <p class="main-price">Price: <span>${PRICE}</span></p>
        <p>High Day: <span>${HIGHDAY}</span></p>
        <p>Low Day: <span>${LOWDAY}</span></p>
        <p>Variation Latest 24h: <span>${CHANGEPCT24HOUR}%</span></p>
        <p>Last Update: <span>${LASTUPDATE}</span></p>
    `;
    containerAnswer.appendChild(answer);
}


// Funcion para eliminar HTML
function clearHTML(){  containerAnswer.innerHTML = '';  }



// Funcion para Mostrar el error
function showError(msg){
    const error = document.createElement('p');
    error.classList.add("error");
    error.textContent = msg;
    formContainer.appendChild(error);

    setTimeout(() => error.remove(), 3000);
}

// Funcion para Obtener el Valor
function getValue(e){  objSearch[e.target.name] = e.target.value; }


function consultCryptocurrencies(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            selectCrypto(responseJson.Data);
        })
        .catch(error => console.log(error));
}


// Funcion para seleccionar criptomonedas
function selectCrypto(cryptos){
    cryptos.forEach(crypto => {
        const {FullName, Name} = crypto.CoinInfo;
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        cryptocurrency.appendChild(option);
    });
}