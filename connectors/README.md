# Connector Framework

This directory contains the connector framework for ingesting data from public sources.

## Overview

Connectors are responsible for collecting data from publicly available sources and importing it into the CompanyNext database. All connectors must adhere to ethical data collection practices.

## Ethical Guidelines

**IMPORTANT**: All connectors must follow these guidelines:

1. **Public Data Only**: Only collect data from publicly accessible sources
2. **No Authentication Bypass**: Never scrape password-protected or gated content
3. **No CAPTCHA Bypass**: Do not bypass CAPTCHAs or other anti-bot measures
4. **Respect robots.txt**: Honor website robots.txt directives
5. **Rate Limiting**: Implement appropriate delays to avoid overwhelming source servers
6. **Terms of Service**: Comply with the terms of service of all source websites

## Connector Interface

Future connectors should implement the following interface:

```typescript
interface Connector {
  name: string;
  description: string;
  
  // Run the connector and return ingestion statistics
  run(): Promise<IngestionResult>;
  
  // Validate that the connector can access its data source
  validate(): Promise<boolean>;
}

interface IngestionResult {
  addedCount: number;
  skippedCount: number;
  errorCount: number;
  errors?: Array<{ message: string; details?: any }>;
}
```

## Planned Connectors

Future connectors may include:

- **CIPC Public Records**: Company registration data
- **CCMA Cases**: Labour dispute cases
- **Court Records**: Public court case information

All connectors will be developed with strict adherence to the ethical guidelines above.
