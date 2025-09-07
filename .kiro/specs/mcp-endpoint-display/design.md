# Design Document

## Overview

The MCP endpoint display feature will add a prominent URL box component to the existing Browser-use MCP page. This component will dynamically generate and display the MCP endpoint URL based on the current browser location, with proper protocol handling and copy functionality.

## Architecture

### Component Structure
- **McpEndpointBox**: A new React component that will be integrated into the existing page layout
- **URL Generation Logic**: Client-side logic to construct the endpoint URL from `window.location`
- **Copy Functionality**: Reuse existing clipboard copy logic from the page

### Integration Point
The component will be inserted between the header section and the commands section in the main page layout.

## Components and Interfaces

### McpEndpointBox Component

```typescript
interface McpEndpointBoxProps {
  // No props needed - component will read from window.location
}

const McpEndpointBox: React.FC<McpEndpointBoxProps> = () => {
  // Component implementation
}
```

### URL Generation Function

```typescript
const generateMcpEndpointUrl = (): string => {
  const { protocol, hostname, port } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const targetProtocol = isLocalhost ? 'http:' : 'https:';
  const portSuffix = port ? `:${port}` : '';
  return `${targetProtocol}//${hostname}${portSuffix}/mcp`;
}
```

## Data Models

### State Management
```typescript
interface McpEndpointState {
  url: string;
  copied: boolean;
}
```

The component will use local state to manage:
- `url`: The generated MCP endpoint URL
- `copied`: Boolean flag for copy feedback state

## Error Handling

### URL Generation Errors
- **Fallback Protocol**: If protocol detection fails, default to 'https:'
- **Missing Window Object**: Handle SSR scenarios by returning empty string initially
- **Invalid Hostname**: Fallback to current location if hostname is undefined

### Copy Operation Errors
- **Clipboard API Unavailable**: Show error message if navigator.clipboard is not supported
- **Copy Failure**: Handle clipboard write failures gracefully with error feedback

## Testing Strategy

### Unit Tests
1. **URL Generation Logic**
   - Test localhost detection (http protocol)
   - Test non-localhost domains (https protocol)
   - Test port handling
   - Test edge cases (missing hostname, etc.)

2. **Component Rendering**
   - Test component renders with correct URL
   - Test copy button functionality
   - Test copy feedback states

3. **Integration Tests**
   - Test component integration with main page
   - Test responsive behavior
   - Test dark/light theme compatibility

### Manual Testing Scenarios
1. Test on localhost:3000, localhost:3100, etc.
2. Test on deployed domain (https)
3. Test copy functionality across different browsers
4. Test visual appearance in both light and dark modes

## Implementation Details

### Styling Approach
- Use existing Tailwind classes consistent with page design
- Match the visual style of existing command boxes
- Ensure proper contrast for both light and dark themes
- Use monospace font for URL display

### Component Placement
Insert the McpEndpointBox component in the main page layout:
```jsx
<header>...</header>
<McpEndpointBox />
<div className="space-y-6">
  {/* existing commands */}
</div>
```

### Copy Functionality Integration
Reuse the existing `copyToClipboard` function and `copied` state pattern from the main page component, extending it to handle the MCP endpoint URL.