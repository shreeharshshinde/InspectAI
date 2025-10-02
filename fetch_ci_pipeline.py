"""
fetch_ci_pipeline.py
---------------------
Fetches all CI/CD pipeline definitions and static analysis configs from a repo
so developers can replicate the same checks locally.

What it fetches:
- GitHub Actions workflows (.github/workflows/*.yml)
- Other CI configs (.gitlab-ci.yml, .circleci/config.yml, azure-pipelines.yml, Jenkinsfile)
- Helper build/test configs (Makefile, tox.ini, pyproject.toml, package.json, requirements.txt)

Usage:
    python fetch_ci_pipeline.py <owner/repo>
"""

import os
import sys
from dotenv import load_dotenv
from github import Github, Auth, GithubException

load_dotenv()
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

if not GITHUB_TOKEN:
    raise ValueError("❌ GitHub token not found. Please add it to .env file.")

OUTPUT_DIR = "ci_pipeline_dump"

# Common CI/CD related files
CI_FILES = [
    # CI configs
    ".gitlab-ci.yml", ".circleci/config.yml", "azure-pipelines.yml", "Jenkinsfile",

    # Python
    "tox.ini", "pyproject.toml", "requirements.txt", "setup.cfg",

    # Node.js
    "package.json", "yarn.lock", "pnpm-lock.yaml",

    # General
    "Makefile", "Dockerfile", "docker-compose.yml"
]

def save_file(repo, file_path):
    """Save a file from repo to local disk if it exists."""
    try:
        content = repo.get_contents(file_path)
        data = content.decoded_content.decode("utf-8")
        os.makedirs(os.path.join(OUTPUT_DIR, os.path.dirname(file_path)), exist_ok=True)
        with open(os.path.join(OUTPUT_DIR, file_path), "w", encoding="utf-8") as f:
            f.write(data)
        print(f"✅ Saved {file_path}")
    except Exception:
        pass  # file not found, skip


def fetch_github_actions(repo):
    """Fetch all GitHub Actions workflows (.yml)."""
    try:
        contents = repo.get_contents(".github/workflows")
        for file in contents:
            if file.name.endswith(".yml") or file.name.endswith(".yaml"):
                data = repo.get_contents(file.path).decoded_content.decode("utf-8")
                save_path = os.path.join(OUTPUT_DIR, file.path)
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, "w", encoding="utf-8") as f:
                    f.write(data)
                print(f"✅ Saved {file.path}")
    except Exception:
        print("⚠️ No GitHub Actions workflows found.")


def main():
    if len(sys.argv) < 2:
        print("Usage: python fetch_ci_pipeline.py <owner/repo>")
        sys.exit(1)

    target_repo = sys.argv[1]

    try:
        auth = Auth.Token(GITHUB_TOKEN)
        g = Github(auth=auth)
        user = g.get_user()
        print(f"🔐 Authenticated as {user.login}")

        repo = g.get_repo(target_repo)
        print(f"📦 Target repository: {repo.full_name}")

        # Fetch GitHub Actions
        fetch_github_actions(repo)

        # Fetch other CI files
        for file in CI_FILES:
            save_file(repo, file)

        print(f"\n🎉 All CI/CD configs saved under {OUTPUT_DIR}")
        print("👉 You can now inspect these to replicate pipeline locally.")

    except GithubException as e:
        print(f"❌ GitHub API error: {e.status} - {e.data}")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")


if __name__ == "__main__":
    main()
