---
title: Hiraku Setup Manager
summary: Todo o meu setup em um só app: instala Vim, Neovim, terminal e tmux e depois vira o painel para configurar tudo.
category: setup
repo: HirakuSetupManager
logo: hsm-logo.svg
featured: true
highlight: true
order: 0
stack: Rust, Tauri, Vim Script, Lua, tmux
releases: true
package: hiraku-setup-manager
dnf_repo: https://icaroplira.github.io/HirakuSetupManager/rpm/hiraku.repo
---
## Sobre

Um app desktop que instala as minhas configurações do Vim, Neovim, terminal (kitty) e tmux, junto com os utilitários de terminal que eu uso, e depois continua como o lugar onde eu mudo tudo isso.
Funciona nos mais diversos computadores, mantendo a consistência do workflow, inclusive numa máquina em que o seu usuário não tem sudo: aí tudo vai para a sua pasta pessoal.

## O que dá para fazer nele

- **Instalar** tudo num assistente: escolhe os programas, a paleta e a transparência do terminal.
- **Personalizar** cada programa numa página própria: tema, atalhos, o que o `dd` faz (copia ou não), plugins, cores e barra do tmux. Muda na hora, até com o editor aberto.
- **Descobrir** plugins e programas novos para cada um (sessões do tmux, pular pela tela no Neovim, lazygit, fd...) e ligar com um clique.
- **Atualizar** sozinho: os programas, as configurações e o próprio app.

## Pelo terminal

O mesmo programa responde como `hiraku` no terminal: `hiraku` abre a versão em modo texto, `hiraku sync` instala e atualiza, `hiraku set tmux prefix=C-b` muda uma opção.
