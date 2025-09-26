import os
import json
from dotenv import load_dotenv
from github import Github, Auth, GithubException

load_dotenv()

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
TARGET_REPO = 'maplibre/maplibre-gl-js'
OUTPUT_FILE = 'maplibre_reviews.jsonl'
PRS_TO_FETCH = 50

if not GITHUB_TOKEN:
    raise ValueError("GitHub token not found.")

try:
    auth = Auth.Token(GITHUB_TOKEN)
    g = Github(auth=auth)
    user = g.get_user()
    print(f"✅ Successfully authenticated as: {user.login}")

    repo = g.get_repo(TARGET_REPO)
    print(f"Target repository: {repo.full_name}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        print(f" Starting to fetch review comments from the last {PRS_TO_FETCH} merged PRs...")
        
        pull_requests = repo.get_pulls(state='closed', sort='updated', direction='desc')
        
        processed_prs = 0
        for pr in pull_requests:
            if processed_prs >= PRS_TO_FETCH:
                break

            # We only care about PRs that were actually merged
            if not pr.merged:
                continue

            print(f"  -> Processing PR #{pr.number}: {pr.title}")
            
            review_comments = pr.get_review_comments()
            
            for comment in review_comments:
                data = {
                    'repo': repo.full_name,
                    'pr_number': pr.number,
                    'comment_id': comment.id,
                    'commenter_login': comment.user.login,
                    'comment_body': comment.body,
                    'file_path': comment.path,
                    'diff_hunk': comment.diff_hunk,
                    'created_at': comment.created_at.isoformat()
                }
                
                f.write(json.dumps(data) + '\n')
            
            processed_prs += 1

    print(f"\n Success! Data has been collected and saved to {OUTPUT_FILE}")

except GithubException as e:
    print(f"❌ An error occurred with the GitHub API. Error: {e.status} - {e.data}")
    
except Exception as e:
    print(f"❌ An unexpected error occurred: {str(e)}")