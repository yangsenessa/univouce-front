import { Navigate, RouteObject } from 'react-router-dom';
import EarnPage from '@/pages/earn';
import FriendsPage from '@/pages/friends';
import HomePage from '@/pages/home';
import SoundsPage from '@/pages/sounds';
import TasksPage from '@/pages/tasks';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/tasks',
    element: <TasksPage />,
  },
  {
    path: '/sounds',
    element: <SoundsPage />,
  },
  {
    path: '/earn',
    element: <EarnPage />,
  },
  {
    path: '/friends',
    element: <FriendsPage />,
  },
  // ...external,
  {
    path: '/*',
    element: <Navigate to="/" />,
  },
];

export default routes;
