# How to Contribute

PacketWiki is a **100% open and collaborative** project. Anyone can add, fix, or improve content — by opening a Pull Request on GitHub or sending suggestions by email.

---

## Ways to Contribute

### 1. Edit an existing page

On any page, click the **"Edit this page on GitHub"** link in the footer. This opens the file directly on GitHub where you can propose changes via Pull Request — no local setup needed.

### 2. Add a new page via GitHub

1. **Fork** the repository at [github.com/EmersonRicard0/packetwiki](https://github.com/EmersonRicard0/packetwiki)
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/packetwiki.git
   cd packetwiki
   npm install
   npm run docs:dev
   ```
3. Create the `.md` file in the correct directory (e.g. `docs/pt/switches/cisco/catalyst-2960.md`)
4. Use the [equipment template](#equipment-template) below
5. Add the entry to the sidebar in `docs/.vitepress/sidebars/en.ts`
6. Open a **Pull Request** describing what was added

### 3. Report a bug or suggestion via GitHub

Open an [Issue on GitHub](https://github.com/EmersonRicard0/packetwiki/issues) describing the problem or suggestion.

### 4. Send content by email

Prefer not to use GitHub? No problem! Send your content to:

📧 **[silvaemerson797@gmail.com](mailto:silvaemerson797@gmail.com)**

Accepted formats:
- `.md` (Markdown) file
- Plain text (`.txt`)
- Text in the email body
- Word document or PDF (we will convert)

Please include in your email:
- **Equipment:** vendor and model name
- **Firmware/version tested** (if known)
- **Your name** (for credit on the page, if you'd like)

---

## Equipment Template

When adding a new equipment page, use this structure:

```markdown
# Vendor Model — Equipment Name

Brief description of the equipment, its market position, and use cases.

## Technical Specifications

| Feature | Value |
|---------|-------|
| CPU | ... |
| RAM | ... |
| Interfaces | ... |
| Operating System | ... |
| Firmware tested | ... |

## Initial Access

### Factory defaults

| Parameter | Value |
|-----------|-------|
| IP | ... |
| Username | ... |
| Password | ... |

### Step by step

...

## Factory Reset

...

## Basic Configuration

...

## Quick Reference

| Purpose | Command |
|---------|---------|
| ... | ... |

## Common Issues

...

## See Also

- Related links
```

---

## Contribution Guidelines

- Write **clearly and objectively**
- Always **test commands** before publishing
- Indicate the **firmware/software version** when relevant
- Use code blocks (` ``` `) for all CLI commands
- No commercial promotion — content must be technical and neutral
- Respect the existing directory structure

---

## Questions?

- Open a [GitHub Discussion](https://github.com/EmersonRicard0/packetwiki/discussions)
- Or email us at **[silvaemerson797@gmail.com](mailto:silvaemerson797@gmail.com)**
