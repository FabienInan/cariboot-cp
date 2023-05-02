/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import styled from '@emotion/styled';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Modal, Typography} from '@mui/material';
import FileUpload from 'react-mui-fileuploader';

import { uploadAssets } from '../../api/gitlab';

const CustomBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 48px;
  width: 480px;
  display: flex;
  flex-direction: column;
`;


function UploadAssetsModal({ open, setOpen, repoId, branch, openSnackbar }) {

  // eslint-disable-next-line no-unused-vars
  const [files, setFiles] = useState(null);

  const handleFileUploadError = (error) => {
    console.log(error);
    openSnackbar('Impossible d uploader le fichier');
  };
  
  const handleFilesChange = (files) => {
    setFiles(files);
    if (files.length !== 0 ) {
      openSnackbar('Fichier uploadé avec succès');
    }
  };

  const uploadFiles = async() => {
    try {
      await uploadAssets(repoId, branch, files);
      setOpen(false);
      openSnackbar('La requête a été soumise avec succès');
    }
    catch (e) {
      openSnackbar('Un problème est survenue lors de l envoi de la requête');
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <CustomBox>        
        <Typography gutterBottom component="div">
          Branche cible : {branch}
        </Typography>
        <FileUpload
          multiFile={true}
          disabled={false}
          title=""
          header="Déposer les assets du projet ici"
          leftLabel="ou"
          rightLabel="pour sélectionner les assets dans l'arborescence"
          buttonLabel="Cliquez ici"
          buttonRemoveLabel="Remove all"
          maxFileSize={10}
          maxUploadFiles={0}
          maxFilesContainerHeight={357}
          errorSizeMessage={'fill it or move it to use the default error message'}
          onFilesChange={handleFilesChange}
          onError={handleFileUploadError}
          bannerProps={{ elevation: 0, variant: 'outlined' }}
          containerProps={{ elevation: 0, variant: 'outlined' }}
          imageSrc={'../../caribou.png'}
        />
        <Button color="secondary" size="large" variant="contained" endIcon={<CloudUploadIcon />}
          onClick={() => uploadFiles()}>Téléverser</Button>
      </CustomBox>
    </Modal>
  );
}

export default UploadAssetsModal;