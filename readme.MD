# Projeto 5 – Menu Hierárquico de Navegação para Sites

Este projeto consiste na criação de um componente de menu de navegação hierárquico e interativo.

---

### ✨ Funcionalidades

* **Criação de Itens:** Adicione novas páginas e subpáginas ao menu através de um formulário simples.
* **Hierarquia Ilimitada:** Crie quantos níveis de submenus forem necessários.
* **Visualização Clara:** A estrutura de árvore é representada visualmente com indentação.
* **Expansão e Colapso:** Menus com sub-itens podem ser expandidos ou recolhidos com um clique.
* **Busca Inteligente:** Encontre qualquer página pelo nome. O resultado é destacado e a árvore se expande automaticamente para revelar sua localização.
* **Design Responsivo:** Em telas menores, o menu se transforma em um "menu hamburger" para garantir a usabilidade em dispositivos móveis.

---

### 🚀 Tecnologias Utilizadas

* **HTML5:** Para a estrutura semântica da página.
* **CSS3:** Para estilização, layout (Grid), animações e responsividade.
* **TypeScript:** Para toda a lógica de manipulação da árvore de dados e interatividade do DOM.

---

### ⚙️ Como Executar o Projeto

**Pré-requisito:** Você precisa de um compilador de TypeScript instalado (`tsc`)

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/lucsdsm/tsi-2025.1-ed-at2.git]
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```
3.  **Compile o arquivo TypeScript:**
    Execute o comando abaixo no terminal para compilar o arquivo `main.ts` para `main.js`. O HTML já está linkado para `main.js`.
    ```bash
    tsc main.ts
    ```
    *Para desenvolvimento contínuo, use `tsc main.ts -w` para que o arquivo seja recompilado a cada salvamento.*

4.  **Abra o `index.html`:**
    Abra o arquivo `index.html` diretamente no seu navegador de preferência.

---

### 📂 Estrutura do Projeto

* `index.html`: Contém a estrutura da página, incluindo o formulário de controles e a área onde o menu é renderizado.
* `style.css`: Responsável por toda a parte visual, layout, responsividade e estilos dos estados do menu (aberto, fechado, destacado).
* `main.ts`: O cérebro do projeto. Contém a classe `MenuItemNode` que modela os dados, todas as funções para renderizar, adicionar, buscar e manipular os itens do menu, e os `event listeners` que conectam a lógica à interface.
* `main.js` (gerado): O arquivo JavaScript resultante da compilação do `main.ts`, que é o que o navegador efetivamente executa.