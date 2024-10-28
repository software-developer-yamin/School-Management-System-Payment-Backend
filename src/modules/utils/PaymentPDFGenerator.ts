/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable class-methods-use-this */

import PDFDocument from 'pdfkit';
import { IPaymentDoc, PaymentStatus } from '../payment/payment.interfaces';

interface GeneratorOptions {
  outputDir?: string;
  fontSize?: {
    title?: number;
    heading?: number;
    normal?: number;
  };
  fontFamily?: string;
}

type Field = [string, string | number, boolean?];

class PaymentPDFGenerator {
  private options: Required<GeneratorOptions>;

  constructor(options: GeneratorOptions = {}) {
    this.options = {
      outputDir: options.outputDir || 'output',
      fontSize: {
        title: options.fontSize?.title || 16,
        heading: options.fontSize?.heading || 14,
        normal: options.fontSize?.normal || 12,
      },
      fontFamily: options.fontFamily || 'Helvetica',
    };
  }

  async generatePDF(payment: IPaymentDoc): Promise<PDFKit.PDFDocument> {
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    this.addHeader(doc);
    this.addPaymentDetails(doc, payment);
    this.addFooter(doc, payment);

    doc.end();

    return doc;
  }

  private formatDate(dateString: Date): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  private addHeader(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(this.options.fontSize.title ?? 16)
      .font(`${this.options.fontFamily}-Bold`)
      .text('Payment Receipt', {
        align: 'center',
        underline: true,
      });
    doc.moveDown();
  }

  private addPaymentDetails(doc: PDFKit.PDFDocument, payment: IPaymentDoc): void {
    doc
      .fontSize(this.options.fontSize.heading ?? 14)
      .font(`${this.options.fontFamily}-Bold`)
      .text('Payment Details');
    doc.moveDown(0.5);

    const paymentFields: Field[] = [
      ['Student ID', payment.studentId],
      ['Class', payment.class],
      ['Month', payment.month],
      ['Amount', this.formatCurrency(payment.amount)],
      ['Transaction ID', payment.transactionId],
      ['Payment Date', this.formatDate(payment.paymentDate)],
      ['Payment Status', this.formatStatus(payment.status)],
    ];

    this.addFieldsToDoc(doc, paymentFields);
    doc.moveDown();
  }

  private addFooter(doc: PDFKit.PDFDocument, payment: IPaymentDoc): void {
    const pageHeight = doc.page.height;
    const footerHeight = 130; // Adjust this value based on your footer content

    // Move to the bottom of the page, leaving some margin
    // eslint-disable-next-line no-param-reassign
    doc.y = pageHeight - footerHeight;

    doc.moveDown(2);
    doc.fontSize(this.options.fontSize.normal ?? 12).text('Authorized Signature: _________________', {
      align: 'right',
    });

    doc.moveDown();
    doc
      .fontSize(10)
      .text(`Generated on: ${this.formatDate(payment.createdAt)}`, {
        align: 'left',
      })
      .text(`Document ID: ${payment.id}`, {
        align: 'left',
      });
  }

  private addFieldsToDoc(doc: PDFKit.PDFDocument, fields: Field[]): void {
    doc.fontSize(this.options.fontSize.normal ?? 12).font(this.options.fontFamily);

    fields.forEach(([label, value, isCurrency]) => {
      const formattedValue = isCurrency && typeof value === 'number' ? this.formatCurrency(value) : value;
      doc.text(`${label}: ${formattedValue}`, {
        continued: false,
        lineGap: 5,
      });
    });
  }

  private formatStatus(status: PaymentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export default PaymentPDFGenerator;
