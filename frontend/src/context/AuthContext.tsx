import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  profile: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) { //AuthProvider est un composant qui permet de gérer l'état de l'utilisateur connecté 
  const [user, setUser] = useState<User | null>(null); //user est un objet qui contient les informations de l'utilisateur connecté 

  function login(newUser: User) { //login est une fonction qui permet de connecter un utilisateur 
    setUser(newUser); //setUser est une fonction qui permet de mettre à jour l'utilisateur connecté 
  }

  function logout() { //logout est une fonction qui permet de déconnecter un utilisateur 
    setUser(null); //setUser est une fonction qui permet de mettre à jour l'utilisateur connecté 
  }

  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout }}> //AuthContext.Provider est un composant qui permet de fournir les données de l'utilisateur connecté à tous les composants enfants 
      {children} //children est un paramètre qui permet de spécifier les composants enfants 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}