import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import bgPng from '@/assets/bg.png';
import routes from '@/routes';
import './App.css';
import { Tabbar } from './components/tabbar';

function App() {
  // 初始化路由
  const views = useRoutes(routes);
  const navigate = useNavigate();
  const location = useLocation();
  // const minH = WebApp.viewportHeight;
  const noBackBtnLinks = ['/', '/tasks', '/sounds', '/earn', '/friends'];

  useEffect(() => {
    // Google Analytics
    console.log('location', location);
    if (!noBackBtnLinks.includes(location.pathname)) {
      WebApp.BackButton.show();
    } else {
      WebApp.BackButton.hide();
    }
  }, [location]);

  WebApp.onEvent('backButtonClicked', () => {
    navigate(-1);
  });

  return (
    <div style={{ height: 'var(--tg-viewport-height)' }} className={`relative overflow-hidden`}>
      <img
        src={bgPng}
        alt="bg"
        style={{ height: `var(--tg-viewport-height)` }}
        className="absolute z-0 w-full"
      />
      <div
        style={{ height: 'var(--tg-viewport-height)' }}
        className={`relative z-10 overflow-auto`}
      >
        {views}

        <Tabbar />
      </div>
    </div>
  );
}

export default App;
