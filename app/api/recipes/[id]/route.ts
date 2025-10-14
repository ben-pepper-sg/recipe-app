import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const recipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  ingredientsText: z.string().optional(),
  instructionsText: z.string().min(1).max(5000),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (recipe.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = recipeSchema.parse(body);

    const [updatedRecipe] = await db
      .update(recipes)
      .set({
        title: data.title,
        description: data.description || null,
        ingredientsText: data.ingredientsText || null,
        instructionsText: data.instructionsText,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning();

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('Update recipe error:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}
