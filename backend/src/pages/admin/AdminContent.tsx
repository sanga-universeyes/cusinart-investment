import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  RefreshCw, 
  Globe,
  Edit,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

interface ContentItem {
  id: string;
  type: 'faq' | 'company' | 'terms' | 'privacy' | 'home';
  title: string;
  content: string;
  language: 'mg' | 'fr' | 'en';
  status: 'published' | 'draft';
  updatedAt: Date;
}

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<'faq' | 'company' | 'terms' | 'home'>('faq');
  const [selectedLanguage, setSelectedLanguage] = useState<'mg' | 'fr' | 'en'>('fr');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Mock content data
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 'faq_fr_1',
      type: 'faq',
      title: 'Comment créer un compte ?',
      content: `1. Allez sur le site : cuisinart-investa.com ou cliquez sur lien d'invitation.
2. Cliquez sur "S'inscrire".
3. Remplissez les champs requis (numéro téléphone WhatsApp, mot de passe, code d'invitation).
4. Cliquez sur "Créer mon compte" ou sur connecter s'il a déjà inscrit.
La page dirigera vers l'espace membre.`,
      language: 'fr',
      status: 'published',
      updatedAt: new Date()
    },
    {
      id: 'company_fr_1',
      type: 'company',
      title: 'À propos de Cuisinart Investa',
      content: `Cuisinart Investa est une plateforme d'investissement moderne qui permet à chacun de faire fructifier son argent de manière sécurisée et transparente.

Notre mission est de démocratiser l'investissement et de créer une communauté d'investisseurs prospères à Madagascar et dans l'océan Indien.`,
      language: 'fr',
      status: 'published',
      updatedAt: new Date()
    }
  ]);

  const [editorData, setEditorData] = useState({
    title: '',
    content: ''
  });

  const filteredContent = contentItems.filter(item => 
    item.type === activeTab && item.language === selectedLanguage
  );

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setEditorData({
      title: item.title,
      content: item.content
    });
    setShowEditor(true);
  };

  const handleSave = () => {
    if (!editorData.title || !editorData.content) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (editingItem) {
      // Modifier
      setContentItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, title: editorData.title, content: editorData.content, updatedAt: new Date() }
          : item
      ));
      toast.success('Contenu modifié avec succès');
    } else {
      // Créer
      const newItem: ContentItem = {
        id: `${activeTab}_${selectedLanguage}_${Date.now()}`,
        type: activeTab,
        title: editorData.title,
        content: editorData.content,
        language: selectedLanguage,
        status: 'published',
        updatedAt: new Date()
      };
      setContentItems(prev => [...prev, newItem]);
      toast.success('Contenu créé avec succès');
    }

    setShowEditor(false);
    setEditingItem(null);
    setEditorData({ title: '', content: '' });
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      setContentItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Contenu supprimé');
    }
  };

  const tabs = [
    { key: 'faq', label: 'FAQ', icon: FileText },
    { key: 'company', label: 'Entreprise', icon: Globe },
    { key: 'terms', label: 'CGU', icon: FileText },
    { key: 'home', label: 'Accueil', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pages & Contenus</h1>
          <p className="text-gray-600">Gestion du contenu multilingue</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
          >
            <option value="mg">🇲🇬 Malagasy</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇺🇸 English</option>
          </select>
          
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Contenu
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006B76] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Éditeur */}
      {showEditor && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {editingItem ? 'Modifier le Contenu' : 'Nouveau Contenu'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditor(false);
                setEditingItem(null);
                setEditorData({ title: '', content: '' });
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              label="Titre"
              value={editorData.title}
              onChange={(e) => setEditorData({...editorData, title: e.target.value})}
              placeholder="Titre du contenu"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                value={editorData.content}
                onChange={(e) => setEditorData({...editorData, content: e.target.value})}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76]"
                placeholder="Contenu détaillé..."
              />
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditor(false);
                  setEditingItem(null);
                  setEditorData({ title: '', content: '' });
                }}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des contenus */}
      <div className="space-y-4">
        {filteredContent.map(item => (
          <Card key={item.id} hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.content.substring(0, 150)}...
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="text-xs text-gray-500">
                    Modifié le {item.updatedAt.toLocaleDateString('fr-FR')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredContent.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun contenu pour cette section</p>
            <Button onClick={() => setShowEditor(true)} className="mt-4">
              Créer le premier contenu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}