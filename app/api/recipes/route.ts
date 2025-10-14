import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { auth } from '@/auth';
import { z } from 'zod';

const recipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  ingredientsText: z.string().optional(),
  instructionsText: z.string().min(1).max(5000),
  createdBy: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = recipeSchema.parse(body);

    if (data.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [recipe] = await db
      .insert(recipes)
      .values({
        title: data.title,
        description: data.description || null,
        ingredientsText: data.ingredientsText || null,
        instructionsText: data.instructionsText,
        createdBy: data.createdBy,
      })
      .returning();

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('Create recipe error:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
