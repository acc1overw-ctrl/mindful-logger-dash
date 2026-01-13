import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, Check } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { AudioRecorder } from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEntries } from '@/hooks/useEntries';
import { useAuth } from '@/hooks/useAuth';
import { LIFESTYLE_CATEGORIES } from '@/types/entry';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Record() {
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>();
  const [audioFileName, setAudioFileName] = useState<string>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { addEntry } = useEntries();
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    if (!description.trim()) {
      toast.error('Please add a description');
      return;
    }
    
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 600));

    addEntry({
      description,
      audioUrl,
      audioFileName,
      categories: selectedCategories,
      agentId: user?.id || 'unknown',
    });

    toast.success('Entry saved successfully!');
    
    // Reset form
    setDescription('');
    setAudioUrl(undefined);
    setAudioFileName(undefined);
    setSelectedCategories([]);
    setIsSaving(false);

    // Optionally navigate to history
    navigate('/history');
  };

  return (
    <AppLayout>
      <Header 
        title="Record Entry" 
        subtitle="Capture customer lifestyle choices and preferences"
      />
      
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="shadow-card animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">New Lifestyle Entry</CardTitle>
            <CardDescription>
              Record audio notes and summarize the customer's lifestyle choices
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Audio Section */}
            <div className="space-y-3">
              <Label className="text-base">Audio Recording</Label>
              <AudioRecorder
                onAudioReady={(url, fileName) => {
                  setAudioUrl(url);
                  setAudioFileName(fileName);
                }}
                audioUrl={audioUrl}
                onClear={() => {
                  setAudioUrl(undefined);
                  setAudioFileName(undefined);
                }}
              />
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base">
                Life Choices Description
              </Label>
              <Textarea
                id="description"
                placeholder="Summarize the customer's lifestyle choices, preferences, and key insights from the conversation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[180px] resize-none text-base leading-relaxed"
              />
            </div>

            {/* Categories Section */}
            <div className="space-y-3">
              <Label className="text-base">Lifestyle Categories</Label>
              <div className="flex flex-wrap gap-2">
                {LIFESTYLE_CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <Badge
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200 px-3 py-1.5 text-sm",
                        isSelected 
                          ? "bg-primary hover:bg-primary/90" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => toggleCategory(category)}
                    >
                      {isSelected && <Check className="h-3 w-3 mr-1" />}
                      {category}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleSave}
                disabled={isSaving || !description.trim()}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Entry</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
