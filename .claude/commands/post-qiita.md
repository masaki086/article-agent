# Post to Qiita Command

**Date:** 2025-01-03 | **Version:** 1.0

This command uploads a series of articles to Qiita and automatically adds navigation links between them.

## Usage

- `/post-qiita` - Interactive mode: shows series list and prompts for selection
- `/post-qiita <seriesName>` - Direct mode: uploads specified series immediately
- `/post-qiita <seriesName> --skip` - Skip already uploaded articles (default)
- `/post-qiita <seriesName> --update` - Update existing articles
- `/post-qiita <seriesName> --force` - Create duplicates (not recommended)

## Process Flow

1. **Series Selection**: Choose which series to upload
2. **Pre-upload Check**: Verify API token and article files
3. **Batch Upload**: Upload all articles with progress tracking
4. **Link Generation**: Automatically add series navigation links
5. **Summary Report**: Display upload results and URLs

## Features

- Interactive series selection
- Real-time progress updates
- Automatic error recovery
- Series link management
- Detailed logging

## Requirements

- Qiita API token configured in `/.claude/config/qiita-token.json`
- Articles in standard directory structure
- Node.js environment available

## Error Handling

- Token validation before upload
- Rate limit management
- Retry logic for failures
- Partial upload recovery

---

## Implementation

```python
import os
import json
import subprocess
from pathlib import Path
import re
import sys

# Check if series name was provided as argument
series_arg = sys.argv[1] if len(sys.argv) > 1 else None

def load_series_list():
    """Load available series from articles directory"""
    articles_dir = Path("articles")
    series_list = []
    
    if articles_dir.exists():
        for item in articles_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.') and item.name != 'shared-templates':
                # Check if series has articles
                has_articles = False
                for subdir in item.iterdir():
                    if subdir.is_dir() and (subdir / "drafts" / "pages").exists():
                        has_articles = True
                        break
                if has_articles:
                    series_list.append(item.name)
    
    return sorted(series_list)

def check_qiita_token():
    """Verify Qiita token exists"""
    token_path = Path(".claude/config/qiita-token.json")
    if not token_path.exists():
        return False, "❌ Qiita token not configured. Please set up token in .claude/config/qiita-token.json"
    
    try:
        with open(token_path) as f:
            config = json.load(f)
            if "access_token" in config and config["access_token"] != "your_qiita_access_token_here":
                return True, "✅ Qiita token configured"
            else:
                return False, "❌ Qiita token not set. Please update .claude/config/qiita-token.json"
    except Exception as e:
        return False, f"❌ Error reading token: {str(e)}"

def count_articles(series_name):
    """Count articles in a series"""
    series_dir = Path("articles") / series_name
    count = 0
    
    for subdir in series_dir.iterdir():
        if subdir.is_dir():
            draft_file = subdir / "drafts" / "pages" / "article.md"
            alt_files = [
                subdir / "drafts" / "pages" / "main.md",
                subdir / "drafts" / "pages" / f"{subdir.name}.md"
            ]
            
            if draft_file.exists() or any(f.exists() for f in alt_files):
                count += 1
    
    return count

def run_npm_command(command, series_name):
    """Run npm command and capture output"""
    try:
        # Change to post/qiita directory
        os.chdir("post/qiita")
        
        # Run the command
        process = subprocess.Popen(
            ["npm", "run", command, series_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Stream output
        output_lines = []
        for line in iter(process.stdout.readline, ''):
            if line:
                print(line.rstrip())
                output_lines.append(line.rstrip())
        
        process.wait()
        
        # Change back to original directory
        os.chdir("../..")
        
        return process.returncode == 0, '\n'.join(output_lines)
    except Exception as e:
        os.chdir("../..")  # Ensure we return to original directory
        return False, str(e)

def extract_upload_results(output):
    """Extract upload results from command output"""
    results = {
        'successful': 0,
        'failed': 0,
        'total': 0,
        'urls': []
    }
    
    # Look for summary
    summary_match = re.search(r'✅ Successful: (\d+)', output)
    if summary_match:
        results['successful'] = int(summary_match.group(1))
    
    failed_match = re.search(r'❌ Failed: (\d+)', output)
    if failed_match:
        results['failed'] = int(failed_match.group(1))
    
    total_match = re.search(r'📝 Total: (\d+)', output)
    if total_match:
        results['total'] = int(total_match.group(1))
    
    # Extract URLs
    url_matches = re.findall(r'✅ Successfully posted: (https://qiita\.com/[^\s]+)', output)
    results['urls'] = url_matches
    
    return results

# Main execution
print("🚀 Qiita Series Upload Tool")
print("=" * 50)

# Check token
token_ok, token_msg = check_qiita_token()
print(f"\n{token_msg}")

if not token_ok:
    print("\n⚠️  Please configure your Qiita API token before proceeding.")
    print("See: https://qiita.com/settings/applications")
    exit(1)

# Load series
series_list = load_series_list()

if not series_list:
    print("\n❌ No series found in articles directory.")
    exit(1)

# Check if series was provided as argument
if series_arg:
    # Direct mode - use provided series name
    if series_arg in series_list:
        selected_series = series_arg
        article_count = count_articles(selected_series)
        print(f"\n📚 Direct mode: {selected_series} ({article_count} articles)")
    else:
        print(f"\n❌ Series '{series_arg}' not found.")
        print("\n📚 Available series:")
        for series in series_list:
            print(f"  - {series}")
        exit(1)
else:
    # Interactive mode - show selection menu
    print("\n📚 Available Series:")
    print("-" * 30)
    for i, series in enumerate(series_list, 1):
        article_count = count_articles(series)
        print(f"{i}. {series} ({article_count} articles)")

    # Get user selection
    print("\nSelect a series to upload (enter number):")
    try:
        selection = int(input("> ")) - 1
        if selection < 0 or selection >= len(series_list):
            raise ValueError()
        selected_series = series_list[selection]
    except:
        print("❌ Invalid selection")
        exit(1)

# Only show confirmation in interactive mode or ask for confirmation in direct mode
if not series_arg:
    article_count = count_articles(selected_series)
    print(f"\n✅ Selected: {selected_series} ({article_count} articles)")

# Generate tags first
print(f"\n🏷️  Generating appropriate tags for {series_name} articles...")
tag_process = subprocess.run(
    ["python", "-c", open(".claude/commands/generate-tags.md").read().split("```python")[1].split("```")[0], series_name],
    capture_output=True,
    text=True
)

if tag_process.returncode == 0:
    print("✅ Tags generated successfully")
    if tag_process.stdout:
        print(tag_process.stdout)
else:
    print("⚠️  Tag generation failed, continuing with default tags")
    if tag_process.stderr:
        print(f"Error: {tag_process.stderr}")

# Confirm upload
print("\n⚠️  This will upload all articles to Qiita.")
print("⚠️  If any article fails, ALL uploaded articles will be deleted (rollback).")
print("Continue? (y/N):")
confirm = input("> ").lower()

if confirm != 'y':
    print("❌ Upload cancelled")
    exit(0)

# Check if npm dependencies are installed
if not Path("post/qiita/node_modules").exists():
    print("\n📦 Installing dependencies...")
    os.chdir("post/qiita")
    subprocess.run(["npm", "install"], check=True)
    os.chdir("../..")

# Step 1: Upload articles
print(f"\n📤 Uploading {article_count} articles...")
print("-" * 50)

success, upload_output = run_npm_command("upload", selected_series)

if not success:
    print(f"\n❌ Upload failed: {upload_output}")
    exit(1)

# Extract results
results = extract_upload_results(upload_output)

if results['successful'] == 0:
    print("\n❌ No articles were uploaded successfully.")
    exit(1)

print(f"\n📊 Upload Complete!")
print(f"✅ Successful: {results['successful']}")
print(f"❌ Failed: {results['failed']}")

# Step 2: Add series links
if results['successful'] > 1:
    print("\n🔗 Adding series navigation links...")
    print("-" * 50)
    
    link_success, link_output = run_npm_command("update-links", selected_series)
    
    if link_success:
        print("\n✅ Series links added successfully!")
    else:
        print("\n⚠️  Failed to add series links. You can retry with:")
        print(f"   cd post/qiita && npm run update-links {selected_series}")

# Final summary
print("\n" + "=" * 50)
print("🎉 Upload Complete!")
print("=" * 50)

if results['urls']:
    print("\n📝 Uploaded Articles:")
    for i, url in enumerate(results['urls'], 1):
        print(f"{i}. {url}")

print(f"\n📁 Series data saved to: post/qiita/data/{selected_series}-series.json")
print("📋 Logs available in: post/qiita/logs/")

print("\n✨ Done!")
```