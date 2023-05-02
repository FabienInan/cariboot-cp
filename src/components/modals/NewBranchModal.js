/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import styled from '@emotion/styled';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import { Box, Button, Modal, TextField } from '@mui/material';

import { createNewBranch } from '../../api/gitlab';


const CustomBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 32px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

function NewBranchModal({ open, setOpen, repoId, openSnackbar}) {

  const [releaseNumber, setReleaseNumber] = useState('');

  const handleClose = () => setOpen(false);

  const createBranch = async (projectId, releaseNumber) => {
    try {
      await createNewBranch(projectId, `release/${releaseNumber}`);
      setOpen(false);
      openSnackbar('La requête a été soumise avec succès');
    }
    catch (e) {
      openSnackbar('Un problème est survenue lors de l envoi de la requête');
    }
  };

  const handleChangeBranchName = (event) => setReleaseNumber(event.target.value);

  return (
    <Modal open={open} onClose={handleClose}>
      <CustomBox>
        <TextField id="release-branch-name" label="Numéro de release" variant="outlined" onChange={handleChangeBranchName}/>
        <Button color="secondary" size="large" variant="contained" endIcon={<ForkRightIcon />}
          onClick={() => createBranch(repoId, releaseNumber)}>Créer</Button>
      </CustomBox>
    </Modal>
  );
}

export default NewBranchModal;