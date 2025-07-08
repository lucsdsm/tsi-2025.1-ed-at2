interface Tarefa {
    id: string;
    descricao: string;
    horario: Date;
}

let tarefas: Map<string, Tarefa> = new Map<string, Tarefa>();

const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskDescriptionInput = document.getElementById('task-description') as HTMLInputElement;
const taskDatetimeInput = document.getElementById('task-datetime') as HTMLInputElement;
const taskListDiv = document.getElementById('task-list') as HTMLDivElement;

const searchIdInput = document.getElementById('search-id') as HTMLInputElement;
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
const removeButton = document.getElementById('remove-button') as HTMLButtonElement;
const searchResultDiv = document.getElementById('search-result') as HTMLDivElement;


function renderizarTarefas(): void {
    taskListDiv.innerHTML = '';

    if (tarefas.size === 0) {
        taskListDiv.innerHTML = '<p class="empty-state">Nenhuma tarefa agendada ainda.</p>';
        return;
    }

    tarefas.forEach((tarefa) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const dataFormatada = tarefa.horario.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        taskItem.innerHTML = `
            <strong>${tarefa.descricao}</strong>
            <p>Horário: ${dataFormatada}</p>
            <span class="task-id">${tarefa.id}</span>
        `;
        taskListDiv.appendChild(taskItem);
    });
}

/**
 * Adiciona uma nova tarefa ao Map.
 * @param descricao
 * @param horario
 */
function adicionarTarefa(descricao: string, horario: Date): void {
    const id = crypto.randomUUID();

    const novaTarefa: Tarefa = { id, descricao, horario };

    tarefas.set(id, novaTarefa);

    console.log(`Tarefa adicionada com número único = ${id}`);
    
    renderizarTarefas();
    salvarNoLocalStorage();
}

/**
 * Busca uma tarefa pelo ID e exibe o resultado.
 * @param id O ID da tarefa a ser buscada.
 */
function buscarTarefa(id: string): void {
    if (!tarefas.has(id)) {
        searchResultDiv.textContent = `Nenhuma tarefa encontrada com o número único = ${id}`;
        searchResultDiv.style.color = '#b91c1c';
        return;
    }

    const tarefa = tarefas.get(id)!;
    const dataFormatada = tarefa.horario.toLocaleString('pt-BR');
    
    searchResultDiv.innerHTML = `
        <strong>Tarefa Encontrada:</strong>
        <p>Descrição: ${tarefa.descricao}</p>
        <p>Horário: ${dataFormatada}</p>
    `;
    searchResultDiv.style.color = '#1e3a8a'; // Azul
}

/**
 * Remove uma tarefa do Map usando seu ID.
 * @param id O ID da tarefa a ser removida.
 */
function removerTarefa(id: string): void {
    if (!tarefas.has(id)) {
        searchResultDiv.textContent = `Não é possível remover. Nenhuma tarefa encontrada com o ID: ${id}`;
        searchResultDiv.style.color = '#b91c1c';
        return;
    }

    tarefas.delete(id);
    
    searchResultDiv.textContent = `Tarefa com número único = ${id} foi removida com sucesso!`;
    searchResultDiv.style.color = 'green';

    searchIdInput.value = '';

    console.log(`Tarefa com número único = ${id} removida com sucesso.`);
    
    renderizarTarefas();
    salvarNoLocalStorage();
}

/**
 * Salva o Map de tarefas no LocalStorage do navegador.
 * O Map é convertido para um Array para poder ser salvo como string JSON.
 */
function salvarNoLocalStorage(): void {
    const arrayDeTarefas = Array.from(tarefas.entries());
    localStorage.setItem('minhasTarefas', JSON.stringify(arrayDeTarefas));
    console.log('Tarefas salvas no LocalStorage.');
}

/**
 * Carrega as tarefas do LocalStorage ao iniciar a aplicação.
 */
function carregarDoLocalStorage(): void {
    const dadosSalvos = localStorage.getItem('minhasTarefas');
    if (dadosSalvos) {
        const arrayDeTarefas: [string, Tarefa][] = JSON.parse(dadosSalvos);
        
        arrayDeTarefas.forEach(item => {
            item[1].horario = new Date(item[1].horario);
        });

        tarefas = new Map(arrayDeTarefas);
        console.log('Tarefas carregadas do LocalStorage.');
    }
}

// Evento de envio do formulário para adicionar tarefa
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const descricao = taskDescriptionInput.value;
    const horario = new Date(taskDatetimeInput.value);

    if (descricao && horario) {
        adicionarTarefa(descricao, horario);
        taskForm.reset();
    }
});

// Evento de clique no botão de busca
searchButton.addEventListener('click', () => {
    const id = searchIdInput.value;
    if (id) {
        buscarTarefa(id);
    }
});

// Evento de clique no botão de remoção
removeButton.addEventListener('click', () => {
    const id = searchIdInput.value;
    if (id) {
        removerTarefa(id);
    }
});
-
// Quando a página carrega, tentamos carregar os dados salvos e renderizamos a lista.
document.addEventListener('DOMContentLoaded', () => {
    carregarDoLocalStorage();
    renderizarTarefas();
});