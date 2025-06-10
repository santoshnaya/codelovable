import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { GeneratedFile } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { files, projectName } = body as { files: GeneratedFile[]; projectName: string }

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: 'Files array is required' },
        { status: 400 }
      )
    }

    // Create ZIP file
    const zip = new JSZip()
    
    // Add each file to the ZIP
    files.forEach((file) => {
      zip.file(file.path, file.content)
    })

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName || 'project'}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error creating ZIP file:', error)
    return NextResponse.json(
      { error: 'Failed to create ZIP file' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}