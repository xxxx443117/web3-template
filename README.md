# Web3 DApp Template

A production-ready Vue 3 + TypeScript template for building Web3 DApps.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build | Vite 6 |
| Web3 | Reown AppKit + Wagmi + Viem |
| UI | Vant 4 (mobile) + Tailwind CSS + DaisyUI |
| State | Pinia + TanStack Vue Query |
| i18n | vue-i18n |
| API | Auto-generated from Swagger |

## Project Structure

```
src/
  app.vue                    # Root component
  main.ts                    # Entry point
  wagmi-config.ts            # Wagmi/Web3 config
  bsc-client.ts              # Standalone read-only client
  apis/                      # API layer (Swagger auto-generated)
    http.ts                  # Axios wrapper
    swagger/                 # Generated API client
  assets/                    # Static assets (icons, images, fonts, CSS)
  components/                # Shared components
    headers/                 # Header, Menu, LangSelect, Title
    ConnectWalletBtn.vue     # Wallet connect button
    Footer.vue               # Footer navigation
    ...
  config/                    # App configuration
    index.ts                 # Feature flags
    theme.ts                 # Theme management
  contract/                  # Smart contract layer
    contracts.ts             # Contract address registry (by chainId)
    tokens.ts                # Token definitions (multi-chain)
    Token.ts                 # Token model class
    abis/                    # Contract ABIs
    hooks/                   # Contract interaction hooks
      useContracAddress.ts   # Reactive contract address
      useErc20.ts            # ERC20 operations
      useToken.ts            # Token serialization
    utils.ts                 # Contract utilities
  hooks/                     # App-level hooks
    useWeb3ActiveAccount.ts  # Account state + signature verification
    useInitAppkit.ts         # Wallet modal init
    useSwitchChain.ts        # Chain switching
    useChainHook.ts          # Chain detection
    useScroll.ts             # Scroll listener
    useRefreshTimer.ts       # Timer hook
  lang/                      # i18n (en, zh)
  router/                    # Vue Router with guards
  stores/                    # Pinia stores
  utils/                     # Utility functions
    web3.ts                  # Address utils, block explorer
    format.ts                # Number/date formatting
    errorHandler.ts          # Unified error handling
    ...
  views/                     # Page views
    home/                    # Example home page
```

## Getting Started

```bash
# 1. Copy env file and fill in your values
cp .env.example .env.development

# 2. Install dependencies
npm install

# 3. Start dev server (port 5234)
npm run dev

# 4. Build for production
npm run build
```

## Key Features

### Contract Address Registry
Contracts are registered by `chainId` in `contract/contracts.ts`. Adding a new chain requires only appending addresses:

```ts
export const contracts = {
  TOKEN: [
    { chainId: bscTestnet.id, address: "0x..." },
    { chainId: bsc.id, address: "0x..." },
  ],
} as const;
```

### Standard Transaction Pattern
All write operations follow: `simulateContract` -> `writeContractAsync` -> `waitForTransactionReceipt`.

### Dual Authentication
- **User**: Wallet signature verification (client-side, no backend session)
- **Admin**: Signature login + JWT token (sessionStorage)

### API Auto-Generation
```bash
npm run api  # Generates type-safe API client from Swagger
```

### Feature Flags
Control functionality visibility via environment variables:
- `VITE_BASE_OPEN_STAKE` - Enable/disable staking
- `VITE_BASE_OPEN_WITHDRAW` - Enable/disable withdrawals

## Docker Deployment

```bash
docker build -t web3-app .
docker run -p 80:80 web3-app
```

## Testing

```bash
npm test          # Run tests once
npm run test:watch # Watch mode
```

## License

MIT
