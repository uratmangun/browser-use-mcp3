# Requirements Document

## Introduction

This feature adds a prominent URL display box to the Browser-use MCP page that shows the current MCP endpoint URL. The box will dynamically construct the URL based on the current domain and display it in a user-friendly format with proper protocol handling.

## Requirements

### Requirement 1

**User Story:** As a user visiting the Browser-use MCP page, I want to see the MCP endpoint URL clearly displayed, so that I can easily identify and use the correct endpoint for my MCP configuration.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display a box containing the MCP endpoint URL
2. WHEN the current domain is localhost THEN the system SHALL use "http://" protocol
3. WHEN the current domain is not localhost THEN the system SHALL use "https://" protocol
4. WHEN constructing the URL THEN the system SHALL append "/mcp" to the current domain
5. IF the current URL is "http://localhost:3100/" THEN the displayed URL SHALL be "http://localhost:3100/mcp"
6. IF the current URL is "https://example.com/" THEN the displayed URL SHALL be "https://example.com/mcp"

### Requirement 2

**User Story:** As a user, I want the MCP endpoint URL to be visually prominent and easy to read, so that I can quickly locate and reference it.

#### Acceptance Criteria

1. WHEN displaying the URL box THEN the system SHALL position it below the header description
2. WHEN rendering the URL box THEN the system SHALL use a distinct visual style that makes it stand out
3. WHEN displaying the URL text THEN the system SHALL use a monospace font for better readability
4. WHEN the box is rendered THEN the system SHALL include appropriate padding and styling consistent with the page design

### Requirement 3

**User Story:** As a user, I want to be able to copy the MCP endpoint URL easily, so that I can paste it into my MCP configuration without typing errors.

#### Acceptance Criteria

1. WHEN the URL box is displayed THEN the system SHALL include a copy button
2. WHEN I click the copy button THEN the system SHALL copy the full URL to my clipboard
3. WHEN the URL is copied THEN the system SHALL show visual feedback indicating successful copy
4. WHEN the copy feedback is shown THEN the system SHALL automatically hide it after 2 seconds