import re

# A more generic set of patterns. The keys are now regex patterns.
# The order is important: more specific patterns should come first.
GENERIC_PATTERNS = {
    # --- CI-Specific (Skip these) ---
    "CI-Specific": [
        r"\$\{\{",      # Matches ${{ github.token }} etc.
        r"sudo",         # Matches commands requiring root access
        r"actions/",     # Matches GitHub Actions like actions/checkout
        r"gh pr"         # Matches GitHub CLI for PRs
    ],
    # --- Runnable Commands ---
    "Deployment": [r"publish", r"deploy", r"release", r"aws s3 sync"],
    "Testing": [r"test", r"spec", r"coverage", r"jest", r"pytest", r"prove"],
    "Linting": [r"lint", r"format", r"check", r"style", r"black", r"eslint", r"ruff"],
    "Documentation": [r"docs", r"doc", r"mkdocs"],
    "Building": [r"build", r"compile", r"package", r"dist", r"bundle", r"webpack"],
    "Setup": [r"install", r"ci", r"bootstrap", r"pip", r"npm", r"bundle", r"mvn"]
}

def generic_classify(command):
    """Classifies a command using generic regex patterns."""
    for category, patterns in GENERIC_PATTERNS.items():
        for pattern in patterns:
            # Use regex search to find the pattern in the command
            if re.search(pattern, command):
                return category
    return "Other"

# --- Example Usage ---
commands_from_different_projects = [
    "npm run test-unit-ci",      # Node.js
    "pytest -v",                 # Python
    "go test ./...",             # Go
    "mvn package",               # Java
    "sudo apt-get install -y libpq-dev", # CI Setup
    "echo ${{ steps.vars.outputs.tag }}", # CI Variable
    "npm run lint"               # Node.js
]

for cmd in commands_from_different_projects:
    category = generic_classify(cmd)
    print(f"Command: '{cmd}'  ->  Category: {category}")