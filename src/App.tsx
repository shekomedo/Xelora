import React, { useState } from 'react';
import { Screen } from './types';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DataCleaner } from './components/DataCleaner';
import { CostCalculator } from './components/CostCalculator';
import { Settings } from './components/Settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={() => setCurrentScreen('dashboard')} />;
  }

  return (
    <Layout currentScreen={currentScreen} setScreen={setCurrentScreen}>
      {currentScreen === 'dashboard' && <Dashboard setScreen={setCurrentScreen} />}
      {currentScreen === 'cleaner' && <DataCleaner />}
      {currentScreen === 'calculator' && <CostCalculator />}
      {currentScreen === 'settings' && <Settings />}
    </Layout>
  );
}
