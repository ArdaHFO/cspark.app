import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ 
      message: 'Trends suggest endpoint',
      status: 'success' 
    })
  } catch (error) {
    console.error('Trends suggest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({ 
      message: 'Trends suggest endpoint',
      data: body,
      status: 'success' 
    })
  } catch (error) {
    console.error('Trends suggest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}