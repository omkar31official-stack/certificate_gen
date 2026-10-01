import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';

interface CertificateField {
  id: string;
  type: string; // "text" | "qr"
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string; // hex color
  fontFamily?: string;
  value: string;
}

export async function generateCertificatePdf(
  templateBuffer: Buffer,
  fields: CertificateField[],
  mimeType: string = 'application/pdf'
): Promise<Buffer> {
  let pdfDoc: PDFDocument;
  let firstPage;

  if (mimeType.includes('pdf')) {
    pdfDoc = await PDFDocument.load(templateBuffer);
    const pages = pdfDoc.getPages();
    firstPage = pages[0];
  } else {
    pdfDoc = await PDFDocument.create();
    let image;
    if (mimeType.includes('png')) {
      image = await pdfDoc.embedPng(templateBuffer);
    } else {
      image = await pdfDoc.embedJpg(templateBuffer);
    }
    
    firstPage = pdfDoc.addPage([image.width, image.height]);
    firstPage.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  // Register fontkit
  pdfDoc.registerFontkit(fontkit);
  
  // By default, just use Helvetica
  const defaultFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  for (const field of fields) {
    const pdfWidth = firstPage.getWidth();
    const pdfHeight = firstPage.getHeight();

    // field.x and field.y are percentages (0-100) coming from the template editor
    const absX = (field.x / 100) * pdfWidth;
    const absY = (field.y / 100) * pdfHeight;

    if (field.type === 'qr') {
      const qrDataUrl = await QRCode.toDataURL(field.value, { margin: 0 });
      const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      
      const width = field.width || 100;
      const height = field.height || 100;
      
      firstPage.drawImage(qrImage, {
        x: absX - (width / 2),
        y: pdfHeight - absY - (height / 2),
        width,
        height,
      });
    } else {
      const color = hexToRgb(field.color || "#000000");
      const fontSize = field.fontSize || 24;
      let text = field.value || "";

      let font = defaultFont;
      if (field.fontFamily?.includes('Bold')) font = boldFont;
      if (field.fontFamily?.includes('Times')) font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      if (field.fontFamily?.includes('Courier')) font = await pdfDoc.embedFont(StandardFonts.Courier);
      
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      // Centered coordinates
      const finalX = absX - (textWidth / 2);
      // PDF Y is inverted. subtract half height to center, then add 1/4 height to adjust for baseline
      const finalY = pdfHeight - absY - (textHeight / 2) + (textHeight / 4);

      firstPage.drawText(text, {
        x: finalX,
        y: finalY,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Helper to generate a unique Certificate ID
 * Format: SLUG-YYYY-XXXXXXX
 */
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SLUG-${year}-${randomStr}`;
}
