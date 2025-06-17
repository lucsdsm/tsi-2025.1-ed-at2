var atletas = [];

// Obtém referências aos elementos do DOM
var athleteForm = document.getElementById('athleteForm');
var athleteTableBody = document.getElementById('athleteTableBody');
var searchInput = document.getElementById('searchInput');

function renderAthletes(filteredAthletes) {
    var athletesToRender = filteredAthletes || atletas;

    athleteTableBody.innerHTML = ''; 

    if (athletesToRender.length === 0) {
        var noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = '<td colspan="5" style="text-align: center; color: #777;">Nenhum atleta encontrado.</td>';
        athleteTableBody.appendChild(noResultsRow);
        return;
    }

    athletesToRender.forEach(function (atleta) {
        var tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${atleta.nome}</td>
            <td>${atleta.posicao}</td>
            <td>${atleta.altura}</td>
            <td>${atleta.idade}</td>
            <td>${atleta.cidade}</td>
        `;
        athleteTableBody.appendChild(tableRow);
    });
}

function filterAthletes() {
    var searchTerm = searchInput.value.toLowerCase().trim(); 
    
    if (searchTerm === '') {
        renderAthletes(atletas);
        return;
    }

    var filtered = atletas.filter(function (atleta) {
        
        return atleta.nome.toLowerCase().includes(searchTerm) ||
               atleta.posicao.toLowerCase().includes(searchTerm) ||
               atleta.cidade.toLowerCase().includes(searchTerm) ||
               atleta.idade.toString().includes(searchTerm) ||
               atleta.altura.toString().includes(searchTerm);
    });

    renderAthletes(filtered);
}

athleteForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var nameInput = document.getElementById('nome'); 
    var positionInput = document.getElementById('posicao'); 
    var heightInput = document.getElementById('altura'); 
    var ageInput = document.getElementById('idade'); 
    var cityInput = document.getElementById('cidade');

    if (!nameInput || !positionInput || !heightInput || !ageInput || !cityInput) {
        console.error('Um ou mais campos do formulário não foram encontrados.');
        return; 
    }

    var newAthlete = {
        nome: nameInput.value,
        posicao: positionInput.value,
        altura: parseFloat(heightInput.value),
        idade: parseInt(ageInput.value),
        cidade: cityInput.value
    };

    atletas.push(newAthlete);
    renderAthletes(); 
    athleteForm.reset();
    searchInput.value = '';
});

searchInput.addEventListener('input', filterAthletes);

renderAthletes();