class MenuItemNode {
  id: string;
  label: string;          
  link: string;           
  children: MenuItemNode[];

  constructor(label: string, link: string = '#') {
    this.id = `menu_${Math.random().toString(36).substr(2, 9)}`;
    this.label = label;
    this.link = link;
    this.children = [];
  }

  addChild(child: MenuItemNode): void {
    this.children.push(child);
  }
}

function renderMenuItem(menuItem: MenuItemNode, parentElement: HTMLUListElement) {
  const listItem = document.createElement('li');
  const link = document.createElement('a');
  link.textContent = menuItem.label;
  link.href = menuItem.link;
  
  listItem.appendChild(link);

  if (menuItem.children.length > 0) {
   
    const sublist = document.createElement('ul');

    for (const childNode of menuItem.children) {
      renderMenuItem(childNode, sublist);
    }

    listItem.appendChild(sublist);
  }

  parentElement.appendChild(listItem);
}

document.addEventListener('DOMContentLoaded', () => {
  const menuRoot = new MenuItemNode('root');

  const home = new MenuItemNode('Home', '/home.html');
  const sobre = new MenuItemNode('Sobre', '/sobre.html');
  const produtos = new MenuItemNode('Produtos', '#');

  menuRoot.addChild(home);
  menuRoot.addChild(sobre);
  menuRoot.addChild(produtos);

  const eletronicos = new MenuItemNode('Eletrônicos', '/produtos/eletronicos.html');
  const livros = new MenuItemNode('Livros', '/produtos/livros.html');
  
  produtos.addChild(eletronicos);
  produtos.addChild(livros);

  const celulares = new MenuItemNode('Celulares', '/produtos/eletronicos/celulares.html');
  const notebooks = new MenuItemNode('Notebooks', '/produtos/eletronicos/notebooks.html');

  eletronicos.addChild(celulares);
  eletronicos.addChild(notebooks);

  const lenovo = new MenuItemNode('Lenovo', '/produtos/eletronicos/notebooks/lenovo.html');
  const dell = new MenuItemNode('Dell', '/produtos/eletronicos/notebooks/dell.html');

  notebooks.addChild(lenovo);
  notebooks.addChild(dell);
  
  const menuContainer = document.getElementById('menu-container');

  if (menuContainer) {
    for (const topLevelItem of menuRoot.children) {
      renderMenuItem(topLevelItem, menuContainer as HTMLUListElement);
    }
  }
});