import React, { useState } from 'react';
import { createRoute, type RootRoute } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { ProfileCardComponent } from '../components/ProfileCard';
import { ProfileCardForm } from '../components/ProfileCardForm';
import { useProfileCards, useDeleteProfileCard } from '../lib/profileCard';
import type { ProfileCard } from '../../../server/schemas';

function ProfileCardsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<ProfileCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: profileCardsData, isLoading, error } = useProfileCards();
  const deleteMutation = useDeleteProfileCard();

  const profileCards = profileCardsData?.cards || [];
  const filteredCards = profileCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateSuccess = (card: ProfileCard) => {
    setShowForm(false);
    // Reset form state
  };

  const handleEditSuccess = (card: ProfileCard) => {
    setEditingCard(null);
    // Reset form state
  };

  const handleEdit = (card: ProfileCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleDelete = async (card: ProfileCard) => {
    if (confirm(`Tem certeza que deseja deletar o card de ${card.name}?`)) {
      try {
        await deleteMutation.mutateAsync(card.id!);
      } catch (error) {
        console.error('Erro ao deletar card:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando profile cards...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar profile cards: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Cards
          </h1>
          <p className="text-gray-600">
            Crie e gerencie seus cards de perfil compartilháveis
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome, bio ou skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              {viewMode === 'grid' ? 'Lista' : 'Grid'}
            </Button>

            <Button
              onClick={() => {
                setEditingCard(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              Novo Card
            </Button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <ProfileCardForm
            card={editingCard || undefined}
            onSuccess={editingCard ? handleEditSuccess : handleCreateSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingCard(null);
            }}
          />
        )}

        {/* Cards Grid/List */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum profile card encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente ajustar sua busca ou' : 'Comece criando seu primeiro profile card'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Card
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredCards.map((card) => (
              <div key={card.id} className={viewMode === 'list' ? 'flex gap-4' : ''}>
                <ProfileCardComponent
                  card={card}
                  onEdit={() => handleEdit(card)}
                  onDelete={() => handleDelete(card)}
                  isPreview={false}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {profileCards.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {filteredCards.length} de {profileCards.length} cards
                {searchTerm && ` (filtrados por "${searchTerm}")`}
              </span>
              <span className="text-sm text-gray-600">
                Total de skills: {profileCards.reduce((acc, card) => acc + card.skills.length, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export function that creates the route
export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/profile-cards",
    component: ProfileCardsPage,
    getParentRoute: () => parentRoute,
  });
