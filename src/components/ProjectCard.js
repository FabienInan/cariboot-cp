/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import BackupIcon from '@mui/icons-material/Backup';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import LinkIcon from '@mui/icons-material/Link';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TranslateIcon from '@mui/icons-material/Translate';
import UpdateIcon from '@mui/icons-material/Update';
import { Card, CardActions, CardContent, CardMedia, Fab, FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar, Tooltip, Typography } from '@mui/material';

import { getBranchList, postTriggerUpdateCore } from '../api/gitlab';

import EnvInformations from './EnvInformations';
import DeploymentConfirmationModal from './modals/DeploymentConfirmationModal';
import NewBranchModal from './modals/NewBranchModal';
import UpdateThemesModal from './modals/UpdateThemesModal';
import UpdateTranslationModal from './modals/UpdateTranslationModal';
import UploadAssetsModal from './modals/UploadAssetsModal';

const CustomCard = styled(Card)`
    margin: 12px;
    width: 400px;
`;

const CustomCardContent = styled(CardContent)`
    height: 272px;
`;
const CustomCardActions = styled(CardActions)`
    display: flex;
    flex-wrap: wrap;
    row-gap: 24px;
    column-gap: 16px;
`;

const EnvironmentsRow = styled.div`
    display:flex;
`;

function ProjectCard({repo}) {

  const [branchs, setBranchs] = useState([]);

  const [disableUpdateCoreButton, setDisableUpdateCoreButton] = useState(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState('');

  const [openCreateNewBranchModal, setOpenCreateNewBranchModal] = useState(false);

  const [openUploadAssetsModal, setOpenUploadAssetsModal] = useState(false);

  const [openUpdateTranslationModal, setOpenUpdateTranslationModal] = useState(false);

  const [openUpdateThemesModal, setOpenUpdateThemesModal] = useState(false);

  const [openDeploymentModal, setOpenDeploymentModal] = useState(false);

  const [targetBranch, setTargetBranch] = useState(repo.name === 'core' ? 'develop' : 'main');

  const fetchBranchs = async function () {
    const branchsList = await getBranchList(repo.projectId);
    setBranchs(branchsList);
    setTargetBranch((branchsList.filter(branch => branch.name !== 'develop' && branch.name !== 'main'))[0]?.name);
  };

  useEffect(() => {
    fetchBranchs();
  }, []);

  const handleChangeTargetBranch = (event) => setTargetBranch(event.target.value);

  const updateCore = async (repoName, branch) => {
    setDisableUpdateCoreButton(true);
    try {
      await postTriggerUpdateCore(repoName, branch);
      setTimeout(() => setDisableUpdateCoreButton(false), 5000);
      handleOpenSnackBar('Lancement de la tâche de mise à jour du core lancée avec succès');
    }
    catch(e) {
      handleOpenSnackBar('Lancement de la tâche de mise à jour du core échouée');
    }
  };

  const handleOpenSnackBar = (message) => {
    setSnackBarMessage(message);
    setOpenSnackBar(true);
  };

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleOpenBranchModal = () => setOpenCreateNewBranchModal(true);

  const handleOpenUploadAssetsModal = () => setOpenUploadAssetsModal(true);

  const handleOpenUpdateTranslationModal = () => setOpenUpdateTranslationModal(true);

  const handleOpenUpdateThemesModal = () => setOpenUpdateThemesModal(true);

  const handleOpenDeploymentModal = () => setOpenDeploymentModal(true);

  const openStagingLink = () => window.open(`https://${repo.name}-stg1-fe.osc-fr1.scalingo.io`, '_blank');

  return (
    <CustomCard>
      <CardMedia
        component="img"
        height="96"
        image={`https://avatars.dicebear.com/api/identicon/${repo.name}.svg`}
      />
      <CustomCardContent>
        <Typography gutterBottom variant="h5" component="div">
          {String(repo.name).toUpperCase()}
          {repo.name !== 'core' && <IconButton aria-label="delete" size="large" onClick={openStagingLink}>
            <LinkIcon fontSize="inherit" />
          </IconButton>}
        </Typography>
        {repo.name !== 'core' &&
        <EnvironmentsRow>
          <EnvInformations repo={repo} targetBranch={targetBranch} environment={'stg1'} />
          <EnvInformations repo={repo} targetBranch={targetBranch} environment={'prd1'} />
        </EnvironmentsRow>}
      </CustomCardContent>
      <CustomCardActions disableSpacing={true}>
        <FormControl fullWidth>
          <InputLabel id="branch-label">Branche cible</InputLabel>
          <Select
            labelId="branch-label"
            label="Branche cible"
            value={targetBranch}
            onChange={handleChangeTargetBranch}
          >
            {branchs?.map(branch => <MenuItem key={branch.name} value={branch.name} >{branch.name}</MenuItem>)}
          </Select>
        </FormControl>
        {repo.name !== 'core' && <Tooltip title="Mettre à jour le core (choisir une release >= 3.9.0)">
          <Fab color="secondary" size="medium" aria-label="update core" disabled={disableUpdateCoreButton} onClick={() => updateCore(repo.name, targetBranch)}>
            <UpdateIcon />
          </Fab>
        </Tooltip>}
        <Tooltip title="Mettre à jour les assets">
          <Fab color="secondary" size="medium" aria-label="upload assets" onClick={() => handleOpenUploadAssetsModal()}>
            <BackupIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Créer une nouvelle branche release">
          <Fab color="secondary" size="medium" aria-label="create branch" onClick={() => handleOpenBranchModal()}>
            <ForkRightIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Mettre à jour les traductions">
          <Fab color="secondary" size="medium" aria-label="update translations" onClick={() => handleOpenUpdateTranslationModal()}>
            <TranslateIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Mettre à jour le thème">
          <Fab color="secondary" size="medium" aria-label="update translations" onClick={() => handleOpenUpdateThemesModal()} >
            <ColorLensIcon />
          </Fab>
        </Tooltip>
        {repo.name !== 'core' && <Tooltip title="Deployer sur staging">
          <Fab color="secondary" size="medium" aria-label="Deployer le front end" onClick={() => handleOpenDeploymentModal()} >
            <RocketLaunchIcon />
          </Fab>
        </Tooltip>}
        <Snackbar
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          message={snackBarMessage}
        />
        <NewBranchModal open={openCreateNewBranchModal} setOpen={setOpenCreateNewBranchModal} repoId={repo.projectId} openSnackbar={handleOpenSnackBar} ></NewBranchModal>
        <UploadAssetsModal open={openUploadAssetsModal} setOpen={setOpenUploadAssetsModal} repoId={repo.projectId} branch={targetBranch} openSnackbar={handleOpenSnackBar} ></UploadAssetsModal>
        <UpdateTranslationModal open={openUpdateTranslationModal} setOpen={setOpenUpdateTranslationModal} repoId={repo.projectId} branch={targetBranch} openSnackbar={handleOpenSnackBar}></UpdateTranslationModal>
        <DeploymentConfirmationModal open={openDeploymentModal} setOpen={setOpenDeploymentModal} repoName={repo.name} branch={targetBranch} openSnackbar={handleOpenSnackBar}></DeploymentConfirmationModal>
        <UpdateThemesModal open={openUpdateThemesModal} setOpen={setOpenUpdateThemesModal} repoId={repo.projectId} branch={targetBranch} openSnackbar={handleOpenSnackBar}></UpdateThemesModal>
      </CustomCardActions>
    </CustomCard>
  );
}

export default ProjectCard;