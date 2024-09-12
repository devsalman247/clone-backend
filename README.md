# clone-md-backend

This is a command-line tool for cloning or downloading GitHub repositories.

## Installation

```bash
npm install -g clone-md-backend
```

## Usage

```bash
clone-md-backend <owner/repo> [options]
```

Options:

- `-b, --branch <branch>`: Specify a branch to clone (default: 'main')
- `-d, --directory <directory>`: Specify the directory to clone into (default: current directory)
- `--download`: Download as zip instead of cloning
- `-t, --token <token>`: GitHub personal access token for private repos
- `--no-git`: Download repository contents without .git folder

## Examples

Clone a repository:

```bash
clone-md-backend Metadots/backend-structure -b test -d ./my-backend-structure -t YOUR_GITHUB_TOKEN
```

Download repository contents without .git folder:

```bash
clone-md-backend Metadots/backend-structure -b test -d ./my-backend-structure -t YOUR_GITHUB_TOKEN --no-git
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
