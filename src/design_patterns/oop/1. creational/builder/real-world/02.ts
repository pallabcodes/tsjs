class Header {
  constructor(public readonly title: string, public readonly date: string) {}
}

class Content {
  constructor(
    public readonly text: string,
    public readonly filters: string[] = []
  ) {}
}

class Footer {
  constructor(public readonly footerText: string) {}
}

class GeneratedReport {
  readonly header: Header;
  readonly content: Content;
  readonly footer?: Footer;

  constructor(header: Header, content: Content, footer?: Footer) {
    this.header = header;
    this.content = content;
    this.footer = footer;
  }
}

interface ReportBuilder {
  setHeader(title: string, date: string): this;
  setContent(text: string, filters?: string[]): this;
  setFooter(footerText: string): this;
  build(): GeneratedReport;
}

class CustomReportBuilder implements ReportBuilder {
  private header?: Header;
  private content?: Content;
  private footer?: Footer;

  setHeader(title: string, date: string): this {
    this.header = new Header(title, date);
    return this;
  }

  setContent(text: string, filters: string[] = []): this {
    this.content = new Content(text, filters);
    return this;
  }

  setFooter(footerText: string): this {
    this.footer = new Footer(footerText);
    return this;
  }

  build(): GeneratedReport {
    if (!this.header) {
      throw new Error('Header is required.');
    }
    if (!this.content) {
      throw new Error('Content is required.');
    }

    return new GeneratedReport(this.header, this.content, this.footer);
  }
}

// Usage Example
try {
  const builder = new CustomReportBuilder();
  const reportWithFooter = builder
    .setHeader('Annual Report', '2024-01-01')
    .setContent('This is the report content.', ['filter1', 'filter2'])
    .setFooter('Confidential')
    .build();

  console.log(
    'Generated Report with Footer:\n',
    JSON.stringify(reportWithFooter, null, 2)
  );
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to build report:', error.message);
  }
}

// Example without footer
try {
  const newBuilder = new CustomReportBuilder();
  const reportWithoutFooter = newBuilder
    .setHeader('Monthly Report', '2024-02-01')
    .setContent('Monthly content')
    .build();

  console.log(
    'Generated Report without Footer:\n',
    JSON.stringify(reportWithoutFooter, null, 2)
  );
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to build report:', error.message);
  }
}
