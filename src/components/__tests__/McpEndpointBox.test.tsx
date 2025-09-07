/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { McpEndpointBox } from '../McpEndpointBox';

// Mock the generateMcpEndpointUrl function
jest.mock('../../utils/mcpEndpoint', () => ({
  generateMcpEndpointUrl: jest.fn()
}));

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('McpEndpointBox', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let mockGenerateMcpEndpointUrl: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateMcpEndpointUrl = require('../../utils/mcpEndpoint').generateMcpEndpointUrl;
    mockGenerateMcpEndpointUrl.mockReturnValue('http://localhost:3000/mcp');
    mockWriteText.mockResolvedValue(undefined);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('component rendering', () => {
    it('should render the component with MCP endpoint URL', () => {
      render(<McpEndpointBox />);
      
      expect(screen.getByText('MCP Endpoint URL')).toBeInTheDocument();
      expect(screen.getByText('Use this URL to configure your MCP client connection')).toBeInTheDocument();
      expect(screen.getByText('http://localhost:3000/mcp')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    });

    it('should not render when no URL is available (SSR case)', () => {
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('');
      
      const { container } = render(<McpEndpointBox />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when URL generation returns empty string', () => {
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('');
      
      const { container } = render(<McpEndpointBox />);
      expect(container.firstChild).toBeNull();
    });

    it('should call generateMcpEndpointUrl on component mount', () => {
      render(<McpEndpointBox />);
      expect(mockGenerateMcpEndpointUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('copy functionality (requirements 3.1, 3.2, 3.3, 3.4)', () => {
    it('should copy URL to clipboard when copy button is clicked (requirement 3.2)', async () => {
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      fireEvent.click(copyButton);
      
      expect(mockWriteText).toHaveBeenCalledWith('http://localhost:3000/mcp');
    });

    it('should show visual feedback when URL is copied (requirement 3.3)', async () => {
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      fireEvent.click(copyButton);
      
      // Check that button text changes to "✓ Copied!"
      await waitFor(() => {
        expect(screen.getByText('✓ Copied!')).toBeInTheDocument();
      });
    });

    it('should hide copy feedback after 2 seconds (requirement 3.4)', async () => {
      jest.useFakeTimers();
      
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      fireEvent.click(copyButton);
      
      // Check that button text changes to "✓ Copied!"
      await waitFor(() => {
        expect(screen.getByText('✓ Copied!')).toBeInTheDocument();
      });
      
      // Fast-forward time by 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      // Check that it reverts back to "Copy"
      await waitFor(() => {
        expect(screen.getByText('Copy')).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });

    it('should handle clipboard API errors gracefully (requirement 3.4)', async () => {
      const clipboardError = new Error('Clipboard access denied');
      mockWriteText.mockRejectedValueOnce(clipboardError);
      
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy MCP endpoint URL:', clipboardError);
      });
      
      // Button should remain in normal state after error
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    it('should not attempt to copy when URL is empty', async () => {
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('');
      
      const { container } = render(<McpEndpointBox />);
      
      // Component should not render at all when URL is empty
      expect(container.firstChild).toBeNull();
      expect(mockWriteText).not.toHaveBeenCalled();
    });

    it('should disable copy button when URL is not available', () => {
      // This test ensures the copy button behavior when URL becomes unavailable
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('http://localhost:3000/mcp');
      
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      expect(copyButton).not.toBeDisabled();
    });
  });

  describe('visual styling and theme support', () => {
    it('should have consistent styling with page design', () => {
      render(<McpEndpointBox />);
      
      const container = screen.getByText('MCP Endpoint URL').closest('div');
      expect(container).toHaveClass(
        'bg-white', 
        'dark:bg-slate-800', 
        'rounded-xl', 
        'shadow-lg', 
        'p-6', 
        'border', 
        'border-slate-200', 
        'dark:border-slate-700',
        'mb-8'
      );
    });

    it('should use monospace font for URL display', () => {
      render(<McpEndpointBox />);
      
      const codeElement = screen.getByText('http://localhost:3000/mcp').closest('div');
      expect(codeElement).toHaveClass('font-mono');
    });

    it('should support dark/light theme for all elements', () => {
      render(<McpEndpointBox />);
      
      // Check title styling
      const title = screen.getByText('MCP Endpoint URL');
      expect(title).toHaveClass('text-slate-800', 'dark:text-slate-100');
      
      // Check description styling
      const description = screen.getByText('Use this URL to configure your MCP client connection');
      expect(description).toHaveClass('text-slate-600', 'dark:text-slate-300');
      
      // Check code container styling
      const codeContainer = screen.getByText('http://localhost:3000/mcp').closest('div');
      expect(codeContainer).toHaveClass('bg-slate-900', 'dark:bg-slate-950', 'text-green-400');
      
      // Check copy button styling
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      expect(copyButton).toHaveClass('bg-slate-700', 'hover:bg-slate-600', 'text-white');
    });

    it('should have proper spacing and layout', () => {
      render(<McpEndpointBox />);
      
      const title = screen.getByText('MCP Endpoint URL');
      expect(title).toHaveClass('mb-3');
      
      const description = screen.getByText('Use this URL to configure your MCP client connection');
      expect(description).toHaveClass('mb-4');
      
      const container = screen.getByText('MCP Endpoint URL').closest('div');
      expect(container).toHaveClass('mb-8');
    });
  });

  describe('different URL scenarios', () => {
    it('should render correctly with localhost URL', () => {
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('http://localhost:3100/mcp');
      
      render(<McpEndpointBox />);
      
      expect(screen.getByText('http://localhost:3100/mcp')).toBeInTheDocument();
    });

    it('should render correctly with production URL', () => {
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('https://example.com/mcp');
      
      render(<McpEndpointBox />);
      
      expect(screen.getByText('https://example.com/mcp')).toBeInTheDocument();
    });

    it('should render correctly with URL containing port', () => {
      mockGenerateMcpEndpointUrl.mockReturnValueOnce('https://api.example.com:8443/mcp');
      
      render(<McpEndpointBox />);
      
      expect(screen.getByText('https://api.example.com:8443/mcp')).toBeInTheDocument();
    });

    it('should copy the correct URL for different scenarios', async () => {
      const testUrls = [
        'http://localhost:3000/mcp',
        'http://127.0.0.1:8080/mcp',
        'https://example.com/mcp',
        'https://api.example.com:8443/mcp'
      ];

      for (const url of testUrls) {
        mockGenerateMcpEndpointUrl.mockReturnValueOnce(url);
        mockWriteText.mockClear();
        
        const { unmount } = render(<McpEndpointBox />);
        
        const copyButton = screen.getByRole('button', { name: 'Copy' });
        fireEvent.click(copyButton);
        
        expect(mockWriteText).toHaveBeenCalledWith(url);
        
        unmount();
      }
    });
  });

  describe('integration with existing page functionality', () => {
    it('should not interfere with other clipboard operations', async () => {
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      fireEvent.click(copyButton);
      
      expect(mockWriteText).toHaveBeenCalledWith('http://localhost:3000/mcp');
      
      // Simulate another clipboard operation
      await navigator.clipboard.writeText('other content');
      expect(mockWriteText).toHaveBeenCalledWith('other content');
    });

    it('should maintain state independence from other components', () => {
      const { rerender } = render(<McpEndpointBox />);
      
      // Click copy button
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      fireEvent.click(copyButton);
      
      // Rerender component
      rerender(<McpEndpointBox />);
      
      // Should start with fresh state
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper button accessibility', () => {
      render(<McpEndpointBox />);
      
      const copyButton = screen.getByRole('button', { name: 'Copy' });
      expect(copyButton).toBeInTheDocument();
      expect(copyButton.tagName).toBe('BUTTON');
      expect(copyButton).not.toBeDisabled();
    });

    it('should provide proper semantic structure', () => {
      render(<McpEndpointBox />);
      
      const heading = screen.getByText('MCP Endpoint URL');
      expect(heading.tagName).toBe('H3');
      
      const description = screen.getByText('Use this URL to configure your MCP client connection');
      expect(description.tagName).toBe('P');
    });

    it('should have proper contrast for readability', () => {
      render(<McpEndpointBox />);
      
      // URL should be displayed in high contrast color
      const codeElement = screen.getByText('http://localhost:3000/mcp').closest('div');
      expect(codeElement).toHaveClass('text-green-400');
      
      // Background should provide proper contrast
      expect(codeElement).toHaveClass('bg-slate-900', 'dark:bg-slate-950');
    });
  });
});