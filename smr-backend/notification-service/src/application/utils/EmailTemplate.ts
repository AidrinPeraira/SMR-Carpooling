export class EmailTemplate {
  private static readonly colors = {
    background: '#f8fafc',
    card: '#ffffff',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    accent: '#10b981',
    border: '#e2e8f0',
  };

  static generate(title: string, content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: ${this.colors.background};
      color: ${this.colors.textPrimary};
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .card {
      background-color: ${this.colors.card};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid ${this.colors.border};
    }
    .header {
      background-color: ${this.colors.accent};
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 32px 24px;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 16px;
      color: ${this.colors.textPrimary};
    }
    .content p:last-child {
      margin-bottom: 0;
    }
    .footer {
      background-color: ${this.colors.background};
      padding: 24px;
      text-align: center;
      border-top: 1px solid ${this.colors.border};
    }
    .footer p {
      margin: 0;
      font-size: 14px;
      color: ${this.colors.textSecondary};
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: ${this.colors.accent};
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      margin: 16px 0;
      text-align: center;
    }
    .comment-box {
      background-color: ${this.colors.background};
      border-left: 4px solid ${this.colors.accent};
      padding: 16px;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
    }
    .comment-box p {
      margin: 0;
      color: ${this.colors.textSecondary};
      font-style: italic;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    .data-table th, .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid ${this.colors.border};
    }
    .data-table th {
      color: ${this.colors.textSecondary};
      font-weight: 500;
      width: 40%;
    }
    .data-table td {
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>ShareMyRide</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>This is an automated message from ShareMyRide.</p>
        <p>&copy; ${new Date().getFullYear()} ShareMyRide. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }
}
