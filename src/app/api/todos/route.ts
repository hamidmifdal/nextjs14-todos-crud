import { NextResponse } from 'next/server';
import { PrismaClient , Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET request (fetch all users)
export async function GET() {
  try {
    const users = await prisma.user.findMany(); // Fetch all users from the User model
    return NextResponse.json(users); // Return users as a JSON response
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

// Handle POST request (create a new user)
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the JSON body
    const { name, email } = body;

    // Check if both name and email are provided
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(newUser, { status: 201 }); // Return the created user
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 400 });
  }
}

// Handle DELETE request (delete a user by ID from the body)
export async function DELETE(request: Request) {
    try {
      const body = await request.json(); // Parse the request body
      const { id } = body;
  
      if (!id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
  
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
  
      return NextResponse.json(deletedUser, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
  }
  // Handle PUT request (update a user by ID)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    if (!id || (!name && !email)) {
      return NextResponse.json({ error: 'User ID and at least one field (name or email) are required' }, { status: 400 });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parsedId },
      data: {
        name: name || undefined,
        email: email || undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}