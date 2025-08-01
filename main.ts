class MenuItemNode {
    id: string;
    label: string;
    link: string;
    children: MenuItemNode[];
    parentElement: HTMLElement | null = null;

    constructor(label: string, link: string = '#') {
        this.id = `menu_${Math.random().toString(36).substring(2, 9)}`;
        this.label = label;
        this.link = link;
        this.children = [];
    }

    addChild(child: MenuItemNode): void {
        this.children.push(child);
    }
}

const menuRoot = new MenuItemNode('root');
const menuContainer = document.getElementById('menu-container') as HTMLUListElement;
const parentSelector = document.getElementById('parent-item') as HTMLSelectElement;
let lastHighlight: HTMLElement | null = null;

function renderMenuItem(menuItem: MenuItemNode, parentElement: HTMLElement) {
    const listItem = document.createElement('li');
    listItem.id = menuItem.id;
    menuItem.parentElement = listItem;

    const itemContent = document.createElement('div');
    itemContent.className = 'item-content';

    const link = document.createElement('a');
    link.textContent = menuItem.label;
    link.href = menuItem.link;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = `Remover "${menuItem.label}"`;
    deleteBtn.setAttribute('data-id', menuItem.id);

    itemContent.appendChild(link);
    itemContent.appendChild(deleteBtn);
    listItem.appendChild(itemContent);

    if (menuItem.children.length > 0) {
        listItem.classList.add('has-children');

        itemContent.addEventListener('click', (event) => {
            if ((event.target as HTMLElement).closest('.delete-btn')) {
                return;
            }
            if (listItem.classList.contains('has-children')) {
                event.preventDefault();
                listItem.classList.toggle('open');
            }
        });

        const sublist = document.createElement('ul');
        for (const childNode of menuItem.children) {
            renderMenuItem(childNode, sublist);
        }
        listItem.appendChild(sublist);
    }

    parentElement.appendChild(listItem);
}

function fullRender() {
    menuContainer.innerHTML = '';
    for (const topLevelItem of menuRoot.children) {
        renderMenuItem(topLevelItem, menuContainer);
    }
    updateParentSelector();
}

function updateParentSelector() {
    parentSelector.innerHTML = '<option value="root">Adicionar como item principal</option>';

    const traverse = (node: MenuItemNode, depth: number) => {
        const prefix = '—'.repeat(depth) + ' ';
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = prefix + node.label;
        parentSelector.appendChild(option);

        node.children.forEach(child => traverse(child, depth + 1));
    };

    menuRoot.children.forEach(child => traverse(child, 0));
}

function findNodeById(id: string, node: MenuItemNode = menuRoot): MenuItemNode | null {
    if (node.id === id) {
        return node;
    }
    for (const child of node.children) {
        const found = findNodeById(id, child);
        if (found) return found;
    }
    return null;
}

function handleAddItem(event: Event) {
    event.preventDefault();
    const labelInput = document.getElementById('item-label') as HTMLInputElement;
    const parentId = parentSelector.value;

    const newNode = new MenuItemNode(labelInput.value);

    const parentNode = findNodeById(parentId) || menuRoot;
    parentNode.addChild(newNode);

    fullRender();
    labelInput.value = '';
}

function handleRemoveItem(idToRemove: string) {
    const nodeToRemove = findNodeById(idToRemove);
    if (!nodeToRemove) return;

    const parentNode = findParent(nodeToRemove, menuRoot);
    if (!parentNode) {
        console.error("Não foi possível encontrar o pai do nó para remoção.");
        return;
    }
    
    const childIndex = parentNode.children.findIndex(child => child.id === idToRemove);

    if (childIndex > -1) {
        parentNode.children.splice(childIndex, 1);
        fullRender();
    }
}

function handleSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (lastHighlight) {
        lastHighlight.classList.remove('search-highlight');
        lastHighlight = null;
    }

    if (query.length < 2) return;

    const search = (node: MenuItemNode): MenuItemNode | null => {
        if (node.label.toLowerCase().includes(query)) {
            return node;
        }
        for (const child of node.children) {
            const found = search(child);
            if (found) return found;
        }
        return null;
    };

    const foundNode = search(menuRoot);
    if (foundNode && foundNode.parentElement) {
        const linkElement = foundNode.parentElement.querySelector('a');
        if (linkElement) {
            linkElement.classList.add('search-highlight');
            lastHighlight = linkElement;

            let current = findNodeById(foundNode.id);
            let parent = findParent(current, menuRoot);
            while (parent && parent.parentElement) {
                parent.parentElement.classList.add('open');
                current = parent;
                parent = findParent(current, menuRoot);
            }
        }
    }
}

function findParent(childNode: MenuItemNode | null, parentNode: MenuItemNode): MenuItemNode | null {
    if (!childNode) return null;
    for (const child of parentNode.children) {
        if (child.id === childNode.id) {
            return parentNode;
        }
        const found = findParent(childNode, child);
        if (found) return found;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const home = new MenuItemNode('Home');
    const sobre = new MenuItemNode('Sobre');
    const produtos = new MenuItemNode('Produtos');
    menuRoot.addChild(home);
    menuRoot.addChild(sobre);
    menuRoot.addChild(produtos);

    const eletronicos = new MenuItemNode('Eletrônicos');
    const livros = new MenuItemNode('Livros');
    produtos.addChild(eletronicos);
    produtos.addChild(livros);

    const celulares = new MenuItemNode('Celulares');
    const notebooks = new MenuItemNode('Notebooks');
    eletronicos.addChild(celulares);
    eletronicos.addChild(notebooks);

    fullRender();

    const addItemForm = document.getElementById('add-item-form') as HTMLFormElement;
    addItemForm.addEventListener('submit', handleAddItem);

    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput.addEventListener('keyup', handleSearch);

    const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
    menuToggle.addEventListener('click', () => {
        menuContainer.classList.toggle('active');
    });

    menuContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('delete-btn')) {
            const idToRemove = target.getAttribute('data-id');
            if (idToRemove) {
                if (confirm('Tem certeza que deseja remover este item e todos os seus sub-itens?')) {
                    handleRemoveItem(idToRemove);
                }
            }
        }
    });
});