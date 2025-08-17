import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Upload, User } from 'lucide-react';
import { useCreateProfileCard, useUpdateProfileCard } from '../lib/profileCard';
import type { ProfileCard } from '../../../server/schemas';

interface ProfileCardFormProps {
  card?: ProfileCard;
  onSuccess: (card: ProfileCard) => void;
  onCancel: () => void;
}

export function ProfileCardForm({ card, onSuccess, onCancel }: ProfileCardFormProps) {
  const [name, setName] = useState(card?.name || '');
  const [bio, setBio] = useState(card?.bio || '');
  const [profileImageUrl, setProfileImageUrl] = useState(card?.profileImage || '');
  const [skills, setSkills] = useState<string[]>(card?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [theme, setTheme] = useState<'blue' | 'purple' | 'green' | 'orange' | 'pink'>(card?.theme || 'blue');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateProfileCard();
  const updateMutation = useUpdateProfileCard();

  const handleAddSkill = () => {
    if (newSkill.trim() && skills.length < 10) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      setUploadedImage(file);
      setProfileImageUrl(''); // Limpar URL quando uploadar arquivo
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (!bio.trim()) {
      alert('Bio é obrigatória');
      return;
    }

    if (skills.length === 0) {
      alert('Adicione pelo menos uma skill');
      return;
    }

    try {
      let finalImageUrl = profileImageUrl;

      // Se há um arquivo uploadado, converter para base64
      if (uploadedImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          finalImageUrl = e.target?.result as string;
          submitForm(finalImageUrl);
        };
        reader.readAsDataURL(uploadedImage);
      } else {
        submitForm(finalImageUrl);
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem. Tente novamente.');
    }
  };

  const submitForm = async (imageUrl: string) => {
    const formData = {
      name: name.trim(),
      bio: bio.trim(),
      profileImage: imageUrl,
      skills,
      theme,
    };

    try {
      if (card?.id) {
        const result = await updateMutation.mutateAsync({
          id: card.id,
          updates: formData,
        });
        onSuccess(result.card);
      } else {
        const result = await createMutation.mutateAsync(formData);
        onSuccess(result.card);
      }
    } catch (error) {
      console.error('Erro ao salvar card:', error);
      alert('Erro ao salvar card. Tente novamente.');
    }
  };

  const themes = [
    { id: 'blue', name: 'Azul', color: 'bg-blue-500' },
    { id: 'purple', name: 'Roxo', color: 'bg-purple-500' },
    { id: 'green', name: 'Verde', color: 'bg-green-500' },
    { id: 'orange', name: 'Laranja', color: 'bg-orange-500' },
    { id: 'pink', name: 'Rosa', color: 'bg-pink-500' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5" />
              {card ? 'Editar Profile Card' : 'Criar Profile Card'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo ou Apelido *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  maxLength={100}
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio Curta *</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Uma breve descrição sobre você (máx. 200 caracteres)"
                  maxLength={200}
                  rows={3}
                  required
                />
                <div className="text-sm text-gray-500 text-right">
                  {bio.length}/200
                </div>
              </div>

              {/* Foto de Perfil */}
              <div className="space-y-4">
                <Label>Foto de Perfil</Label>
                
                {/* Upload de arquivo */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Escolher arquivo
                    </Button>
                    <span className="text-sm text-gray-500">ou</span>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {uploadedImage && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm flex-1">{uploadedImage.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedImage(null);
                          setImagePreview('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* URL da imagem */}
                <div className="space-y-2">
                  <Input
                    value={profileImageUrl}
                    onChange={(e) => {
                      setProfileImageUrl(e.target.value);
                      if (e.target.value) {
                        setUploadedImage(null);
                        setImagePreview('');
                      }
                    }}
                    placeholder="https://exemplo.com/foto.jpg"
                    disabled={!!uploadedImage}
                  />
                  <p className="text-sm text-gray-500">
                    Cole a URL de uma imagem de perfil (opcional)
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Adicionar skill (ex: React, Node.js)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    disabled={skills.length >= 10}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim() || skills.length >= 10}
                    className="px-4"
                  >
                    +
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {skills.length}/10 skills (máximo)
                </div>
                
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Tema */}
              <div className="space-y-3">
                <Label>Tema do Card</Label>
                <div className="grid grid-cols-5 gap-3">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      type="button"
                      onClick={() => setTheme(themeOption.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        theme === themeOption.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded ${themeOption.color}`}></div>
                      <span className="text-xs font-medium">{themeOption.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </div>
                  ) : (
                    card ? 'Atualizar Card' : 'Criar Card'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
