
import React from 'react';
import Dashboard from '@/components/Dashboard';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">StockPredict</h1>
              <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">BETA</span>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="text-foreground hover:text-primary">Dashboard</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Analysis</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Portfolio</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Market News</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="py-6">
        <Dashboard />
      </main>
      
      <footer className="bg-card border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground text-sm">
            <p>StockPredict &copy; 2025 | Disclaimer: This application is for demonstration purposes only.</p>
            <p className="mt-1">Stock Price predictions Project developed by SCET </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
