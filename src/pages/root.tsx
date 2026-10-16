import { useState } from 'react';
import SquareApp from './square/main.tsx';
import RectangleApp from './rectangle/main.tsx';

export function Root() {
  const [activeTab, setActiveTab] = useState('square');
  return (
    <div>
      <button onClick={() => setActiveTab('square')}>Square</button>
      <button onClick={() => setActiveTab('rectangle')}>Rectangle</button>

      <div>
        {activeTab === 'square' && <SquareApp />}
        {activeTab === 'rectangle' && <RectangleApp />}
      </div>
    </div>
  );
}
