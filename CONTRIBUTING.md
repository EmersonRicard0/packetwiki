# Contributing to PacketWiki

Thank you for your interest in contributing! PacketWiki is a community-driven project and every contribution matters.

## Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/packetwiki`
3. Install dependencies: `npm install`
4. Start local dev server: `npm run docs:dev`
5. Make your changes
6. Open a Pull Request

## Directory Structure

```
docs/
├── en/                  # English content (root)
│   ├── routers/
│   │   ├── cisco/
│   │   ├── mikrotik/
│   │   └── ...
│   ├── switches/
│   └── linux/
└── pt/                  # Portuguese content
    ├── roteadores/
    ├── switches/
    └── linux/
```

## Adding Content

- Add both PT and EN versions when possible
- Follow the equipment template in [contribute.md](docs/contribute.md)
- Update the sidebar in `.vitepress/sidebars/`

## Code of Conduct

- Be respectful and welcoming
- No spam or self-promotion
- Technical accuracy matters — cite sources when unsure
- English and Portuguese are both welcome

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
