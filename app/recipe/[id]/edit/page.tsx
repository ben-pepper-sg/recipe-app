import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import RecipeForm from '@/components/RecipeForm';

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
  });

  if (!recipe) {
    notFound();
  }

  if (recipe.createdBy !== session.user.id) {
    redirect(`/recipe/${id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeForm
          userId={session.user.id}
          initialData={{
            id: recipe.id,
            title: recipe.title,
            description: recipe.description || undefined,
            ingredientsText: recipe.ingredientsText || undefined,
            instructionsText: recipe.instructionsText,
          }}
        />
      </main>
    </div>
  );
}
