import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  where,
  query,
} from 'firebase/firestore';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './dashboard.css';

const notesRef = collection(db, "notes");

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      const q = query(
        notesRef,
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const notesData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notesData.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          timestamp: data.timestamp.toDate(),
        });
      });

      setNotes(notesData);
      setLoading(false);
    }

    loadNotes();
  }, [user.uid]);

  async function saveNote() {
    if (noteTitle.trim() === '' || noteContent.trim() === '') {
      alert('Por favor, insira um título e o conteúdo da nota.');
      return;
    }

    try {
      await addDoc(notesRef, {
        title: noteTitle,
        content: noteContent,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
      setNoteTitle('');
      setNoteContent('');
      alert('Nota salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar a nota:', error);
      alert('Ocorreu um erro ao salvar a nota.');
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Suas Notas" />

        <div className="container dashboard">
          <input
            type="text"
            placeholder="Título da nota"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Digite o conteúdo da nota..."
            rows="5"
          />
          <button onClick={saveNote}>Salvar Nota</button>
        </div>

        {loading ? (
          <div className="container dashboard">
            <span>Carregando suas notas...</span>
          </div>
        ) : (
          <div className="container dashboard">
            {notes.length === 0 ? (
              <span>Nenhuma nota encontrada.</span>
            ) : (
              <ul>
                {notes.map((note) => (
                  <li key={note.id}>
                    <strong>{note.title}</strong>: {note.content}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
