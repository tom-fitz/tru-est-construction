import { NextResponse } from 'next/server';
import { createContactSubmission } from '@/lib/db-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create contact submission
    const submission = await createContactSubmission({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for contacting us! We will get back to you soon.',
        id: submission.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    );
  }
}

