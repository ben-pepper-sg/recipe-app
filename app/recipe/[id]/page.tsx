import { db } from '@/lib/db';
import { recipes, users } from '@/lib/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, params.id),
  });

  if (!recipe) {
    notFound();
  }

  const author = await db.query.users.findFirst({
    where: eq(users.id, recipe.createdBy),
  });

  const ingredients = recipe.ingredientsText?.split('\n').filter(Boolean) || [];
  const instructions = recipe.instructionsText?.split('\n').filter(Boolean) || [];

  const canEdit = session?.user.id === recipe.createdBy;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
            ← Back to recipes
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
              <div className="text-sm text-gray-500">
                <p>Created by {author?.name || author?.email}</p>
                <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
                {recipe.updatedAt.getTime() !== recipe.createdAt.getTime() && (
                  <p>Updated {new Date(recipe.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            {canEdit && (
              <Link
                href={`/recipe/${recipe.id}/edit`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit
              </Link>
            )}
          </div>

          {recipe.description && (
            <p className="text-lg text-gray-700 mb-8">{recipe.description}</p>
          )}

          {ingredients.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 text-lg">
                    • {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700 text-lg">
                  <span className="font-semibold">{index + 1}.</span> {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
