## fluent-emoji

### Setup

```bash
npm i fluent-emoji
```

### Usage

```tsx
import { WhiteFlag } from 'fluent-emoji'

export function App() {
  return <WhiteFlag />
}
```

### Building

> **Note**: Deno 1.30 or later is required.

1. **Download Emoji Files**

    ```bash
    deno task download
    ```

2. **Create JavaScript Bundle**

    ```bash
    deno task build
    ```
