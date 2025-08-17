import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Copy, Download, Share2, Edit, Trash2 } from 'lucide-react';
import { generateShareUrl, copyToClipboard, generatePDF } from '../lib/profileCard';
import type { ProfileCard } from '../../../server/schemas';

interface ProfileCardProps {
  card: ProfileCard;
  onEdit?: () => void;
  onDelete?: () => void;
  isPreview?: boolean;
}

const themeColors = {
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
  },
  orange: {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
  },
  pink: {
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800',
  },
};

export const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  card,
  onEdit,
  onDelete,
  isPreview = false,
}) => {
  const colors = themeColors[card.theme as keyof typeof themeColors] || themeColors.blue;

  const handleCopyLink = async () => {
    const shareUrl = generateShareUrl(card.id!);
    const success = await copyToClipboard(shareUrl);
    if (success) {
      // Mostrar toast de sucesso
      console.log('Link copiado!');
    }
  };

  const handleDownloadPDF = async () => {
    await generatePDF(card);
  };

  const handleShare = () => {
    const shareUrl = generateShareUrl(card.id!);
    if (navigator.share) {
      navigator.share({
        title: `${card.name} - Profile Card`,
        text: card.bio,
        url: shareUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${colors.bg} ${colors.border} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardHeader className="relative pb-4">
        {/* Header com gradiente */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-10 rounded-t-lg`} />
        
        <div className="relative z-10 flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-4 border-white dark:border-gray-800 shadow-lg">
            <AvatarImage src={card.profileImage} alt={card.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
              {card.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {card.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {card.bio}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Skills & Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {card.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`bg-gradient-to-r ${colors.gradient} text-white border-0 px-3 py-1 text-xs font-medium`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        {!isPreview && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Link
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
            
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onDelete}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
