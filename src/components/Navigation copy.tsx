import { Button } from "./ui/button";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'principles', label: 'UX Principles' },
    { id: 'patterns', label: 'Pattern Repository' },
    { id: 'generator', label: 'Recommendations' },
    { id: 'community', label: 'Community' },
    { id: 'resources', label: 'Technical Resources' }
  ];

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">UX Repository</h1>
            <p className="text-muted-foreground">Educational Platform</p>
          </div>
          
          <nav className="flex space-x-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                onClick={() => onSectionChange(section.id)}
                className="text-sm"
              >
                {section.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}