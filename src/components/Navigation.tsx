import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Plus, Settings, LogOut, User, Crown } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SmartLinks</span>
          </Link>

          {/* Navigation centrale */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Plus className="h-4 w-4 mr-2" />
                Créer un lien
              </Button>
            </Link>
            {user?.is_superadmin && (
              <Link to="/admin">
                <Button variant="ghost" className="text-yellow-600 hover:text-yellow-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Administration
                </Button>
              </Link>
            )}
          </div>

          {/* Menu utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Bouton de création rapide sur mobile */}
            <Link to="/create" className="md:hidden">
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>

            {/* Menu dropdown utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user ? getUserInitials(user.username) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.username}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/create" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Créer un lien</span>
                  </Link>
                </DropdownMenuItem>
                {user?.is_superadmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer text-yellow-600 focus:text-yellow-600">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Administration</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
