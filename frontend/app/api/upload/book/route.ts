import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

const MAX_BYTES = 25 * 1024 * 1024; // 25MB
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.epub', '.txt', '.doc', '.docx', '.rtf', '.mobi']);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'file is required' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: 'File too large (max 25MB)' }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ message: 'Only book document files are allowed' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'books');
  await fs.mkdir(uploadsDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}-${safeName}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.writeFile(filepath, bytes);

  return NextResponse.json({ url: `/uploads/books/${filename}` }, { status: 201 });
}
