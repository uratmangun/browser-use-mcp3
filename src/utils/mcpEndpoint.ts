/**
 * Generates the MCP endpoint URL based on the current browser location
 * Handles localhost detection for proper protocol selection and includes error handling for SSR
 */
export const generateMcpEndpointUrl = (): string => {
  // Handle SSR case where window is not available
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const { protocol, hostname, port } = window.location;
    
    // Handle cases where hostname might be undefined or empty
    if (!hostname) {
      return '';
    }

    // Detect localhost for protocol selection
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    
    // Use http for localhost, https for everything else
    const targetProtocol = isLocalhost ? 'http:' : 'https:';
    
    // Include port if it exists and is not default ports (80 for http, 443 for https)
    const shouldIncludePort = port && 
      !((targetProtocol === 'http:' && port === '80') || 
        (targetProtocol === 'https:' && port === '443'));
    
    const portSuffix = shouldIncludePort ? `:${port}` : '';
    
    // Construct the MCP endpoint URL
    return `${targetProtocol}//${hostname}${portSuffix}/mcp`;
  } catch (error) {
    // Handle any unexpected errors during URL construction
    console.error('Error generating MCP endpoint URL:', error);
    return '';
  }
};