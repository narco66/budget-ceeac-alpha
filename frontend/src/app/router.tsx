import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AuditPage } from '../pages/AuditPage'
import { BudgetPage } from '../pages/BudgetPage'
import { ClosurePage } from '../pages/ClosurePage'
import { CommitmentsPage } from '../pages/CommitmentsPage'
import { ContractsPage } from '../pages/ContractsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ExecutivePage } from '../pages/ExecutivePage'
import { DocumentsPage } from '../pages/DocumentsPage'
import { FindingsPage } from '../pages/FindingsPage'
import { ExercicePage } from '../pages/ExercicePage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { LiquidationsPage } from '../pages/LiquidationsPage'
import { MissingSourcePage } from '../pages/MissingSourcePage'
import { ModulePendingPage } from '../pages/ModulePendingPage'
import { NeedRequestsPage } from '../pages/NeedRequestsPage'
import { PartiesPage } from '../pages/PartiesPage'
import { OrganizationPage } from '../pages/OrganizationPage'
import { PaymentOrdersPage } from '../pages/PaymentOrdersPage'
import { PaymentsPage } from '../pages/PaymentsPage'
import { TasksPage } from '../pages/TasksPage'
import { UsersPage } from '../pages/UsersPage'
import { WelcomePage } from '../pages/WelcomePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="executif" element={<ExecutivePage />} />
        <Route path="taches" element={<TasksPage />} />
        <Route path="referentiel" element={<OrganizationPage />} />
        <Route path="exercice" element={<ExercicePage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="expressions-besoin" element={<NeedRequestsPage />} />
        <Route path="engagements" element={<CommitmentsPage />} />
        <Route path="liquidations" element={<LiquidationsPage />} />
        <Route path="ordonnancements" element={<PaymentOrdersPage />} />
        <Route path="paiements" element={<PaymentsPage />} />
        <Route path="tiers" element={<PartiesPage />} />
        <Route path="marches" element={<ContractsPage />} />
        <Route path="ged" element={<DocumentsPage />} />
        <Route path="controle" element={<FindingsPage />} />
        <Route path="cloture" element={<ClosurePage />} />
        <Route
          path="gantt"
          element={
            <MissingSourcePage
              title="Gantt d’exécution"
              description="La chaîne programme, action, activité et tâche GAR/RBM n’est pas importée. Aucune barre de planning n’est dessinée."
            />
          }
        />
        <Route
          path="suivi-evaluation"
          element={
            <MissingSourcePage
              title="Suivi-évaluation"
              description="Les indicateurs, cibles et réalisations physiques ne sont pas chargés. Aucun taux d’exécution n’est calculé."
            />
          }
        />
        <Route path="utilisateurs" element={<UsersPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path=":moduleId" element={<ModulePendingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
