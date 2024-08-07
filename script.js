document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', updateButtonState);
});

function updateButtonState() {
    const principal = document.getElementById('principal').value;
    const rate = document.getElementById('rate').value;
    const time = document.getElementById('time').value;

    const isFormValid = principal && rate && time;

    document.getElementById('btnSimple').disabled = !isFormValid;
    document.getElementById('btnCompound').disabled = !isFormValid;
    document.getElementById('btnDaily').disabled = !isFormValid;
    document.getElementById('btnContinuous').disabled = !isFormValid;
}

function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const time = parseFloat(document.getElementById('time').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        document.getElementById('result').innerText = "Por favor, ingresa valores válidos.";
        return;
    }

    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;

    document.getElementById('result').innerHTML = `
        <p>Interés Simple: $${interest.toFixed(2)}</p>
        <p>Monto Total: $${totalAmount.toFixed(2)}</p>
    `;
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const time = parseFloat(document.getElementById('time').value);
    const compound = parseFloat(document.getElementById('compound').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(compound)) {
        document.getElementById('result').innerText = "Por favor, ingresa valores válidos.";
        return;
    }

    const amount = principal * Math.pow((1 + rate / compound), compound * time);
    const interest = amount - principal;

    document.getElementById('result').innerHTML = `
        <p>Interés Compuesto: $${interest.toFixed(2)}</p>
        <p>Monto Total: $${amount.toFixed(2)}</p>
    `;
}
