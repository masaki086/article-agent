#!/usr/bin/env python3
"""
Post to Qiita Command - Stable Version
Uploads a series of articles to Qiita with image removal
"""

import os
import json
import subprocess
from pathlib import Path
import re
import sys

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
    original_dir = os.getcwd()
    try:
        # Change to post/qiita directory
        post_qiita_dir = Path("post/qiita")
        if not post_qiita_dir.exists():
            return False, "post/qiita directory not found. Please ensure you're in the project root."
        
        os.chdir(post_qiita_dir)
        
        # Check if npm is available
        try:
            subprocess.run(["npm", "--version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False, "npm not found. Please install Node.js and npm."
        
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
        
        return process.returncode == 0, '\n'.join(output_lines)
    except Exception as e:
        return False, f"Command execution error: {str(e)}"
    finally:
        # Always return to original directory
        os.chdir(original_dir)

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

def main():
    # Check if series name was provided as argument
    series_arg = sys.argv[1] if len(sys.argv) > 1 else None
    
    print("🚀 Qiita Series Upload Tool")
    print("⚠️  PUBLISHING TOOL - Articles will be made public on Qiita")
    print("=" * 50)
    
    # Check token
    token_ok, token_msg = check_qiita_token()
    print(f"\n{token_msg}")
    
    if not token_ok:
        print("\n⚠️  Please configure your Qiita API token before proceeding.")
        print("See: https://qiita.com/settings/applications")
        sys.exit(1)
    
    # Load series
    series_list = load_series_list()
    
    if not series_list:
        print("\n❌ No series found in articles directory.")
        sys.exit(1)
    
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
            sys.exit(1)
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
            sys.exit(1)
    
    # Only show confirmation in interactive mode or ask for confirmation in direct mode
    if not series_arg:
        article_count = count_articles(selected_series)
        print(f"\n✅ Selected: {selected_series} ({article_count} articles)")
    
    # Skip tag generation for now - using default tags
    print(f"\n🏷️  Using default tags (Next.js, React, JavaScript, TypeScript, プログラミング)")
    
    # Articles will be processed with images removed automatically
    print(f"\n📝 Preparing {selected_series} articles (images will be removed for text-only format)...")
    
    # Confirm upload
    print("\n⚠️  This will upload all articles to Qiita.")
    print("⚠️  If any article fails, ALL uploaded articles will be deleted (rollback).")
    
    # CRITICAL SAFETY: Always require explicit confirmation, even in direct mode
    print("Continue? (y/N):")
    try:
        confirm = input("> ").lower()
    except EOFError:
        print("❌ No input available for confirmation. Publishing cancelled for safety.")
        sys.exit(0)
    
    if confirm != 'y':
        print("❌ Upload cancelled")
        sys.exit(0)
    
    # Check if npm dependencies are installed
    node_modules_path = Path("post/qiita/node_modules")
    if not node_modules_path.exists():
        print("\n📦 Installing dependencies...")
        original_dir = os.getcwd()
        try:
            os.chdir("post/qiita")
            result = subprocess.run(["npm", "install"], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ npm install failed: {result.stderr}")
                sys.exit(1)
            print("✅ Dependencies installed successfully")
        except Exception as e:
            print(f"❌ Failed to install dependencies: {str(e)}")
            sys.exit(1)
        finally:
            os.chdir(original_dir)
    
    # Step 1: Upload articles (images will be automatically removed)
    print(f"\n📤 Uploading {selected_series} articles to Qiita...")
    print("-" * 50)
    
    success, upload_output = run_npm_command("upload", selected_series)
    
    if not success:
        print(f"\n❌ Upload failed: {upload_output}")
        sys.exit(1)
    
    # Extract results
    results = extract_upload_results(upload_output)
    
    if results['successful'] == 0:
        print("\n❌ No articles were uploaded successfully.")
        sys.exit(1)
    
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

if __name__ == "__main__":
    main()