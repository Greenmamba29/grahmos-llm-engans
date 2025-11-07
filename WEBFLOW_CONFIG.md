# Webflow Configuration Reference

This document references the Webflow configuration files set up for the GRAHMOS Directory Platform.

## Configuration Files

### 1. Webflow Config (`~/webflow-cli/cursor-webflow-config.json`)
Contains all Webflow API configuration including:
- Site ID and API endpoints
- Collection IDs (stadiums, routes, providers)
- Page IDs (home, search, style guide, templates)

### 2. Cursor Rules (`.cursorrules`)
Development guidelines and project context for AI assistance.

### 3. MCP Configuration (`~/.cursor/mcp.json`)
Model Context Protocol server configuration for Webflow integration.

## Environment Variables Required

Set the following environment variable:
```bash
export WEBFLOW_API_TOKEN="your_api_token_here"
```

## Quick Reference

**Site ID:** 687f11a214d051312f70590e  
**API Base:** https://api.webflow.com/v2

**Collections:**
- Stadiums: `68ac5238f3c7da9c3a054048`
- Routes: `68ac5528a1178733012eeccb`
- Providers: `68ac5fddf20aaebae7e2addd`

**Pages:**
- Home: `687f11a214d051312f705914`
- Search: `68ab4cb4e6f4d590011e1188`
- Style Guide: `687f11a214d051312f70591c`
- Stadiums Template: `68ac5238f3c7da9c3a054078`
- Routes Template: `68ac5528a1178733012eecdd`
- Providers Template: `68ac5fddf20aaebae7e2ade9`

## Usage

The Webflow MCP server will be available once Cursor is restarted and the `WEBFLOW_API_TOKEN` environment variable is set.
