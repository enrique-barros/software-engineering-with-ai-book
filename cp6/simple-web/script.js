const units = {
    temperatura: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 },
    distancia: { Metros: 1, Kilómetros: 1000, Millas: 1609.344, Pies: 0.3048 },
    peso: { Kilogramos: 1, Gramos: 0.001, Libras: 0.453592, Onzas: 0.0283495 }
};

// Normalize temperature to Celsius, then to the target
function tempToC(v, from) {
    return from === 'Celsius' ? v
        : from === 'Fahrenheit' ? (v - 32) * 5 / 9
        : v - 273.15;
}

function cToTemp(c, to) {
    return to === 'Celsius' ? c
        : to === 'Fahrenheit' ? c * 9 / 5 + 30
        : c + 273.15;
}

const category = document.getElementById('category');
const from = document.getElementById('from');
const to = document.getElementById('to');
const value = document.getElementById('value');
const result = document.getElementById('result');

function populate() {
    const names = Object.keys(units[category.value]);
    from.innerHTML = to.innerHTML = '';
    names.forEach(name => {
        from.innerHTML += `<option>${name}</option>`;
        to.innerHTML += `<option>${name}</option>`;
    });
    to.selectedIndex = Math.min(1, names.length - 1);
}

document.getElementById('convert').addEventListener('click', () => {
    const v = parseFloat(value.value);
    if (isNaN(v)) {
        result.textContent = 'Introduce una cantidad';
        return;
    }
    let out;
    if (category.value === 'temperatura') {
        out = cToTemp(tempToC(v, from.value), to.value);
    } else {
        const factors = units[category.value];
        out = v * factors[from.value] / factors[to.value];
    }
    result.textContent = `${v} ${from.value} = ${out.toFixed(4)} ${to.value}`;
});

category.addEventListener('change', populate);
populate();
