import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GlobalPopupProvider } from './context/GlobalPopupContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PlantsPage from './pages/PlantsPage'
import UsersPage from './pages/UsersPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'

function App() {
  return (
    <GlobalPopupProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="plants" element={<PlantsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/:id" element={<ArticleDetailPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GlobalPopupProvider>
  )
}

export default App
