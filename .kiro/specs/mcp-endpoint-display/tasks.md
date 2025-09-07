# Implementation Plan

- [x] 1. Create URL generation utility function
  - Implement `generateMcpEndpointUrl()` function that reads from `window.location`
  - Handle localhost detection for http vs https protocol selection
  - Include proper port handling in URL construction
  - Add error handling for SSR and edge cases
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Create McpEndpointBox component
  - Build React component that displays the MCP endpoint URL in a styled box
  - Integrate URL generation function to dynamically create endpoint URL
  - Apply consistent styling with existing page design using Tailwind classes
  - Ensure proper dark/light theme support
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_

- [x] 3. Implement copy functionality for MCP endpoint
  - Add copy button to the McpEndpointBox component
  - Integrate with existing clipboard copy logic from main page
  - Implement copy feedback state management with 2-second timeout
  - Handle clipboard API errors gracefully
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Integrate McpEndpointBox into main page layout
  - Import and place McpEndpointBox component between header and commands sections
  - Ensure proper spacing and layout consistency
  - Test component renders correctly in the page context
  - Verify responsive behavior and visual integration
  - _Requirements: 2.1, 2.4_

- [ ] 5. Add comprehensive tests for URL generation and component
  - Write unit tests for `generateMcpEndpointUrl()` function covering localhost and non-localhost scenarios
  - Create component tests for McpEndpointBox rendering and copy functionality
  - Test error handling scenarios and edge cases
  - Verify integration with existing page functionality
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 3.1, 3.2, 3.3, 3.4_