var MenuItemNode = /** @class */ (function () {
    function MenuItemNode(label, link) {
        if (link === void 0) { link = '#'; }
        this.id = "menu_".concat(Math.random().toString(36).substr(2, 9));
        this.label = label;
        this.link = link;
        this.children = [];
    }
    MenuItemNode.prototype.addChild = function (child) {
        this.children.push(child);
    };
    return MenuItemNode;
}());
function renderMenuItem(menuItem, parentElement) {
    var listItem = document.createElement('li');
    var link = document.createElement('a');
    link.textContent = menuItem.label;
    link.href = menuItem.link;
    listItem.appendChild(link);
    if (menuItem.children.length > 0) {
        var sublist = document.createElement('ul');
        for (var _i = 0, _a = menuItem.children; _i < _a.length; _i++) {
            var childNode = _a[_i];
            renderMenuItem(childNode, sublist);
        }
        listItem.appendChild(sublist);
    }
    parentElement.appendChild(listItem);
}
document.addEventListener('DOMContentLoaded', function () {
    var menuRoot = new MenuItemNode('root');
    var home = new MenuItemNode('Home', '/home.html');
    var sobre = new MenuItemNode('Sobre', '/sobre.html');
    var produtos = new MenuItemNode('Produtos', '#');
    menuRoot.addChild(home);
    menuRoot.addChild(sobre);
    menuRoot.addChild(produtos);
    var eletronicos = new MenuItemNode('Eletrônicos', '/produtos/eletronicos.html');
    var livros = new MenuItemNode('Livros', '/produtos/livros.html');
    produtos.addChild(eletronicos);
    produtos.addChild(livros);
    var celulares = new MenuItemNode('Celulares', '/produtos/eletronicos/celulares.html');
    var notebooks = new MenuItemNode('Notebooks', '/produtos/eletronicos/notebooks.html');
    eletronicos.addChild(celulares);
    eletronicos.addChild(notebooks);
    var lenovo = new MenuItemNode('Lenovo', '/produtos/eletronicos/notebooks/lenovo.html');
    var dell = new MenuItemNode('Dell', '/produtos/eletronicos/notebooks/dell.html');
    notebooks.addChild(lenovo);
    notebooks.addChild(dell);
    var menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        for (var _i = 0, _a = menuRoot.children; _i < _a.length; _i++) {
            var topLevelItem = _a[_i];
            renderMenuItem(topLevelItem, menuContainer);
        }
    }
});
