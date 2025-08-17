import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "./rpc";
import type { CreateProfileCard, UpdateProfileCard, ProfileCard } from "../../../server/schemas";

// Hook para criar um novo profile card
export const useCreateProfileCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProfileCard) => {
      const response = await fetch('/api/profile-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar profile card');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate e refetch a lista de profile cards
      queryClient.invalidateQueries({ queryKey: ['profileCards'] });
    },
  });
};

// Hook para buscar um profile card por ID
export const useProfileCard = (id: string) => {
  return useQuery({
    queryKey: ['profileCard', id],
    queryFn: async () => {
      const response = await fetch(`/api/profile-cards/${id}`);
      
      if (!response.ok) {
        throw new Error('Profile card não encontrado');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
};

// Hook para listar profile cards
export const useProfileCards = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['profileCards', limit, offset],
    queryFn: async () => {
      const response = await fetch(`/api/profile-cards?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar profile cards');
      }
      
      return response.json();
    },
  });
};

// Hook para atualizar um profile card
export const useUpdateProfileCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProfileCard }) => {
      const response = await fetch(`/api/profile-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar profile card');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profileCard', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profileCards'] });
    },
  });
};

// Hook para deletar um profile card
export const useDeleteProfileCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/profile-cards/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao deletar profile card');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['profileCards'] });
    },
  });
};

// Função para gerar URL compartilhável
export const generateShareUrl = (cardId: string) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/profile/${cardId}`;
};

// Função para copiar link para clipboard
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Falha ao copiar para clipboard:', error);
    return false;
  }
};

// Função para gerar PDF do profile card
export const generatePDF = async (card: ProfileCard) => {
  try {
    // Importar jsPDF dinamicamente
    const { jsPDF } = await import('jspdf');
    
    // Criar novo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Configurar cores baseadas no tema
    const themeColors = {
      blue: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#DBEAFE' },
      purple: { primary: '#8B5CF6', secondary: '#6D28D9', accent: '#EDE9FE' },
      green: { primary: '#10B981', secondary: '#059669', accent: '#D1FAE5' },
      orange: { primary: '#F59E0B', secondary: '#D97706', accent: '#FEF3C7' },
      pink: { primary: '#EC4899', secondary: '#BE185D', accent: '#FCE7F3' }
    };

    const colors = themeColors[card.theme as keyof typeof themeColors] || themeColors.blue;

    // Adicionar fundo colorido
    doc.setFillColor(colors.accent);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Adicionar cabeçalho com gradiente
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Profile Card', pageWidth / 2, 25, { align: 'center' });

    // Nome da pessoa
    doc.setFontSize(18);
    doc.text(card.name, pageWidth / 2, 45, { align: 'center' });

    // Conteúdo principal
    let yPosition = 80;

    // Bio
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bio:', margin, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Quebrar bio em linhas
    const bioLines = doc.splitTextToSize(card.bio, pageWidth - 2 * margin);
    bioLines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 10;

    // Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Skills & Technologies:', margin, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Organizar skills em colunas
    const skillsPerLine = 3;
    const skillWidth = (pageWidth - 2 * margin) / skillsPerLine;
    
    card.skills.forEach((skill, index) => {
      const col = index % skillsPerLine;
      const row = Math.floor(index / skillsPerLine);
      const x = margin + (col * skillWidth);
      const y = yPosition + (row * 8);
      
      // Background do skill
      doc.setFillColor(colors.primary);
      doc.roundedRect(x, y - 3, skillWidth - 5, 6, 2, 2, 'F');
      
      // Texto do skill
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(skill, x + 2, y + 1);
    });

    yPosition += Math.ceil(card.skills.length / skillsPerLine) * 8 + 15;

    // Informações adicionais
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Informações:', margin, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Tema: ${card.theme}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Criado em: ${new Date(card.createdAt!).toLocaleDateString('pt-BR')}`, margin, yPosition);

    // Footer
    yPosition = pageHeight - 20;
    doc.setFillColor(colors.secondary);
    doc.rect(0, yPosition, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Gerado por CarrerPath - Plataforma de Desenvolvimento Profissional', pageWidth / 2, yPosition + 12, { align: 'center' });

    // Salvar PDF
    const fileName = `${card.name.replace(/[^a-zA-Z0-9]/g, '_')}-profile-card.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Falha ao gerar PDF:', error);
    return false;
  }
};
