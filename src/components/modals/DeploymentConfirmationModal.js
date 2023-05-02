/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import styled from '@emotion/styled';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Modal, Typography } from '@mui/material';

import { triggerDeployment } from '../../api/scalingo';

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

const CustomFormControl = styled(FormControl)`
  margin-bottom: 32px;
`;

function DeploymentConfirmationModal({ open, setOpen, repoName, branch, openSnackbar}) {

  const [targetEnv, setTargetEnv] = useState('stg1');
  const [isProd, setIsProd] = useState(false);

  const handleClose = () => setOpen(false);

  const startDeployment = async () => {
    try {
      await triggerDeployment(repoName, targetEnv, branch);
      setOpen(false);
      openSnackbar('La requête a été soumise avec succès');
    }
    catch (e) {
      openSnackbar('Un problème est survenue lors de l envoi de la requête');
    }
  };

  const handleChangeTargetEnv = (event) => {
    setIsProd(!!event.target.checked);
    setTargetEnv(event.target.checked ? 'prd1' : 'stg1');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <CustomBox>
        <Typography gutterBottom component="div">
          Branche cible : {branch}
        </Typography>        
        <CustomFormControl fullWidth>
          <FormControlLabel control={<Checkbox checked={isProd} />} label="Production" onChange={handleChangeTargetEnv}/>
        </CustomFormControl>
        <Button color="secondary" size="large" variant="contained" endIcon={<RocketLaunchIcon />}
          onClick={() => startDeployment()}>Deployer</Button>
      </CustomBox>
    </Modal>
  );
}

export default DeploymentConfirmationModal;