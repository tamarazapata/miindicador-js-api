let  inputAmount = document.querySelector("#input-amount");
const currencyType = document.querySelector("#currency-type");
const conversionBtn = document.querySelector("#submit-btn");
const conversionResult = document.querySelector("#conversion");
const error = document.querySelector("#error");
const url = 'https://mindicador.cl/api'

let currencyData = null; 

const fetchCurrencyData = async () => {
    try {
        const response = await fetch(url)
        const data = await response.json()
        currencyData = data;
        console.log(data)
        return data
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        conversionResult.textContent = 'Error al obtener datos de la API';
    }
}


async function conversor(moneda) {
    if (!currencyData) {
        conversionResult.textContent = 'No se pueden obtener datos de la API';
        return;
    }
    let cantidad = Number( inputAmount.value);
    if (currencyData[moneda]) {
        let division = (cantidad / currencyData[moneda].valor).toFixed(2);
        conversionResult.innerHTML = `Resultado: $ ${division}`;
    } else {
        conversionResult.textContent = 'Moneda no válida';
    }
}

conversionBtn.addEventListener("click", (e) => {
    e.preventDefault(); 

    if ( inputAmount.value === "") {
        conversionResult.textContent = "Ingresa un dato válido";
        return;
    }
    if ( inputAmount.value < 0) {
        conversionResult.textContent = "Sólo puedes ingresar números positivos";
        return;
    }
    if (! currencyType.value) {
        conversionResult.textContent = "Selecciona una moneda válida";
        return;
    }

    conversor(currencyType.value);
});

fetchCurrencyData();



