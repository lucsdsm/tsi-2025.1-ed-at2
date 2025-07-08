var tarefas = new Map();
var taskForm = document.getElementById('task-form');
var taskDescriptionInput = document.getElementById('task-description');
var taskDatetimeInput = document.getElementById('task-datetime');
var taskListDiv = document.getElementById('task-list');
var searchIdInput = document.getElementById('search-id');
var searchButton = document.getElementById('search-button');
var removeButton = document.getElementById('remove-button');
var searchResultDiv = document.getElementById('search-result');
function renderizarTarefas() {
    taskListDiv.innerHTML = '';
    if (tarefas.size === 0) {
        taskListDiv.innerHTML = '<p class="empty-state">Nenhuma tarefa agendada ainda.</p>';
        return;
    }
    tarefas.forEach(function (tarefa) {
        var taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        var dataFormatada = tarefa.horario.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        taskItem.innerHTML = "\n            <strong>".concat(tarefa.descricao, "</strong>\n            <p>Hor\u00E1rio: ").concat(dataFormatada, "</p>\n            <span class=\"task-id\">").concat(tarefa.id, "</span>\n        ");
        taskListDiv.appendChild(taskItem);
    });
}
/**
 * Adiciona uma nova tarefa ao Map.
 * @param descricao
 * @param horario
 */
function adicionarTarefa(descricao, horario) {
    var id = crypto.randomUUID();
    var novaTarefa = { id: id, descricao: descricao, horario: horario };
    tarefas.set(id, novaTarefa);
    console.log("Tarefa adicionada com n\u00FAmero \u00FAnico = ".concat(id));
    renderizarTarefas();
    salvarNoLocalStorage();
}
/**
 * Busca uma tarefa pelo ID e exibe o resultado.
 * @param id O ID da tarefa a ser buscada.
 */
function buscarTarefa(id) {
    if (!tarefas.has(id)) {
        searchResultDiv.textContent = "Nenhuma tarefa encontrada com o n\u00FAmero \u00FAnico = ".concat(id);
        searchResultDiv.style.color = '#b91c1c';
        return;
    }
    var tarefa = tarefas.get(id);
    var dataFormatada = tarefa.horario.toLocaleString('pt-BR');
    searchResultDiv.innerHTML = "\n        <strong>Tarefa Encontrada:</strong>\n        <p>Descri\u00E7\u00E3o: ".concat(tarefa.descricao, "</p>\n        <p>Hor\u00E1rio: ").concat(dataFormatada, "</p>\n    ");
    searchResultDiv.style.color = '#1e3a8a'; // Azul
}
/**
 * Remove uma tarefa do Map usando seu ID.
 * @param id O ID da tarefa a ser removida.
 */
function removerTarefa(id) {
    if (!tarefas.has(id)) {
        searchResultDiv.textContent = "N\u00E3o \u00E9 poss\u00EDvel remover. Nenhuma tarefa encontrada com o ID: ".concat(id);
        searchResultDiv.style.color = '#b91c1c';
        return;
    }
    tarefas.delete(id);
    searchResultDiv.textContent = "Tarefa com n\u00FAmero \u00FAnico = ".concat(id, " foi removida com sucesso!");
    searchResultDiv.style.color = 'green';
    searchIdInput.value = '';
    console.log("Tarefa com n\u00FAmero \u00FAnico = ".concat(id, " removida com sucesso."));
    renderizarTarefas();
    salvarNoLocalStorage();
}
/**
 * Salva o Map de tarefas no LocalStorage do navegador.
 * O Map é convertido para um Array para poder ser salvo como string JSON.
 */
function salvarNoLocalStorage() {
    var arrayDeTarefas = Array.from(tarefas.entries());
    localStorage.setItem('minhasTarefas', JSON.stringify(arrayDeTarefas));
    console.log('Tarefas salvas no LocalStorage.');
}
/**
 * Carrega as tarefas do LocalStorage ao iniciar a aplicação.
 */
function carregarDoLocalStorage() {
    var dadosSalvos = localStorage.getItem('minhasTarefas');
    if (dadosSalvos) {
        var arrayDeTarefas = JSON.parse(dadosSalvos);
        arrayDeTarefas.forEach(function (item) {
            item[1].horario = new Date(item[1].horario);
        });
        tarefas = new Map(arrayDeTarefas);
        console.log('Tarefas carregadas do LocalStorage.');
    }
}
// Evento de envio do formulário para adicionar tarefa
taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var descricao = taskDescriptionInput.value;
    var horario = new Date(taskDatetimeInput.value);
    if (descricao && horario) {
        adicionarTarefa(descricao, horario);
        taskForm.reset();
    }
});
// Evento de clique no botão de busca
searchButton.addEventListener('click', function () {
    var id = searchIdInput.value;
    if (id) {
        buscarTarefa(id);
    }
});
// Evento de clique no botão de remoção
removeButton.addEventListener('click', function () {
    var id = searchIdInput.value;
    if (id) {
        removerTarefa(id);
    }
});
-
// Quando a página carrega, tentamos carregar os dados salvos e renderizamos a lista.
document.addEventListener('DOMContentLoaded', function () {
    carregarDoLocalStorage();
    renderizarTarefas();
});
