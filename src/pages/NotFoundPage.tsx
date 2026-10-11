import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </Typography>
        <Button component={Link} to="/login" variant="contained" color="primary">
          Go back to login
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;