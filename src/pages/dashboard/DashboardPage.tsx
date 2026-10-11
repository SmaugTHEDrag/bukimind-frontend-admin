import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '80rem' }}>
      <Box sx={{ px: 2 }}>
        <Box sx={{ width: '100%', mx: 'auto' }}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 6,
              p: 4,
              mb: 2.5,
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 5 }}>
              Demo Dashboard development for the book inventory
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                <Typography sx={{ color: 'grey.400', fontSize: '0.75rem' }}>
                  Members
                  <br />
                  connected
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Box sx={{ display: 'flex' }}>
                  {[0, 1].map((i) => (
                    <Box
                      key={i}
                      component="img"
                      src="https://ui-avatars.com/api/?background=random"
                      alt=""
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        ml: i > 0 ? -1.5 : 0,
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 3,
                    color: 'grey.800',
                    borderColor: 'grey.300',
                    '&:hover': { borderColor: 'grey.400', color: 'grey.900' },
                  }}
                >
                  <ChatIcon fontSize="small" />
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    height: 36,
                    px: 2.5,
                    borderRadius: 3,
                    bgcolor: 'grey.900',
                    color: 'grey.300',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: 'grey.800', color: 'white', boxShadow: 'none' },
                  }}
                >
                  Open
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 5 }} />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 5,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Stats
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 2,
                  }}
                >
                  <Box sx={{ gridColumn: '1 / -1', p: 2, bgcolor: '#dcfce7', borderRadius: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'grey.800', lineHeight: 1.2 }}>
                      Good day,
                      <br />
                      Kristin
                    </Typography>
                    <Box sx={{ mt: 2.5 }}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: 'white',
                          color: 'grey.800',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          borderRadius: 3,
                          boxShadow: 'none',
                          '&:hover': { bgcolor: 'white', color: '#22c55e', boxShadow: 'none' },
                        }}
                      >
                        Start tracking
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: '#fef9c3', borderRadius: 3, color: 'grey.800' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', lineHeight: 1 }}>20</Typography>
                    <Typography sx={{ mt: 1 }}>Tasks finished</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: '#fef9c3', borderRadius: 3, color: 'grey.800' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', lineHeight: 1 }}>5,5</Typography>
                    <Typography sx={{ mt: 1 }}>Tracked hours</Typography>
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1', p: 2, bgcolor: '#f3e8ff', borderRadius: 3, color: 'grey.800' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: 1 }}>
                      Your daily plan
                    </Typography>
                    <Typography sx={{ mt: 1 }}>5 of 8 completed</Typography>
                  </Box>
                </Box>
              </Box>
<Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Your tasks today
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Number 10', time: '4h', title: 'Blog and social posts', note: 'Deadline is today' },
                    { label: 'Grace Aroma', time: '7d', title: 'New campaign review', note: 'New feedback' },
                    { label: 'Petz App', time: '2h', title: 'Cross-platform and browser QA' },
                  ].map((task) => (
                    <Box
                      key={task.title}
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 3,
                        color: 'grey.800',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'grey.400', fontSize: '0.75rem' }}>{task.label}</Typography>
                        <Typography sx={{ color: 'grey.400', fontSize: '0.75rem' }}>{task.time}</Typography>
                      </Box>
                      <Typography
                        component="a"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        sx={{
                          fontWeight: 'bold',
                          color: 'inherit',
                          textDecoration: 'none',
                          display: 'block',
                          mb: task.note ? 1 : 0,
                          '&:hover': { color: '#854d0e', textDecoration: 'underline' },
                        }}
                      >
                        {task.title}
                      </Typography>
                      {task.note && (
                        <Typography sx={{ fontSize: '0.875rem', color: 'grey.600' }}>
                          <InfoOutlinedIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                          {task.note}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;