import os
import json
from dotenv import load_dotenv
from github import Github, Auth, GithubException

load_dotenv()

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
TARGET_REPO = 'maplibre/maplibre-gl-js'
OUTPUT_FILE = 'maplibre_reviews_cleaned.jsonl'
PRS_TO_FETCH = 1000

if not GITHUB_TOKEN:
    raise ValueError("GitHub token not found.")

# Utility: classify diff type
def classify_diff(diff_hunk: str) -> str:
    added = any(line.startswith('+') and not line.startswith('+++') for line in diff_hunk.splitlines())
    removed = any(line.startswith('-') and not line.startswith('---') for line in diff_hunk.splitlines())
    
    if added and removed:
        return "replaced"
    elif added:
        return "added"
    elif removed:
        return "removed"
    else:
        return "context"

# Utility: check if comment is meaningful
def is_trivial_comment(comment: str) -> bool:
    trivial_keywords = ["lgtm", "thanks", "good work", "nice", "approved"]
    return len(comment.strip()) < 15 or any(word in comment.lower() for word in trivial_keywords)

# Utility: check if file is code
def is_code_file(path: str) -> bool:
    non_code_ext = (".md", ".txt", ".rst", ".json", ".yml", ".yaml")
    return not path.endswith(non_code_ext) and "docs/" not in path.lower()

try:
    auth = Auth.Token(GITHUB_TOKEN)
    g = Github(auth=auth)
    user = g.get_user()
    print(f"✅ Successfully authenticated as: {user.login}")

    repo = g.get_repo(TARGET_REPO)
    print(f"Target repository: {repo.full_name}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        print(f"📥 Fetching review comments from the last {PRS_TO_FETCH} merged PRs...")
        
        pull_requests = repo.get_pulls(state='closed', sort='updated', direction='desc')
        
        processed_prs = 0
        for pr in pull_requests:
            if processed_prs >= PRS_TO_FETCH:
                break

            if not pr.merged:  # only merged PRs
                continue

            print(f"  🔍 Processing PR #{pr.number}: {pr.title}")
            
            review_comments = pr.get_review_comments()
            
            for comment in review_comments:
                if is_trivial_comment(comment.body):
                    continue
                if not is_code_file(comment.path):
                    continue

                diff_type = classify_diff(comment.diff_hunk)

                data = {
                    'repo': repo.full_name,
                    'pr_number': pr.number,
                    'file_path': comment.path,
                    'change_type': diff_type,
                    'diff': comment.diff_hunk.strip(),
                    'comment': comment.body.strip(),
                    'commenter': comment.user.login,
                    'created_at': comment.created_at.isoformat()
                }
                
                f.write(json.dumps(data) + '\n')
            
            processed_prs += 1

    print(f"\n✅ Success! Cleaned data has been saved to {OUTPUT_FILE}")

except GithubException as e:
    print(f"❌ GitHub API error: {e.status} - {e.data}")
except Exception as e:
    print(f"❌ Unexpected error: {str(e)}")
