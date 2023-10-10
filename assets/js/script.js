//DOM

const input = document.querySelector("input");
const alertaInput = document.querySelector("#alerta-input");
const select = document.querySelector("select");
const alertaSelect = document.querySelector("#alerta-select");
const resultado = document.querySelector("#resultado");
const btn = document.querySelector("button");
const ctx = document.getElementById("myChart");

var myChart;

// Eventos

input.addEventListener("input", (event) => {
  const valorMonedaInput = event.target.value;

  // Verificar si el valor contiene letras
  if (/[a-zA-Z]/.test(valorMonedaInput)) {
    event.target.value = "";
    alertaInput.innerHTML = "Por favor, solo ingrese números.";
  } else {
    // Remover caracteres no deseados
    const valorLimpio = valorMonedaInput.replace(/[,.-]/g, "");

    event.target.value = valorLimpio;
    alertaInput.innerHTML = "";
  }
});

btn.addEventListener("click", (event) => {
  const valorMonedaInput = input.value;
  const valorMonedaSelect = select.value;

  if (valorMonedaInput == "") {
    alertaInput.innerHTML =
      "Por favor ingrese el monto CLP que desea convertir.";
  } else if (valorMonedaSelect == "none") {
    alertaInput.innerHTML = "";
    alertaSelect.innerHTML =
      "Por favor ingrese el tipo de moneda al que quiere convertir.";
  } else {
    alertaInput.innerHTML = "";
    alertaSelect.innerHTML = "";
    getUrl(valorMonedaSelect);
  }
});

//API

async function getUrl(monedaSeleccionada) {
  try {
    const res = await fetch("https://mindicador.cl/api/" + monedaSeleccionada);
    const data = await res.json();
    const { serie } = data;

    const valorInput = input.value;
    resultado.innerHTML = `Monto en ${select.value}:  ${(
      Number(valorInput) / Number(serie[0].valor)
    ).toFixed(2)}`;
    console.log(data);

    // Si ya hay un gráfico existente, lo destruye:
    if (myChart) {
      myChart.destroy();
    }

    // Crea nuevo gráfico, según la opción seleccionada:
    myChart = new Chart(ctx, renderGrafico(serie));
  } catch (error) {
    console.log(`Hubo un error al momento de cargar los datos.`);
  }
}

function renderGrafico(arraySeries) {
  let config;
  try {
    const labels = arraySeries.map((serie) => {
      return new Date(serie.fecha).toLocaleDateString("es-cl", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    });

    const labelsValores = arraySeries.map((serie) => {
      return Number(serie.valor);
    });

    // Deja solo los primeros objetos
    labels.splice(10, labels.length);
    labelsValores.splice(10, labelsValores.length);

    // Crea el objeto que contendrá la información del grafico
    config = {
      type: "line",
      data: {
        labels: labels.reverse(),
        datasets: [
          {
            label: `Fluctuación de: ${select.value.toUpperCase()}`,
            backgroundColor: "white",
            data: labelsValores.reverse(),
            borderColor: "rgb(0, 229, 255)",
            color: "white",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
        scales: {
          y: {
            // Personaliza el color de las etiquetas en el eje Y
            ticks: {
              color: "white", // Cambia el color de las etiquetas a rojo
            },
          },
          x: {
            // Personaliza el color de las etiquetas en el eje Y
            ticks: {
              color: "white", // Cambia el color de las etiquetas a rojo
            },
          },
        },
      },
    };
    return config;
  } catch (e) {
    console.log(`Ha ocurrido el siguiente error:<br>${e.message}`);
  }
}
