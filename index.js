let fileURL = 'file.txt';

waldCriteria();
laplaceCriteria();
hurwitzCriteria(0.7);
bayeslaplaceCriteria([0.5, 0.35, 0.15]);

async function getFile() {
    const res = await fetch(fileURL);
    const t = await res.text();
    return t;
}

async function waldCriteria() {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    const min = [];
    strategies.forEach(el => {
        min.push(Math.min(...el.split(' ')));
    });
    console.log('%c Критерій Вальда: ', 'background: #000080; color: #ADD8E6');
    console.log(`Рядки мінімальних значень: ${min.join(' ')}`);
    console.log(`Максимальне нижнє значення: ${Math.max(...min)}`);
    strategies.forEach(el => {
        if (Math.min(...el.split(' ')) === Math.max(...min)) {
            console.log(`Найкращий варіант ${el}`)
        }
    })
}

async function laplaceCriteria() {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    let newStrategies = [];
    let sumRows = [];
    strategies.forEach(el => {
        newStrategies.push(el.split(' ').map((val) => val / strategies.length));
    });
    newStrategies.forEach(el => {
        sumRows.push(el.reduce((a, c) => a + c));
    });

    console.log('%c Оцінка Лапласа: ', 'background:#000080; color: #ADD8E6');
    console.log(`Значення суми рядків: ${sumRows.join(' ')}`);
    console.log(`Максимальне значення: ${Math.max(...sumRows)}`);

    strategies.forEach(el => {
        let newValues = el.split(' ').map((val) => val / strategies.length);
        let sum = newValues.reduce((a, c) => a + c);
        if (sum === Math.max(...sumRows)) {
            console.log(`Найкращий варіант ${el}`);
        }
    });

}

async function hurwitzCriteria(coef) {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    let max = [];
    let min = [];
    strategies.forEach(el => {
        max.push(Math.max(...el.split(' ')));
        min.push(Math.min(...el.split(' ')));
    });
    console.log('%c Критерій Гурвіца: ', 'background: #000080; color: #ADD8E6');
    console.log(`Коефіцієнт: ${coef}`);
    console.log(`Найнижчі значення кожного рядка: ${min.join(' ')}`);
    console.log(`Найвищі значення кожного рядка: ${max.join(' ')}`);
    max = max.map(el => el * (1 - coef));
    min = min.map(el => el * coef);
    let values = [];
    for (let i = 0; i < strategies.length; i++) {
        values.push(max[i] + min[i]);
    }
    console.log(`Значення після обчислення: ${values.join(' ')}`);
    let maxOfValue = Math.max(...values);
    strategies.forEach(el => {
        let value = (Math.max(...el.split(' ')) * (1 - coef)) + (Math.min(...el.split(' ')) * coef);
        if (value === maxOfValue) {
            console.log(`Найкращий варіант ${el}`);
        }
    });
}

async function bayeslaplaceCriteria(probability) {
    let strategies = await getFile();
    strategies = strategies.split('\n');
    console.log('%c Баєса-Лапласа критерій: ', 'background: #000080; color: #ADD8E6');
    console.log('Формула: A11*k1 + A12*k2 + A13*k3');
    let values = [];
    strategies.forEach(el => {
        let arr = el.split(' ');
        let newVal = [];
        for (let i = 0; i < probability.length; i++) {
            newVal.push(arr[i] * probability[i]);
        }
        values.push(newVal);
    });
    values = values.map(el => el.reduce((a, c) => a + c));
    console.log(`Значення після обчислення за формулою: ${values.join(' ')}`);

    strategies.forEach(el => {
        let newVal = [];
        for (let i = 0; i < probability.length; i++) {
            newVal.push(el.split(' ')[i] * probability[i]);
        }
        let max = newVal.reduce((a, c) => a + c);
        if (max === Math.max(...values)) {
            console.log(`Найкращий варіант ${el}`);
        }
    })
}

