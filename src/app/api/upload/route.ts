import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { File } from 'buffer'
import pdf from 'pdf-parse'
import { stripIndent, oneLine } from 'common-tags'

import { openAiClient } from '@/app/lib/openAIClient'
import { prisma } from '@/app/lib/prisma'
import pgvector from 'pgvector/utils'

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
  const pdfContent = await pdf(buffer)

  const strippedText = oneLine(stripIndent(pdfContent.text))
  const { numpages } = pdfContent
  const limiter = numpages / 3
  const sentences = strippedText.match(/[^.!?]+[.!?]+/g) || []
  const numSentences = sentences.length
  const sentencesPerBlock = Math.ceil(numSentences / limiter)

  const textBlocks = []

  let sentenceIndex = 0

  for (let i = 0; i < numSentences; i += sentencesPerBlock) {
    const blockSentences = sentences.slice(i, i + sentencesPerBlock)
    let block = blockSentences.join(' ')

    while (sentenceIndex < sentences.length && !block.endsWith('.')) {
      block += sentences[sentenceIndex++]
    }
    textBlocks.push(block)

    try {
      const embedding = await openAiClient.embeddings.create({
        model: 'text-embedding-ada-002',
        input: block,
      })

      const vector = embedding.data[0].embedding
      const vectorSql = pgvector.toSql(vector)

      await prisma.$executeRaw`INSERT INTO item (embedding, document) VALUES (${vectorSql}::vector, ${block})`
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return NextResponse.json({ success: true })
}
