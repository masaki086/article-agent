# Series Update Interactive Command

## Command Purpose
Update existing article series to apply new formatting, numbering system, structural improvements, and content modifications while preserving existing content and quality.

## Required Reading
Before series update, this command references:
- `/claude.md`: Current project-wide workflow and optimization guidelines
- `/articles/shared-templates/`: Latest optimization templates
- `/personas/individuals/`: Current unified persona definitions
- Existing series files: `series-common.md`, `author.md`, `reviewer.md`

## Update Capabilities

### 1. Structural Updates
- **Directory Renaming**: Apply new numbering format (`ArticleName/` → `1-ArticleName/`)
- **File Organization**: Reorganize drafts, published, reviews directories
- **Series Configuration**: Update author.md, reviewer.md, series-common.md

### 2. Content Updates
- **Format Modernization**: Apply latest optimized-format.md template
- **Persona Consistency**: Update to current persona definitions
- **Progress Section**: Remove outdated "これまでに学んだこと" sections
- **Figure Placeholders**: Add diagram/flowchart placeholders for new visual content

### 3. Quality Improvements
- **Template Alignment**: Ensure articles match current shared-templates
- **Naming Consistency**: Apply current naming conventions
- **Cross-referencing**: Update internal links after renaming

## Interaction Flow

### Step 1: Series Detection
Ask user:
1. **Series Name**: "Which series do you want to update?"
2. **Update Scope**: What type of updates are needed?
   - [ ] Structure only (renaming, reorganization)
   - [ ] Content formatting (templates, personas)
   - [ ] Complete modernization (structure + content)
   - [ ] Custom updates (user-specified changes)

### Step 2: Current State Analysis
Automatically analyze:
1. **Directory Structure**: Check current naming patterns
2. **Content Format**: Compare against latest templates
3. **Persona Usage**: Verify current vs. available personas
4. **Template Alignment**: Check shared-templates usage

### Step 3: Update Plan Generation
Present detailed plan:
```
📋 Update Plan for [SeriesName]:

**Structural Changes:**
- Rename: ArticleName1/ → 1-ArticleName1/
- Rename: ArticleName2/ → 2-ArticleName2/ 
- Update internal references and links

**Content Updates:**
- Apply optimized-format.md template
- Update persona references to [current_persona]
- Remove "これまでに学んだこと" sections
- Add figure placeholders: [X] diagrams identified

**Configuration Updates:**
- Update series-common.md to latest format
- Refresh author.md with current persona
- Update reviewer.md configuration

Estimated time: X minutes
Files affected: Y files

Proceed with this update plan? (y/n)
```

### Step 4: Backup Creation
Before any changes:
1. **Create backup branch**: `backup-[series]-[date]-[time]`
2. **Archive current state**: Save original files with timestamp
3. **Confirm backup**: Verify backup accessibility

### Step 5: Structural Updates
Execute in order:
1. **Directory Renaming**: 
   ```bash
   # Example for NextJSRenderingBattle series
   mv NextJSMigrationStrategy/ 1-NextJSMigrationStrategy/
   mv RenderingStrategySelection/ 2-RenderingStrategySelection/
   mv HighSpeedRenderingImplementation/ 3-HighSpeedRenderingImplementation/
   mv ProductionOptimizationMonitoring/ 4-ProductionOptimizationMonitoring/
   ```

2. **Update Internal References**: Fix all cross-references in articles
3. **Update Configuration Files**: Refresh series-common.md, author.md, reviewer.md

### Step 6: Content Modernization
For each article:
1. **Load Current Content**: Read existing article
2. **Apply Template Updates**: Merge with latest optimized-format.md
3. **Update Persona Sections**: Apply current persona voice
4. **Remove Outdated Sections**: Clean up deprecated content
5. **Add Figure Placeholders**: Insert diagram markers where appropriate
6. **Preserve Custom Content**: Maintain article-specific technical content

### Step 7: Quality Validation
After updates:
1. **Link Verification**: Check all internal references work
2. **Format Consistency**: Verify template compliance
3. **Persona Alignment**: Confirm voice consistency
4. **Content Integrity**: Ensure no content was lost
5. **Structure Validation**: Verify directory organization

### Step 8: Update Report
Generate comprehensive report:
```markdown
# Series Update Report: [SeriesName]

## Update Summary
- **Completion Time**: [timestamp]
- **Files Modified**: X files
- **Directories Renamed**: Y directories
- **Backup Location**: backup-[series]-[date]

## Changes Applied
### Structural Updates
- ✅ Applied numbered directory format
- ✅ Updated internal cross-references
- ✅ Reorganized file structure

### Content Updates  
- ✅ Applied latest optimized-format.md
- ✅ Updated to [persona] voice consistency
- ✅ Removed deprecated sections
- ✅ Added [N] figure placeholders

### Quality Improvements
- ✅ Template alignment: 100%
- ✅ Link verification: All links functional
- ✅ Persona consistency: Verified

## Next Steps
1. Review updated articles for content accuracy
2. Create actual diagrams for placeholders
3. Consider re-running quality checks
4. Update any external documentation references

## Rollback Instructions
If issues are found, restore from backup:
`git checkout backup-[series]-[date]`
```

## Interactive Prompts

### Opening Prompt
```
🔄 Welcome to Series Update Assistant!

I'll help you modernize your existing article series with:
- New numbered directory structure (1-ArticleName/, 2-ArticleName/)
- Latest template formatting and persona consistency
- Improved organization and cross-referencing
- Backup protection for safe updates

Available series for update:
[List detected series directories]

Which series would you like to update?
```

### Update Scope Selection
```
📊 Update Scope for [SeriesName]:

What type of updates do you need?

1. **Quick Structure Update** (5-10 minutes)
   - Apply numbered directory format
   - Update cross-references
   - Basic cleanup

2. **Template Modernization** (15-20 minutes) 
   - Apply latest optimized-format.md
   - Update persona consistency
   - Remove deprecated sections

3. **Complete Modernization** (20-30 minutes)
   - Full structural + content updates
   - Add figure placeholders
   - Comprehensive quality improvements

4. **Custom Update**
   - Specify exact changes needed
   - Selective modifications

Please select your preferred update scope (1-4):
```

### Confirmation Prompt
```
⚠️  Update Confirmation

Before proceeding, I will:
1. Create backup: backup-[series]-20250804-143022
2. Update [N] directories with numbered format
3. Modify [M] article files with new templates
4. Update series configuration files

This operation will modify existing files. The backup ensures you can rollback if needed.

Type 'CONFIRM' to proceed with the update:
```

## Safety Features

### Backup Strategy
- **Automatic Git Branch**: Create backup branch before any changes
- **File Timestamps**: Archive original versions with timestamps  
- **Rollback Instructions**: Clear recovery procedures
- **Change Logging**: Detailed record of all modifications

### Validation Checks
- **Pre-update Verification**: Ensure series is in valid state
- **Post-update Testing**: Verify all changes applied correctly
- **Link Integrity**: Check internal references after renaming
- **Content Preservation**: Confirm no content was lost

### Error Handling
- **Partial Failure Recovery**: Rollback incomplete updates
- **Conflict Resolution**: Handle file conflicts gracefully
- **Progress Tracking**: Show detailed progress during updates
- **Error Reporting**: Clear information about any issues

## Usage Instructions

To use this command:
```
/update-series [SeriesName]
```

Examples:
```
/update-series NextJSRenderingBattle
/update-series "Claude Code Series"
```

The command will detect the existing series, analyze current state, propose an update plan, and guide you through safe modernization with full backup protection.

## Integration with define-series

This command complements `/define-series` by:
- **Modernizing Legacy Series**: Update old series to new standards
- **Testing New Features**: Trial new formats on existing content
- **Incremental Improvements**: Apply updates without recreation
- **Template Evolution**: Keep existing series current with template changes

Together, these commands provide complete series lifecycle management from creation through ongoing maintenance.