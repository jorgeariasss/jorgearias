# jorgearias

Repositorio personal de Jorge Arias.

## Estructura

- `VIZZARD_MANUAL_DE_MARCA.md` — Manual de marca, tono y estilo de Vizzard (banda de Power Rock & Pop argentino).

## Como clonar este repositorio en tu PC

```bash
git clone https://github.com/jorgeariasss/jorgearias.git
cd jorgearias
```

## Como crear una nueva carpeta de repositorio local

### Opcion 1 — Crear un repo nuevo desde cero

```bash
mkdir mi-repo
cd mi-repo
git init
echo "# Mi Repo" > README.md
git add README.md
git commit -m "Primer commit"
```

### Opcion 2 — Conectar a GitHub

```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### Opcion 3 — Clonar un repo existente

```bash
git clone https://github.com/usuario/repo.git
cd repo
```

## Comandos utiles de Git

```bash
git status              # Ver estado actual
git add .               # Agregar todos los cambios
git commit -m "msg"     # Guardar cambios localmente
git push                # Subir cambios a GitHub
git pull                # Bajar cambios del remoto
git log --oneline       # Ver historial de commits
git branch              # Ver ramas
git checkout -b nueva   # Crear y cambiar a nueva rama
```
