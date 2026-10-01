import * as xlsx from "xlsx";

export interface ParsedParticipant {
  fullName: string;
  email: string;
  [key: string]: any; // Allow custom mapped fields
}

/**
 * Parses an uploaded Excel or CSV file buffer and returns raw rows
 */
export async function parseExcelBuffer(buffer: Buffer): Promise<any[]> {
  try {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to array of objects
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    return jsonData;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw new Error("Failed to parse the uploaded file. Please ensure it is a valid Excel or CSV file.");
  }
}

/**
 * Validates mapped data
 */
export function validateMappedData(data: any[], emailColumn: string, nameColumn: string): { valid: ParsedParticipant[], errors: any[] } {
  const valid: ParsedParticipant[] = [];
  const errors: any[] = [];
  const seenEmails = new Set<string>();

  data.forEach((row, index) => {
    const email = row[emailColumn]?.toString().trim();
    const fullName = row[nameColumn]?.toString().trim();

    if (!email) {
      errors.push({ row: index + 2, error: "Missing Email", data: row });
      return;
    }

    if (!fullName) {
      errors.push({ row: index + 2, error: "Missing Name", data: row });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ row: index + 2, error: "Invalid Email Format", data: row });
      return;
    }

    if (seenEmails.has(email)) {
      errors.push({ row: index + 2, error: "Duplicate Email in file", data: row });
      return;
    }

    seenEmails.add(email);

    // If all good, push to valid, spreading the rest of the row data
    valid.push({
      ...row,
      fullName,
      email,
    });
  });

  return { valid, errors };
}
