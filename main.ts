// Define a interface para um atleta
interface Atleta {
    nome: string;
    posicao: string;
    altura: number;
    idade: number;
    cidade: string;
}

// Array para armazenar os atletas
const atletas: Atleta[] = [];

// Obtém referências aos elementos do DOM
const athleteForm = document.getElementById('athleteForm') as HTMLFormElement;
const athleteTableBody = document.getElementById('athleteTableBody') as HTMLTableSectionElement; // Alterado para o tbody da tabela

// Função para renderizar a lista de atletas na tabela
function renderAthletes(): void {
    athleteTableBody.innerHTML = ''; // Limpa o corpo da tabela antes de renderizar
    atletas.forEach(atleta => {
        const tableRow = document.createElement('tr'); // Cria uma nova linha (tr)
        tableRow.innerHTML = `
            <td>${atleta.nome}</td>
            <td>${atleta.posicao}</td>
            <td>${atleta.altura}</td>
            <td>${atleta.idade}</td>
            <td>${atleta.cidade}</td>
        `;
        athleteTableBody.appendChild(tableRow); // Adiciona a linha ao corpo da tabela
    });
}

// Adiciona um listener para o evento de submit do formulário
athleteForm.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // Obtém os valores dos campos do formulário
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const positionInput = document.getElementById('position') as HTMLInputElement;
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const ageInput = document.getElementById('age') as HTMLInputElement;
    const cityInput = document.getElementById('city') as HTMLInputElement;

    const newAthlete: Atleta = {
        nome: nameInput.value,
        posicao: positionInput.value,
        altura: parseFloat(heightInput.value),
        idade: parseInt(ageInput.value),
        cidade: cityInput.value
    };

    atletas.push(newAthlete); // Adiciona o novo atleta ao array
    renderAthletes();       // Re-renderiza a tabela

    athleteForm.reset();    // Limpa o formulário
});

// Renderiza a tabela inicial (vazia) ao carregar a página
renderAthletes();