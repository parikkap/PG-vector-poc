import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { File } from 'buffer'
import pdf from 'pdf-parse'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const FileSchema = z.instanceof(File)
  const file = FileSchema.parse(data.get('file') as unknown)

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ success: false, error: 'Invalid file' })
  }

  console.log(file)

  // Do something with the file...
  const fileBlob = await file.arrayBuffer()
  const buffer = Buffer.from(fileBlob)

  try {
    const pdfText = await pdf(buffer)
    console.log('PDF data:', pdfText)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error parsing PDF:', error)
    console.error('Failed to extract PDF text')
    return NextResponse.json({
      success: false,
      error: 'Failed to extract PDF text',
    })
  }
}
