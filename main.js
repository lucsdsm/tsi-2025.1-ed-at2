var MenuItemNode = /** @class */ (function () {
    function MenuItemNode(label, link) {
        if (link === void 0) { link = '#'; }
        this.parentElement = null;
        this.id = "menu_".concat(Math.random().toString(36).substring(2, 9));
        this.label = label;
        this.link = link;
        this.children = [];
    }
    MenuItemNode.prototype.addChild = function (child) {
        this.children.push(child);
    };
    return MenuItemNode;
}());
var menuRoot = new MenuItemNode('root');
var menuContainer = document.getElementById('menu-container');
var parentSelector = document.getElementById('parent-item');
var lastHighlight = null;
function renderMenuItem(menuItem, parentElement) {
    var listItem = document.createElement('li');
    listItem.id = menuItem.id;
    menuItem.parentElement = listItem;
    var itemContent = document.createElement('div');
    itemContent.className = 'item-content';
    var link = document.createElement('a');
    link.textContent = menuItem.label;
    link.href = menuItem.link;
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = "Remover \"".concat(menuItem.label, "\"");
    deleteBtn.setAttribute('data-id', menuItem.id);
    itemContent.appendChild(link);
    itemContent.appendChild(deleteBtn);
    listItem.appendChild(itemContent);
    if (menuItem.children.length > 0) {
        listItem.classList.add('has-children');
        itemContent.addEventListener('click', function (event) {
            if (event.target.closest('.delete-btn')) {
                return;
            }
            if (listItem.classList.contains('has-children')) {
                event.preventDefault();
                listItem.classList.toggle('open');
            }
        });
        var sublist = document.createElement('ul');
        for (var _i = 0, _a = menuItem.children; _i < _a.length; _i++) {
            var childNode = _a[_i];
            renderMenuItem(childNode, sublist);
        }
        listItem.appendChild(sublist);
    }
    parentElement.appendChild(listItem);
}
function fullRender() {
    menuContainer.innerHTML = '';
    for (var _i = 0, _a = menuRoot.children; _i < _a.length; _i++) {
        var topLevelItem = _a[_i];
        renderMenuItem(topLevelItem, menuContainer);
    }
    updateParentSelector();
}
function updateParentSelector() {
    parentSelector.innerHTML = '<option value="root">Adicionar como item principal</option>';
    var traverse = function (node, depth) {
        var prefix = '—'.repeat(depth) + ' ';
        var option = document.createElement('option');
        option.value = node.id;
        option.textContent = prefix + node.label;
        parentSelector.appendChild(option);
        node.children.forEach(function (child) { return traverse(child, depth + 1); });
    };
    menuRoot.children.forEach(function (child) { return traverse(child, 0); });
}
function findNodeById(id, node) {
    if (node === void 0) { node = menuRoot; }
    if (node.id === id) {
        return node;
    }
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var found = findNodeById(id, child);
        if (found)
            return found;
    }
    return null;
}
function handleAddItem(event) {
    event.preventDefault();
    var labelInput = document.getElementById('item-label');
    var parentId = parentSelector.value;
    var newNode = new MenuItemNode(labelInput.value);
    var parentNode = findNodeById(parentId) || menuRoot;
    parentNode.addChild(newNode);
    fullRender();
    labelInput.value = '';
}
function handleRemoveItem(idToRemove) {
    var nodeToRemove = findNodeById(idToRemove);
    if (!nodeToRemove)
        return;
    var parentNode = findParent(nodeToRemove, menuRoot);
    if (!parentNode) {
        console.error("Não foi possível encontrar o pai do nó para remoção.");
        return;
    }
    var childIndex = parentNode.children.findIndex(function (child) { return child.id === idToRemove; });
    if (childIndex > -1) {
        parentNode.children.splice(childIndex, 1);
        fullRender();
    }
}
function handleSearch(event) {
    var query = event.target.value.toLowerCase();
    if (lastHighlight) {
        lastHighlight.classList.remove('search-highlight');
        lastHighlight = null;
    }
    if (query.length < 2)
        return;
    var search = function (node) {
        if (node.label.toLowerCase().includes(query)) {
            return node;
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var found = search(child);
            if (found)
                return found;
        }
        return null;
    };
    var foundNode = search(menuRoot);
    if (foundNode && foundNode.parentElement) {
        var linkElement = foundNode.parentElement.querySelector('a');
        if (linkElement) {
            linkElement.classList.add('search-highlight');
            lastHighlight = linkElement;
            var current = findNodeById(foundNode.id);
            var parent_1 = findParent(current, menuRoot);
            while (parent_1 && parent_1.parentElement) {
                parent_1.parentElement.classList.add('open');
                current = parent_1;
                parent_1 = findParent(current, menuRoot);
            }
        }
    }
}
function findParent(childNode, parentNode) {
    if (!childNode)
        return null;
    for (var _i = 0, _a = parentNode.children; _i < _a.length; _i++) {
        var child = _a[_i];
        if (child.id === childNode.id) {
            return parentNode;
        }
        var found = findParent(childNode, child);
        if (found)
            return found;
    }
    return null;
}
document.addEventListener('DOMContentLoaded', function () {
    var home = new MenuItemNode('Home');
    var sobre = new MenuItemNode('Sobre');
    var produtos = new MenuItemNode('Produtos');
    menuRoot.addChild(home);
    menuRoot.addChild(sobre);
    menuRoot.addChild(produtos);
    var eletronicos = new MenuItemNode('Eletrônicos');
    var livros = new MenuItemNode('Livros');
    produtos.addChild(eletronicos);
    produtos.addChild(livros);
    var celulares = new MenuItemNode('Celulares');
    var notebooks = new MenuItemNode('Notebooks');
    eletronicos.addChild(celulares);
    eletronicos.addChild(notebooks);
    fullRender();
    var addItemForm = document.getElementById('add-item-form');
    addItemForm.addEventListener('submit', handleAddItem);
    var searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', handleSearch);
    var menuToggle = document.getElementById('menu-toggle');
    menuToggle.addEventListener('click', function () {
        menuContainer.classList.toggle('active');
    });
    menuContainer.addEventListener('click', function (event) {
        var target = event.target;
        if (target.classList.contains('delete-btn')) {
            var idToRemove = target.getAttribute('data-id');
            if (idToRemove) {
                if (confirm('Tem certeza que deseja remover este item e todos os seus sub-itens?')) {
                    handleRemoveItem(idToRemove);
                }
            }
        }
    });
});
