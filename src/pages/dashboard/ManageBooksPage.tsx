import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { bookService } from '@features/books/bookService';
import type { Book } from '@app-types/book';
import { ROUTES } from '@constants/routes';

const PAGE_SIZE = 5;

const ManageBooksPage: React.FC = () => {
  const location = useLocation();
  const [content, setContent] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const data = await bookService.getBooks(page, PAGE_SIZE);
      setContent(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error loading books:', err);
      alert('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage, location.key, fetchBooks]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookService.deleteBook(id);
      alert('Book deleted successfully!');

      const remainingItemsOnCurrentPage = content.length - 1;
      if (remainingItemsOnCurrentPage === 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchBooks(currentPage);
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book');
    }
  };

  if (loading && content.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 1180,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
        }}
      >
        <CircularProgress size={48} sx={{ color: '#2563eb', mb: 2 }} />
        <Typography sx={{ color: 'grey.600', fontSize: '1.125rem', fontWeight: 500 }}>
          Loading books...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, my: 6 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Manage Your Books Inventory!
      </Typography>

      {content.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: 'grey.500' }}>No books found.</Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxWidth: 1180 }}>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 48 }}>No.</TableCell>
                  <TableCell sx={{ width: 80 }}>Image</TableCell>
                  <TableCell sx={{ width: 192 }}>Book name</TableCell>
                  <TableCell sx={{ width: 144 }}>Author Name</TableCell>
                  <TableCell sx={{ width: 208 }}>Category</TableCell>
                  <TableCell sx={{ width: 144 }}>Edit or Manage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((book, index) => (
                  <TableRow key={book.id} sx={{ bgcolor: 'background.paper' }}>
                    <TableCell>{currentPage * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        src={book.image}
                        alt={book.title}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = '/placeholder-book.png';
                        }}
                        sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                      />
                    </TableCell>
<TableCell
                      sx={{
                        fontWeight: 500,
                        color: 'grey.900',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {book.title}
                    </TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.author}
                    </TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.category}
                    </TableCell>
                    <TableCell>
                      <Box
                        component={Link}
                        to={ROUTES.DASHBOARD_EDIT_BOOK.replace(':id', String(book.id))}
                        sx={{
                          fontWeight: 500,
                          color: '#0891b2',
                          textDecoration: 'none',
                          mr: 2.5,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Edit
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleDelete(book.id)}
                        disabled={loading}
                        sx={{
                          bgcolor: '#dc2626',
                          fontWeight: 600,
                          borderRadius: 0.5,
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#b91c1c' },
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={(_, page) => setCurrentPage(page - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ManageBooksPage;