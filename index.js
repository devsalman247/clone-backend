#!/usr/bin/env node

const { program } = require("commander");
const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

async function main() {
	const { Octokit } = await import("octokit");

	program
		.version("1.0.0")
		.description("Clone or download GitHub repositories using clone-md-backend")
		.argument("<repo>", "Repository in the format owner/repo")
		.option("-b, --branch <branch>", "Specify a branch to clone", "main")
		.option("-d, --directory <directory>", "Specify the directory to clone into", ".")
		.option("--download", "Download as zip instead of cloning")
		.option("-t, --token <token>", "GitHub personal access token for private repos")
		.option("--no-git", "Download repository contents without .git folder")
		.action(async (repo, options) => {
			const [owner, repoName] = repo.split("/");

			const octokit = new Octokit({
				auth: options.token,
			});

			if (options.download) {
				try {
					const { data } = await octokit.rest.repos.downloadZipballArchive({
						owner,
						repo: repoName,
						ref: options.branch,
					});

					const zipPath = path.join(options.directory, `${repoName}.zip`);
					await fs.writeFile(zipPath, Buffer.from(data));
					console.log(`Repository downloaded as ${zipPath}`);
				} catch (error) {
					console.error("Error downloading repository:", error.message);
				}
			} else {
				const git = simpleGit();
				let cloneUrl = `https://github.com/${owner}/${repoName}.git`;

				if (options.token) {
					cloneUrl = `https://${options.token}@github.com/${owner}/${repoName}.git`;
				}

				const clonePath = path.join(options.directory, repoName);

				try {
					if (options.git) {
						await git.clone(cloneUrl, clonePath, ["--branch", options.branch]);
						console.log(`Repository cloned to ${clonePath}`);
					} else {
						// Create a temporary directory
						const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "repo-"));

						// Clone into the temporary directory
						await git.clone(cloneUrl, tempDir, ["--branch", options.branch]);

						// Copy contents to the final destination, excluding .git
						await fs.copy(tempDir, clonePath, {
							filter: (src) => !src.includes(".git"),
						});

						// Remove the temporary directory
						await fs.remove(tempDir);

						console.log(`Repository contents downloaded to ${clonePath} (without .git folder)`);
					}
				} catch (error) {
					console.error("Error cloning repository:", error.message);
				}
			}
		});

	await program.parseAsync(process.argv);
}

main().catch((error) => {
	console.error("An error occurred:", error);
	process.exit(1);
});
