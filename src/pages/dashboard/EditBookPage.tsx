import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { bookService } from '@features/books/bookService';
import { ROUTES } from '@constants/routes';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'grey.50',
    fontSize: '0.875rem',
    borderRadius: 2,
  },
};

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [useImageFile, setUseImageFile] = useState(false);
  const [usePdfFile, setUsePdfFile] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [bookCategory, setBookCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bookTitle: '',
    authorName: '',
    imageURL: '',
    bookDescription: '',
    bookPDFURL: '',
  });

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      try {
        const book = await bookService.getBookById(id);
        setFormData({
          bookTitle: book.title || '',
          authorName: book.author || '',
          imageURL: book.image || '',
          bookDescription: book.description || '',
          bookPDFURL: book.pdf || '',
        });
        setBookCategory(book.category || '');
      } catch (err) {
        console.error('Error loading book:', err);
        alert('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a valid PDF file');
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !id) return;

    const { bookTitle, authorName, bookDescription, imageURL, bookPDFURL } = formData;

    if (!bookTitle || !authorName || !bookCategory) {
      alert('Please fill in all required fields');
      return;
    }

    if (usePdfFile && !pdfFile) {
      alert('Please select a PDF file');
      return;
    }

    if (!usePdfFile && !bookPDFURL) {
      alert('Please provide a PDF URL');
      return;
    }

    setIsSubmitting(true);

    try {
      if (useImageFile || usePdfFile) {
        const formDataObj = new FormData();
        formDataObj.append('title', bookTitle);
        formDataObj.append('author', authorName);
        formDataObj.append('category', bookCategory);
        if (bookDescription) formDataObj.append('description', bookDescription);
        if (useImageFile && imageFile) formDataObj.append('image', imageFile);
        if (usePdfFile && pdfFile) formDataObj.append('pdf', pdfFile);

        await bookService.updateBookWithUpload(id, formDataObj);
      } else {
        await bookService.updateBook(id, {
          title: bookTitle.trim(),
          author: authorName.trim(),
          image: imageURL.trim() || undefined,
          category: bookCategory.trim(),
          description: bookDescription.trim() || undefined,
          pdf: bookPDFURL.trim() || undefined,
        });
      }

      alert('Book updated successfully!');
      navigate(ROUTES.DASHBOARD_MANAGE, { replace: true, state: { refresh: Date.now() } });
    } catch (err) {
      console.error('Update error:', err);
      alert(`Error updating book: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: 2, my: 6 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Edit Book
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 1100 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
              Book Title
            </Typography>
            <TextField
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleInputChange}
              placeholder="Book Name"
              required
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
              Author Name
            </Typography>
            <TextField
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
              placeholder="Author Name"
              required
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>
        </Box>
<Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography component="label" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Book Image
              </Typography>
              <Button
                type="button"
                size="small"
                onClick={() => {
                  setUseImageFile(!useImageFile);
                  setImageFile(null);
                  setFormData((prev) => ({ ...prev, imageURL: '' }));
                }}
                sx={{
                  fontSize: '0.75rem',
                  bgcolor: '#3b82f6',
                  color: 'white',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.5,
                  minWidth: 'auto',
                  '&:hover': { bgcolor: '#2563eb' },
                }}
              >
                {useImageFile ? 'Use URL' : 'Upload File'}
              </Button>
            </Box>
            {useImageFile ? (
              <Box>
                <Button component="label" variant="outlined" fullWidth sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                  Choose image file
                  <input type="file" accept="image/*" hidden onChange={handleImageFileChange} />
                </Button>
                {imageFile && (
                  <Typography sx={{ mt: 1, fontSize: '0.875rem', color: 'grey.600' }}>
                    Selected: {imageFile.name}
                  </Typography>
                )}
              </Box>
            ) : (
              <TextField
                name="imageURL"
                value={formData.imageURL}
                onChange={handleInputChange}
                placeholder="Image URL"
                fullWidth
                size="small"
                sx={inputSx}
              />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
              Book Category
            </Typography>
            <TextField
              placeholder="Enter category (e.g., Fiction)"
              required
              value={bookCategory}
              onChange={(e) => setBookCategory(e.target.value)}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>
        </Box>

        <Box>
          <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, mb: 1 }}>
            Book Description
          </Typography>
          <TextField
            name="bookDescription"
            value={formData.bookDescription}
            onChange={handleInputChange}
            placeholder="Book Description"
            multiline
            rows={4}
            fullWidth
            sx={inputSx}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography component="label" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Book PDF
            </Typography>
            <Button
              type="button"
              size="small"
              onClick={() => {
                setUsePdfFile(!usePdfFile);
                setPdfFile(null);
                setFormData((prev) => ({ ...prev, bookPDFURL: '' }));
              }}
              sx={{
                fontSize: '0.75rem',
                bgcolor: '#ef4444',
                color: 'white',
                textTransform: 'none',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                '&:hover': { bgcolor: '#dc2626' },
              }}
            >
              {usePdfFile ? 'Use URL' : 'Upload File'}
            </Button>
          </Box>
          {usePdfFile ? (
            <Box>
              <Button component="label" variant="outlined" fullWidth sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                Choose PDF file
                <input type="file" accept=".pdf,application/pdf" hidden onChange={handlePdfFileChange} />
              </Button>
              {pdfFile && (
                <Typography sx={{ mt: 1, fontSize: '0.875rem', color: 'grey.600' }}>
                  Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          ) : (
            <TextField
              name="bookPDFURL"
              value={formData.bookPDFURL}
              onChange={handleInputChange}
              placeholder="Paste Book PDF URL here"
              fullWidth
              size="small"
              sx={inputSx}
            />
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            alignSelf: 'flex-start',
            mt: 2.5,
            bgcolor: '#1d4ed8',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
            px: 2.5,
            py: 1.25,
            '&:hover': { bgcolor: '#1e40af' },
            '&:disabled': { bgcolor: '#60a5fa' },
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Book'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditBookPage;