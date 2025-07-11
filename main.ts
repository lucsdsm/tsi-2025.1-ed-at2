// A interface Tarefa define a estrutura de uma tarefa, que inclui um ID único, uma descrição e um horário.
interface Tarefa {
    id: string;
    descricao: string;
    horario: Date;
}

// Um map para armazenar as tarefas, onde a chave é o ID da tarefa e o valor é um objeto Tarefa definido acima na interface.
let tarefas: Map<string, Tarefa> = new Map<string, Tarefa>();

const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskDescriptionInput = document.getElementById('task-description') as HTMLInputElement;
const taskDatetimeInput = document.getElementById('task-datetime') as HTMLInputElement;
const taskListDiv = document.getElementById('task-list') as HTMLDivElement;

const searchIdInput = document.getElementById('search-id') as HTMLInputElement;
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
const removeButton = document.getElementById('remove-button') as HTMLButtonElement;
const searchResultDiv = document.getElementById('search-result') as HTMLDivElement;

// Função para renderizar a lista de tarefas.
function renderizarTarefas(): void {
    taskListDiv.innerHTML = ''; // Limpa a lista de tarefas antes de renderizar novamente.

    if (tarefas.size === 0) { // Se não houver tarefas, exibe uma mensagem de estado vazio.
        taskListDiv.innerHTML = '<p class="empty-state">Nenhuma tarefa agendada ainda.</p>';
        return;
    }

    tarefas.forEach((tarefa) => { // Para cada tarefa no Map, cria um elemento HTML para exibir a tarefa.
        const taskItem = document.createElement('div'); // Cria uma nova div para a tarefa do loop.
        taskItem.className = 'task-item'; // Define a classe da div para o css.

        const dataFormatada = tarefa.horario.toLocaleString('pt-BR', { // Formata a data e hora da tarefa.
            dateStyle: 'short',
            timeStyle: 'short'
        });

        // Define o conteúdo da tarefa para o html, incluindo a descrição, horário e ID.
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
    const id = crypto.randomUUID(); // Gera um ID único para a tarefa usando a API crypto do navegador.

    const novaTarefa: Tarefa = { id, descricao, horario }; // Cria um novo objeto Tarefa com o ID, descrição e horário fornecidos.

    tarefas.set(id, novaTarefa); // Adiciona a nova tarefa ao Map de tarefas.

    console.log(`Tarefa adicionada com número único = ${id}`);
    
    renderizarTarefas(); // Renderiza a lista de tarefas atualizada.
    salvarNoLocalStorage();
}

/**
 * Busca uma tarefa pelo ID e exibe o resultado.
 * @param id O ID da tarefa a ser buscada.
 */
function buscarTarefa(id: string): void {
    if (!tarefas.has(id)) { // Verifica se o ID existe no Map de tarefas, se não existir, exibe uma mensagem de erro.
        searchResultDiv.textContent = `Nenhuma tarefa encontrada com o número único = ${id}`;
        searchResultDiv.style.color = '#b91c1c';
        return;
    }

    const tarefa = tarefas.get(id)!; // Obtém a tarefa correspondente ao ID fornecido.
    const dataFormatada = tarefa.horario.toLocaleString('pt-BR'); // Formata a data e hora da tarefa.
    
    // Exibe os detalhes da tarefa encontrada.
    searchResultDiv.innerHTML = `
        <strong>Tarefa Encontrada:</strong>
        <p>Descrição: ${tarefa.descricao}</p>
        <p>Horário: ${dataFormatada}</p>
    `;
    searchResultDiv.style.color = '#1e3a8a'; 
}

/**
 * Remove uma tarefa do Map usando seu ID.
 * @param id O ID da tarefa a ser removida.
 */
function removerTarefa(id: string): void {
    if (!tarefas.has(id)) { // Verifica se o ID existe no Map de tarefas, se não existir, exibe uma mensagem de erro.
        searchResultDiv.textContent = `Não é possível remover. Nenhuma tarefa encontrada com o ID: ${id}`;
        searchResultDiv.style.color = '#b91c1c';
        return;
    } 

    tarefas.delete(id); // Remove a tarefa do Map de tarefas.
    
    searchResultDiv.textContent = `Tarefa com número único = ${id} foi removida com sucesso!`; 
    searchResultDiv.style.color = 'green';

    searchIdInput.value = ''; // Limpa o campo de busca após a remoção.

    console.log(`Tarefa com número único = ${id} removida com sucesso.`);
    
    renderizarTarefas(); // Renderiza a lista de tarefas atualizada.
    salvarNoLocalStorage(); 
}

// Salva o Map de tarefas no LocalStorage do navegador onde o map é convertido para um array para poder ser salvo como string JSON.
function salvarNoLocalStorage(): void {
    const arrayDeTarefas = Array.from(tarefas.entries()); // Converte o map de tarefas em um array de tuplas [ID, Tarefa] para poder salvar no localstorage.
    localStorage.setItem('minhasTarefas', JSON.stringify(arrayDeTarefas)); // Salva o array de tarefas como uma string JSON no localstorage.
    console.log('Tarefas salvas no LocalStorage.');
}

// Carrega as tarefas do localstorage ao iniciar a aplicação.
function carregarDoLocalStorage(): void {
    const dadosSalvos = localStorage.getItem('minhasTarefas'); // Obtém os dados salvos do localstorage.
    if (dadosSalvos) { // Se houver dados salvos, converte a string JSON de volta para um array de tuplas [ID, Tarefa].
        const arrayDeTarefas: [string, Tarefa][] = JSON.parse(dadosSalvos); 
        
        arrayDeTarefas.forEach(item => { // Converte o horário de cada tarefa de string para um objeto date.
            item[1].horario = new Date(item[1].horario);
        });

        tarefas = new Map(arrayDeTarefas); // Cria um novo map de tarefas a partir do array de tuplas.
        console.log('Tarefas carregadas do LocalStorage.');
    }
}

// Evento de envio do formulário para adicionar tarefa
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const descricao = taskDescriptionInput.value; // Obtém a descrição da tarefa do campo de entrada.
    const horario = new Date(taskDatetimeInput.value); // Obtém o horário da tarefa do campo de entrada e converte para um objeto date.

    if (descricao && horario) {
        adicionarTarefa(descricao, horario);
        taskForm.reset();
    }
});

// Evento de clique no botão de busca
searchButton.addEventListener('click', () => {
    const id = searchIdInput.value; // Obtém o ID da tarefa a ser buscada do campo de entrada.
    if (id) { // Se o ID não estiver vazio, chama a função buscarTarefa para procurá-la.
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