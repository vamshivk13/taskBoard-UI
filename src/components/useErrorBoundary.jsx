import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export const useErrorBoundary = () => {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    setError(err);
  };

  const resetError = () => {
    setError(null);
  };

  const ErrorModal = () => (
    <Modal open={!!error} onClose={resetError}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {error?.title}
        </Typography>
        <Typography variant="body1">{error?.message}</Typography>
        <Box mt={2} textAlign="right">
          <Button
            sx={{ padding: "2px" }}
            variant="contained"
            onClick={resetError}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return { handleError, ErrorModal };
};
