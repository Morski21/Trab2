import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth, firestore } from './../services/firebaseConnection';

const NoteContext = createContext();

export function useNoteContext() {
  return useContext(NoteContext);
}

export function NoteProvider({ children }) {
  const [userNotes, setUserNotes] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore
        .collection('notes')
        .where('userId', '==', user.uid)
        .onSnapshot((snapshot) => {
          const notes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserNotes(notes);
        });

      return () => unsubscribe();
    } else {
      setUserNotes([]);
    }
  }, [user]);

  const addNote = useCallback(async (title, content) => {
    try {
      if (user) {
        await firestore.collection('notes').add({
          userId: user.uid,
          title,
          content,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  }, [user]);

  const value = useMemo(() => ({ userNotes, addNote }), [userNotes, addNote]);

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );  
}
