import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Play, Trash2, Calendar, Tag } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEntries } from '@/hooks/useEntries';
import { toast } from 'sonner';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { entries, deleteEntry } = useEntries();

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    
    const query = searchQuery.toLowerCase();
    return entries.filter(entry =>
      entry.description.toLowerCase().includes(query) ||
      entry.categories.some(cat => cat.toLowerCase().includes(query))
    );
  }, [entries, searchQuery]);

  const handlePlay = (entryId: string, audioUrl?: string) => {
    if (!audioUrl) {
      toast.info('No audio attached to this entry');
      return;
    }
    
    if (playingId === entryId) {
      setPlayingId(null);
    } else {
      setPlayingId(entryId);
      // Simulated playback - in real app, would play the audio
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId);
    toast.success('Entry deleted');
  };

  return (
    <AppLayout>
      <Header 
        title="Entry History" 
        subtitle={`${entries.length} total entries`}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="p-6">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No entries found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Start by recording your first entry'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <Card 
                key={entry.id} 
                className="shadow-card hover:shadow-elevated transition-shadow duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Play Button */}
                    <Button
                      variant={playingId === entry.id ? 'default' : 'outline'}
                      size="icon"
                      className="h-10 w-10 shrink-0"
                      onClick={() => handlePlay(entry.id, entry.audioUrl)}
                    >
                      <Play className={`h-4 w-4 ${playingId === entry.id ? 'animate-pulse' : ''}`} />
                    </Button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {format(new Date(entry.date), 'MMM d, yyyy • h:mm a')}
                        </span>
                        {entry.audioUrl && (
                          <Badge variant="secondary" className="text-xs">
                            Audio
                          </Badge>
                        )}
                      </div>

                      <p className="text-foreground leading-relaxed line-clamp-2 mb-3">
                        {entry.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        {entry.categories.map(category => (
                          <Badge 
                            key={category} 
                            variant="outline" 
                            className="text-xs font-normal"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
