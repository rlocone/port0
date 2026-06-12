import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'CV_Revised.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="James_Ortega_CV.pdf"',
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'PDF file not found' }, { status: 500 });
  }
}
