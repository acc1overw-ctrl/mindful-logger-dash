import { Download } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const reports = [
  {
    title: 'Q4 2025 Lifestyle Trends Report',
    description: 'A comprehensive analysis of customer lifestyle choices and category trends from the fourth quarter of 2025.',
    pdfUrl: '/reports/q4-2025-trends.pdf',
  },
  {
    title: 'Annual Customer Persona Analysis 2025',
    description: 'In-depth breakdown of customer personas based on a full year of lifestyle data, identifying key demographic and behavioral shifts.',
    pdfUrl: '/reports/annual-personas-2025.pdf',
  },
  {
    title: 'Product-Market Fit for "Wellness" Category',
    description: 'An investigation into the "Wellness" category, its most associated sub-categories, and opportunities for new product alignment.',
    pdfUrl: '/reports/wellness-pmf-2025.pdf',
  },
    {
    title: 'Emerging Millennial and Gen Z Habits',
    description: 'A special report focusing on the evolving lifestyle habits and preferences of Millennial and Gen Z customers.',
    pdfUrl: '/reports/millennial-genz-habits-2025.pdf',
  },
];

export default function Analytics() {
  return (
    <AppLayout>
      <Header 
        title="Analytic Reports" 
        subtitle="Download from our library of AI-powered insights"
      />
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="shadow-card animate-fade-in flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <a href={report.pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
