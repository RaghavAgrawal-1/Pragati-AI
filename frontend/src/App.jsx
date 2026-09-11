import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <AppRoutes />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
