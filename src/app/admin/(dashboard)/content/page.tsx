'use client';

import { useEffect, useState, useCallback } from 'react';
import { Save, FileText, Settings, Image, Globe } from 'lucide-react';
import { contentApi } from '@/lib/api';

interface ContentBlock {
  id: string;
  key: string;
  section: string;
  title?: string;
  content?: string;
  metadata?: Record<string, any>;
}

interface ContentSection {
  name: string;
  icon: React.ElementType;
  items: ContentBlock[];
}

export default function ContentPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [editedContent, setEditedContent] = useState<Record<string, ContentBlock>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await contentApi.getAll();
      
      // Group content by section
      const grouped: Record<string, ContentBlock[]> = {};
      data.forEach((item: ContentBlock) => {
        if (!grouped[item.section]) {
          grouped[item.section] = [];
        }
        grouped[item.section].push(item);
      });

      // Create sections with icons
      const sectionConfig: Record<string, { name: string; icon: React.ElementType }> = {
        hero: { name: 'Hero Section', icon: Image },
        about: { name: 'About Section', icon: FileText },
        services: { name: 'Services', icon: Settings },
        contact: { name: 'Contact Info', icon: Globe },
        footer: { name: 'Footer', icon: FileText },
        seo: { name: 'SEO Settings', icon: Settings },
      };

      const formattedSections = Object.entries(grouped).map(([key, items]) => ({
        name: sectionConfig[key]?.name || key,
        icon: sectionConfig[key]?.icon || FileText,
        items,
      }));

      setSections(formattedSections);
      
      // Initialize edited content
      const initial: Record<string, ContentBlock> = {};
      data.forEach((item: ContentBlock) => {
        initial[item.key] = item;
      });
      setEditedContent(initial);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleContentChange = (key: string, field: 'title' | 'content', value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleMetadataChange = (key: string, metaKey: string, value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        metadata: {
          ...prev[key]?.metadata,
          [metaKey]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const updates = Object.values(editedContent).map((content) =>
        contentApi.update(content.key, {
          title: content.title,
          content: content.content,
          metadata: content.metadata,
        })
      );
      
      await Promise.all(updates);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentSection = sections.find((s) => s.name.toLowerCase().includes(activeSection)) || sections[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Content Management</h1>
          <p className="text-slate-600">Edit website content and settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
            saveStatus === 'success'
              ? 'bg-green-600 text-white'
              : saveStatus === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50`}
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error!' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Sections
            </h2>
            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = section.name.toLowerCase().includes(activeSection);
                return (
                  <button
                    key={section.name}
                    onClick={() => setActiveSection(section.name.split(' ')[0].toLowerCase())}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Editor */}
        <div className="lg:col-span-3 space-y-4">
          {currentSection?.items.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  {item.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                  {item.section}
                </span>
              </div>

              {/* Title field if applicable */}
              {item.title !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedContent[item.key]?.title || ''}
                    onChange={(e) => handleContentChange(item.key, 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Content field */}
              {item.content !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editedContent[item.key]?.content || ''}
                    onChange={(e) => handleContentChange(item.key, 'content', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Metadata fields */}
              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Additional Settings
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(item.metadata).map(([metaKey, metaValue]) => (
                      <div key={metaKey}>
                        <label className="block text-xs text-slate-500 mb-1">
                          {metaKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          value={editedContent[item.key]?.metadata?.[metaKey] || ''}
                          onChange={(e) => handleMetadataChange(item.key, metaKey, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!currentSection || currentSection.items.length === 0) && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">No content blocks found</h3>
              <p className="text-slate-500 mt-1">
                Content blocks for this section haven&apos;t been created yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
