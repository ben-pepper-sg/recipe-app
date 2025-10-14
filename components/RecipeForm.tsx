'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RecipeFormProps {
  userId: string;
  initialData?: {
    id: string;
    title: string;
    description?: string;
    ingredientsText?: string;
    instructionsText: string;
  };
}

export default function RecipeForm({ userId, initialData }: RecipeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredientsText || '');
  const [instructions, setInstructions] = useState(initialData?.instructionsText || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title.trim() || !instructions.trim()) {
      setError('Title and instructions are required');
      setLoading(false);
      return;
    }

    try {
      const url = initialData ? `/api/recipes/${initialData.id}` : '/api/recipes';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          ingredientsText: ingredients,
          instructionsText: instructions,
          createdBy: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save recipe');
      } else {
        router.push(`/recipe/${data.id}`);
        router.refresh();
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Title *
        </label>
        <input
          id="title"
          type="text"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          placeholder="e.g., Chocolate Chip Cookies"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          placeholder="A brief description of your recipe"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
          Ingredients (optional, one per line)
        </label>
        <textarea
          id="ingredients"
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-mono"
          placeholder={'1 cup flour\n2 eggs\n1/2 cup sugar\n1 tsp vanilla extract'}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-500">Enter each ingredient on a new line</p>
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
          Instructions *
        </label>
        <textarea
          id="instructions"
          rows={10}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-mono"
          placeholder={'Preheat oven to 350°F\nMix dry ingredients together\nAdd wet ingredients and stir\nBake for 12 minutes'}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-500">Enter each step on a new line</p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Saving...' : initialData ? 'Update Recipe' : 'Save Recipe'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
