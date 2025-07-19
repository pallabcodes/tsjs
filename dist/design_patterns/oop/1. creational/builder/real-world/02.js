"use strict";
class Header {
    constructor(title, date) {
        this.title = title;
        this.date = date;
    }
}
class Content {
    constructor(text, filters = []) {
        this.text = text;
        this.filters = filters;
    }
}
class Footer {
    constructor(footerText) {
        this.footerText = footerText;
    }
}
class GeneratedReport {
    constructor(header, content, footer) {
        this.header = header;
        this.content = content;
        this.footer = footer;
    }
}
class CustomReportBuilder {
    setHeader(title, date) {
        this.header = new Header(title, date);
        return this;
    }
    setContent(text, filters = []) {
        this.content = new Content(text, filters);
        return this;
    }
    setFooter(footerText) {
        this.footer = new Footer(footerText);
        return this;
    }
    build() {
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
    console.log('Generated Report with Footer:\n', JSON.stringify(reportWithFooter, null, 2));
}
catch (error) {
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
    console.log('Generated Report without Footer:\n', JSON.stringify(reportWithoutFooter, null, 2));
}
catch (error) {
    if (error instanceof Error) {
        console.error('Failed to build report:', error.message);
    }
}
//# sourceMappingURL=02.js.map