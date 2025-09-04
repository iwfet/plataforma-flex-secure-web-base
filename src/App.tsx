
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {TooltipProvider} from "@/components/ui/tooltip";
import {AuthProvider} from "./contexts/AuthContext";
import {PrivateRoute, PublicRoute} from "./components/PrivateRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import {LoadingProvider} from "./contexts/LoadingContext";
import {useState} from "react";
import {MessageProvider} from "@/contexts/MessageContext.tsx";
import GlobalLoadingIndicator from "@/components/GlobalLoadingIndicator.tsx";
import { useAuth } from "./contexts/AuthContext";
import { getPrivateRoutes } from "./config/routes";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Profile from "@/pages/Profile";
import { PUBLIC_ROUTES } from "@/constants/routes";
import TelasGerenciamento from "@/pages/TelasGerenciamento";
import UsersManagement from "@/pages/UsersManagement";
import ChangePassword from "@/pages/ChangePassword";
import DeviceSessions from "@/pages/DeviceSessions";
import PapeisManagement from "@/pages/PapeisManagement";
import NovoPapel from "@/pages/NovoPapel";
import EditarPapel from "@/pages/EditarPapel";

const AppRoutes = () => {
    const { user } = useAuth();
    const privateRoutes = user ? getPrivateRoutes(user.telasPermitidas) : [];

    return (
        <div className="flex min-h-screen w-full">
            {user && <AppSidebar />}
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Navigate to="/login" replace/>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login/>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <PublicRoute>
                                <ForgotPassword/>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/reset-password/:token"
                        element={
                            <PublicRoute>
                                <ResetPassword/>
                            </PublicRoute>
                        }
                    />

                    {privateRoutes.map(route => {
                        const RouteComponent = route.component;
                        return (
                            <Route
                                key={`route-${route.id}-${route.path}`}
                                path={route.path}
                                element={
                                    <PrivateRoute>
                                        <RouteComponent />
                                    </PrivateRoute>
                                }
                            />
                        );
                    })}

                    {PUBLIC_ROUTES.map(route =>
                        (
                        <Route
                            key={`public-${route.id}-${route.path}`}
                            path={route.path}
                            element={
                                <PrivateRoute>
                                    {route.path === '/profile' ? <Profile /> :<div>{route.nomeTela}</div>}
                                </PrivateRoute>
                            }
                        />
                    ))}
                    
         
                    {/* Papéis (Roles) Routes
                    <Route path="/papeis" element={<PrivateRoute><PapeisManagement /></PrivateRoute>} />
                    <Route path="/papeis/novo" element={<PrivateRoute><NovoPapel /></PrivateRoute>} />
                    <Route path="/papeis/:id" element={<PrivateRoute><EditarPapel /></PrivateRoute>} /> */}

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
        </div>
    );
};

const App = () => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                refetchOnWindowFocus: false,
                staleTime: 5 * 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LoadingProvider>
                    <MessageProvider>
                        <GlobalLoadingIndicator/>
                        <AuthProvider>
                            <TooltipProvider>
                                <SidebarProvider>
                                    <AppRoutes />
                                </SidebarProvider>
                            </TooltipProvider>
                        </AuthProvider>
                    </MessageProvider>
                </LoadingProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
