import { useState, createContext, useEffect, useCallback, useMemo } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem('@Notas')

      if (storageUser) {
        setUser(JSON.parse(storageUser))
        setLoading(false);
      }

      setLoading(false);
    }

    loadUser();
  }, [])

  const Entrar = useCallback(async (email, senha) => {
    setLoadingAuth(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const value = userCredential.user;
      let uid = value.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      let data = {
        uid: uid,
        nome: docSnap.data().nome,
        email: value.email,
        avatarUrl: docSnap.data().avatarUrl
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success("Bem-vindo(a) de volta!")
      navigate("/dashboard")
    } catch (error) {
      console.log(error);
      setLoadingAuth(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Credenciais de login inválidas. Verifique seu email e senha.');
      } else {
        toast.error('Ops, algo deu errado durante o login!');
      }
    }
  }, [navigate]);

  const Registrar = useCallback(async (nome, email, senha, contato) => {
    setLoadingAuth(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const value = userCredential.user;
      let uid = value.uid;

      await setDoc(doc(db, "users", uid), {
        nome: nome,
        avatarUrl: null,
        contato: contato
      });

      let data = {
        uid: uid,
        nome: nome,
        email: value.email,
        avatarUrl: null
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success("Seja bem-vindo ao sistema!")
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setLoadingAuth(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email já está em uso!');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('O email fornecido é inválido!');
      } else {
        toast.error('Ops, algo deu errado durante o registro!');
      }
    }
  }, [navigate]);

  const storageUser = useCallback((data) => {
    localStorage.setItem('@Notas', JSON.stringify(data))
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem('@Notas');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    signed: !!user,
    user,
    Entrar,
    Registrar,
    logout,
    loadingAuth,
    loading,
    storageUser,
    setUser
  }), [user, Entrar, Registrar, logout, loadingAuth, loading, storageUser, setUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
