const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighboorhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

const fadeElement = document.querySelector("#fade")

// Validate CEP input
cepInput.addEventListener("keypress", (e) => {
    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    //# allow only numbers 
    //# Permitir apenas números
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

//# Get address event 
//# keyup -> quando soltar a tecla
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value

    //# Check if we have the correct length 
    //# Verificar a quantidade de números necessária [8 números]
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});

//# Get customer address from API
const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `http://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    console.log(data);

    //# Show error and reset form 
    //# Mostrar erro ao colocar o cep errado
    if (data.erro === "true") {
        // validando se foi alterado o CEP
        if (!addressInput.hasAttribute("disabled")) {
            toggleDisabled();
        }

        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido, tente novamente.");
        return;
    }

    if (addressInput.value === "") {
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighboorhoodInput.value = data.bairro;
    regionInput.value = data.uf;

    toggleLoader();
};

// Add or remove disabled attribute
const toggleDisabled = () => {
    if (regionInput.hasAttribute("disabled")) {
        formInputs.forEach((input) => {
            input.removeAttribute("disabled")
        })
    } else {
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled")
        });
    }
}

//# Show or hide loader
//# Mostrar ou ocultar o carregamento
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader")

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
}


//# Show or hide message
//# Mostrar ou ocultar mensage
const toggleMessage = (msg) => {
    const fadeElement = document.querySelector("#fade");
    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;

    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
}

//# Close message modal
//# Fechando o modal da mensagem
closeButton.addEventListener("click", () => toggleMessage());

//# Save address
addressForm.addEventListener("submit", (e) => {

    e.preventDefault()

    toggleLoader()

    setTimeout(() => {

        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!");

        addressForm.reset();

        toggleDisabled();

    }, 1500)
})