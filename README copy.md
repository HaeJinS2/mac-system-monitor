# MacSystemMonitor CLI

Do you check your system resources with the `top` command when your terminal suddenly lags?
Here's a prettier and more intuitive CLI monitoring tool for your Mac! 🚀

## Features

- Optimized for macOS system resource monitoring
- Detailed memory information similar to Activity Monitor
  - Active Memory (Currently used by apps)
  - Wired Memory (Used by system)
  - Inactive Memory (Recently used)
- Real-time CPU usage monitoring
- Clean and intuitive colored terminal UI

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/mac-system-monitor.git
cd mac-system-monitor

# Install dependencies
npm install

# Install globally
npm install -g .
```

## Usage

```bash
# Check current system status
ts

# Real-time monitoring mode (updates every second)
ts -w
```

## Screenshot

```
CPU Information:
Model: Apple M1 Pro
Cores: 8
Usage: 23.5%

Memory Information:
Total: 16.00 GB
Used: 8.32 GB (Active)
Available: 7.68 GB
Wired: 2.45 GB (System)
Active: 5.87 GB (Apps)
Inactive: 3.21 GB (Cached)
Usage: 52.0%

System Information:
Platform: darwin
OS: Darwin 21.6.0
Uptime: 5.2 hours
```

## Why This Tool?

- More detailed than `top` command
- Displays macOS-specific memory metrics
- Beautiful color-coded output
- Real-time monitoring with a clean interface
- Simple and intuitive commands

## System Requirements

- macOS operating system
- Node.js 14.0.0 or higher
- npm 6.0.0 or higher

## Tech Stack

- TypeScript
- Node.js
- Commander.js (CLI framework)
- Chalk (Terminal styling)

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mac-system-monitor.git

# Install dependencies
cd mac-system-monitor
npm install

# Build TypeScript
npm run build

# Test locally
npm install -g .
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by macOS Activity Monitor
- Built for Mac developers who need quick system insights
- Perfect for monitoring system resources during development

## Future Plans

- Add CPU temperature monitoring
- Disk usage statistics
- Network usage monitoring
- Custom refresh intervals
- Configuration options

## Support

If you encounter any issues or have suggestions, please file an issue in the GitHub repository.

---
Made with ❤️ for Mac developers who love beautiful CLI tools
