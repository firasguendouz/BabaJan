import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import ItemList from './pages/Items/ItemScreen';
import Login from './pages/Auth/Login';
import MainLayout from './components/common/MainLayout';
import NotificationList from './pages/Notifications/NotificationList';
import OrderList from './pages/Orders/OrderList';
import PrivateRoute from './routes/PrivateRoute';
import PromotionList from './pages/Promotions/PromotionList';
import { ROUTES } from './routes';
import UserList from './pages/Users/UserList';

const App = () => (
  <Router>
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.USERS} element={<UserList />} />
        <Route path={ROUTES.ORDERS} element={<OrderList />} />
        <Route path={ROUTES.ITEMS} element={<ItemList />} />
        <Route path={ROUTES.PROMOTIONS} element={<PromotionList />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationList />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </Router>
);

export default App;
