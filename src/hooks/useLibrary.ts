import { useState, useEffect, useCallback } from 'react';
import { libraryApi } from '../services/api/library.api';
import { LibraryBook } from '../types/index';

export const useLibrary = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);
  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await libraryApi.getBooks();
      if (res.data) setBooks(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch library books');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const toggleBookmark = async (bookId: string) => {
    try {
      const res = await libraryApi.toggleBookmark(bookId);
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, isBookmarked: !b.isBookmarked } : b))
      );
      return res;
    } catch (err: any) {
      console.error('Bookmark error:', err);
    }
  };

  const openSecureReader = async (book: LibraryBook) => {
    try {
      const tokenRes = await libraryApi.getStreamToken(book.id);
      if (tokenRes.data) {
        setStreamToken(tokenRes.data.token);
        setActiveReadingBook(book);
      }
    } catch (err: any) {
      console.error('Reader token error:', err);
    }
  };

  const closeSecureReader = () => {
    setActiveReadingBook(null);
    setStreamToken(null);
  };

  return {
    books,
    activeReadingBook,
    streamToken,
    isLoading,
    error,
    refetch: fetchBooks,
    toggleBookmark,
    openSecureReader,
    closeSecureReader,
  };
};
