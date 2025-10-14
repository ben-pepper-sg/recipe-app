import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';

export default async function NewRecipePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Recipe</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeForm userId={session.user.id} />
      </main>
    </div>
  );
}
