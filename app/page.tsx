import { db } from '@/lib/db';
import { recipes, users } from '@/lib/db/schema';
import { auth } from '@/auth';
import { desc, eq, like } from 'drizzle-orm';
import Link from 'next/link';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await auth();
  const { search } = await searchParams;
  const searchQuery = search || '';

  const allRecipes = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      createdAt: recipes.createdAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(recipes)
    .leftJoin(users, eq(recipes.createdBy, users.id))
    .where(searchQuery ? like(recipes.title, `%${searchQuery}%`) : undefined)
    .orderBy(desc(recipes.createdAt));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Recipe Collection</h1>
            <div className="flex gap-4">
              {session ? (
                <>
                  <span className="text-gray-600">
                    {session.user.name || session.user.email}
                  </span>
                  <form action="/api/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex gap-4 items-center">
          <form className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search recipes..."
              defaultValue={searchQuery}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </form>
          {session ? (
            <Link
              href="/new"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg"
            >
              Add Recipe
            </Link>
          ) : (
            <div className="px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-md cursor-not-allowed text-lg">
              Add Recipe
            </div>
          )}
        </div>

        {allRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? 'No recipes found matching your search.'
                : 'No recipes yet. Be the first to add one!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.title}
                </h2>
                {recipe.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  <p>By {recipe.authorName || recipe.authorEmail}</p>
                  <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
