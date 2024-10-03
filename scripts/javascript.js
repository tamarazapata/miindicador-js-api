let  inputAmount = document.querySelector("#input-amount");
const currencyType = document.querySelector("#currency-type");
const conversionBtn = document.querySelector("#submit-btn");
const conversionResult = document.querySelector("#conversion");
const chartTitle = document.querySelector("#chart-title");
const error = document.querySelector("#error");
const url = 'https://mindicador.cl/api';




let currencyData = null; 
let myChart = null;

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
    let currentYear = new Date().getFullYear();
    console.log(currentYear)
    console.log(moneda)
    if (currencyData[moneda]) {
        let denominador = currencyData[moneda].valor
        let division = (cantidad / denominador).toFixed(2);
        conversionResult.innerHTML = `Resultado: $ ${division}`;
        createChart(moneda,currentYear)
    } else {
        conversionResult.textContent = 'Moneda no válida';
    }
}

conversionBtn.addEventListener("click", (e) => {
    e.preventDefault(); 

    if ( inputAmount.value === "") {
        conversionResult.textContent = "Ingresa un monto válido";
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

async function createChart(currency, year) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}/${year}`);
        const data = await response.json();

        const labels = data.serie.map(item => new Date(item.fecha).toLocaleDateString());
        const values = data.serie.map(item => item.valor);

        const ctx = document.getElementById('currencyChart').getContext('2d');
        chartTitle.textContent = "Título";
        chartTitle.innerHTML = `Tendencia ${currency} en ${year}`;
        const chart = new Chart(ctx, {
            type: 'line', 
            data: {
                labels: labels, // X-axis 
                datasets: [{
                    label: `${currency} in ${year}`,
                    data: values, 
                    borderColor: 'rgba(13, 110, 253, 1)', 
                    backgroundColor: 'rgba(13, 202, 240, 1)', 
                    borderWidth: 1 
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false 
                    }
                },
                responsive: true,
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}






