import { useState } from 'react';
import RectangleApp from './rectangle';
import { SquareApp } from './square';

// activeTabに入るものはtypeで限定することで、間違いを防ぐ
// 使う場所が複数ならtypeと定義するし、今回のように１回しか使わないのであれば、直接書くし、状況に応じて
type PageType = 'square' | 'rectangle';
export function Root() {
  // activeTabに入るものはtypeで限定することで、間違いを防ぐ
  const [activeTab, setActiveTab] = useState<PageType>('square');
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
