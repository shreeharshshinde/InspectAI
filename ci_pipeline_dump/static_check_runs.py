import yaml, glob

def extract_ci_commands():
    all_cmds = []
    for file in glob.glob("./ci_pipeline_dump/.github/workflows/*.yml"):
        with open(file, "r") as f:
            data = yaml.safe_load(f)
            for job in data.get("jobs", {}).values():
                for step in job.get("steps", []):
                    if "run" in step:
                        all_cmds.append(step["run"])
    return all_cmds

if __name__ == "__main__":
    cmds = extract_ci_commands()
    print("🚀 CI Commands extracted from workflows:\n")
    for cmd in cmds:
        print("  " + cmd)
