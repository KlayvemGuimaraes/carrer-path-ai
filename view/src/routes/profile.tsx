import React from 'react';
import { createRoute, type RootRoute, useParams } from '@tanstack/react-router';
import { ProfileCardComponent } from '../components/ProfileCard';
import { useProfileCard } from '../lib/profileCard';
import { Button } from '../components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from '@tanstack/react-router';

function ProfileCardViewPage() {
  const { id } = useParams({ from: '/profile/$id' });
  const { data, isLoading, error, refetch } = useProfileCard(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando profile card...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.success || !data.card) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Card não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            {error?.message || 'O profile card que você está procurando não existe ou foi removido.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
            <Link to="/profile-cards">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <ArrowLeft className="w-4 h-4" />
                Ver Todos os Cards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = data.card;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/profile-cards">
            <Button variant="ghost" className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Profile Cards
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Card de {card.name}
          </h1>
          <p className="text-gray-600">
            Card compartilhável criado em {new Date(card.createdAt!).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Profile Card */}
        <div className="flex justify-center">
          <ProfileCardComponent
            card={card}
            isPreview={true}
          />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-gray-600">
              Compartilhado via CarrerPath
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* SEO Meta */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Este é um profile card compartilhável criado na plataforma CarrerPath.
            Para criar seu próprio card, acesse{' '}
            <Link to="/profile-cards" className="text-blue-600 hover:underline">
              /profile-cards
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Export function that creates the route
export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/profile/$id",
    component: ProfileCardViewPage,
    getParentRoute: () => parentRoute,
  });
