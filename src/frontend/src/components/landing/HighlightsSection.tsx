import { Card, CardContent } from '@/components/ui/card';
import { Upload, Grid3x3, Sparkles } from 'lucide-react';

export function HighlightsSection() {
  const highlights = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Drag and drop your photos or click to browse. Simple and fast.',
    },
    {
      icon: Grid3x3,
      title: 'Beautiful Gallery',
      description: 'View your photos in a stunning responsive grid layout.',
    },
    {
      icon: Sparkles,
      title: 'Preserve Memories',
      description: 'Keep your favorite moments safe and accessible anytime.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, elegant way to manage your photo collection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card key={index} className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-warm transition-shadow">
                  <CardContent className="pt-6 pb-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 shadow-warm">
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{highlight.title}</h3>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
