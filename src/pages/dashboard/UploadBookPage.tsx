import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { bookService } from '@features/books/bookService';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'grey.50',
    fontSize: '0.875rem',
    borderRadius: 2,
  },
};

const UploadBookPage: React.FC = () => {
  const [bookCategory, setBookCategory] = useState('');
  const [useImageFile, setUseImageFile] = useState(false);
  const [usePdfFile, setUsePdfFile] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    bookTitle: '',
    authorName: '',
    imageURL: '',
    bookDescription: '',
    bookPDFURL: '',
  });

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

    try {
      if (useImageFile || usePdfFile) {
        if (!usePdfFile || !pdfFile) {
          alert('PDF file is required when using file upload method');
          return;
        }

        const formDataObj = new FormData();
        formDataObj.append('title', bookTitle);
        formDataObj.append('author', authorName);
        formDataObj.append('category', bookCategory);
        if (bookDescription) formDataObj.append('description', bookDescription);
        if (useImageFile && imageFile) formDataObj.append('image', imageFile);
        formDataObj.append('pdf', pdfFile);

        await bookService.uploadBook(formDataObj);
      } else {
        await bookService.createBook({
          title: bookTitle,
          author: authorName,
          image: imageURL,
          category: bookCategory,
          description: bookDescription,
          pdf: bookPDFURL,
        });
      }

      alert('Book uploaded successfully!');
      setFormData({
        bookTitle: '',
        authorName: '',
        imageURL: '',
        bookDescription: '',
        bookPDFURL: '',
      });
      setBookCategory('');
      setImageFile(null);
      setPdfFile(null);
      setUseImageFile(false);
      setUsePdfFile(false);
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Error uploading book: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: 2, my: 6 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Upload A Book!
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
              required
              fullWidth
              size="small"
              sx={inputSx}
            />
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
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
          }}
        >
          Upload Book
        </Button>
      </Box>
    </Box>
  );
};

export default UploadBookPage;