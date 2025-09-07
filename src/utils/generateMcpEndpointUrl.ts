/**
 * Generates the MCP endpoint URL based on the current browser location
 * @returns The complete MCP endpoint URL
 */
export const generateMcpEndpointUrl = (): string => {
  // Handle SSR case where window is not available
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const { hostname, port } = window.location;
    
    // Handle missing hostname
    if (!hostname) {
      return '';
    }

    // Determine protocol based on localhost detection
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const protocol = isLocalhost ? 'http:' : 'https:';
    
    // Handle port - only include if it exists
    const portSuffix = port ? `:${port}` : '';
    
    // Construct the MCP endpoint URL
    return `${protocol}//${hostname}${portSuffix}/mcp`;
  } catch (error) {
    // Fallback for any errors
    console.error('Error generating MCP endpoint URL:', error);
    return '';
  }
};