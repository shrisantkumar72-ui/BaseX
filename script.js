const binaryInput = document.getElementById("binary");
const decimalInput = document.getElementById("decimal");
const octalInput = document.getElementById("octal");
const hexInput = document.getElementById("hexadecimal");

const convertBtn = document.getElementById("convertBtn");
const clearBtn = document.getElementById("clearBtn");
const message = document.getElementById("message");

const inputs = {
    binary: binaryInput,
    decimal: decimalInput,
    octal: octalInput,
    hexadecimal: hexInput
};

const bases = {
    binary: 2,
    decimal: 10,
    octal: 8,
    hexadecimal: 16
};


/* ---------- Validation ---------- */

function isValidNumber(value, base) {
    if (value === "") return false;

    let pattern;

    switch (base) {
        case 2:
            pattern = /^[01]+$/;
            break;

        case 8:
            pattern = /^[0-7]+$/;
            break;

        case 10:
            pattern = /^[0-9]+$/;
            break;

        case 16:
            pattern = /^[0-9a-fA-F]+$/;
            break;

        default:
            return false;
    }

    return pattern.test(value);
}


/* ---------- Convert to Decimal ---------- */

function toDecimal(value, base) {
    return BigInt(parseInt(value, base));
}


/* ---------- Convert Decimal to Any Base ---------- */

function fromDecimal(value, base) {
    return value.toString(base).toUpperCase();
}


/* ---------- Clear Errors ---------- */

function clearErrors() {
    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });
}


/* ---------- Show Error ---------- */

function showError(type, text) {
    const errorElement = document.getElementById(`${type}-error`);

    if (errorElement) {
        errorElement.textContent = text;
    }
}


/* ---------- Find Entered Number ---------- */

function getEnteredNumber() {

    for (const type of Object.keys(inputs)) {

        const value = inputs[type].value.trim();

        if (value !== "") {
            return {
                type: type,
                value: value,
                base: bases[type]
            };
        }
    }

    return null;
}


/* ---------- Main Conversion ---------- */

function convertNumber() {

    clearErrors();
    message.textContent = "";

    const entered = getEnteredNumber();

    if (!entered) {
        message.textContent = "Please enter a number first.";
        return;
    }

    const { type, value, base } = entered;

    if (!isValidNumber(value, base)) {

        showError(
            type,
            `Invalid ${type} number for Base ${base}.`
        );

        message.textContent = "Please enter a valid number.";
        return;
    }

    let decimalValue;

    try {

        /*
         * Convert the entered value into decimal.
         * BigInt is used so very large integers
         * can be handled without floating-point errors.
         */

        decimalValue = BigInt(
            parseInt(value, base)
        );

    } catch (error) {

        showError(type, "Invalid number.");
        message.textContent = "Conversion failed.";
        return;
    }


    /* ---------- Generate All Results ---------- */

    binaryInput.value =
        fromDecimal(decimalValue, 2);

    decimalInput.value =
        fromDecimal(decimalValue, 10);

    octalInput.value =
        fromDecimal(decimalValue, 8);

    hexInput.value =
        fromDecimal(decimalValue, 16);


    message.textContent =
        "Conversion completed successfully.";
}


/* ---------- Clear Everything ---------- */

function clearAll() {

    binaryInput.value = "";
    decimalInput.value = "";
    octalInput.value = "";
    hexInput.value = "";

    clearErrors();

    message.textContent = "";
}


/* ---------- Button Events ---------- */

convertBtn.addEventListener("click", convertNumber);

clearBtn.addEventListener("click", clearAll);


/* ---------- Enter Key ---------- */

Object.values(inputs).forEach(input => {

    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            convertNumber();
        }

    });

});
