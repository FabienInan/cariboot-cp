/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Modal, Typography } from '@mui/material';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { getRepoFile, updateRepoFile } from '../../api/gitlab';

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

const CustomButton = styled(Button)`
  justify-content: flex-end;
`;

const translationRepoFileUrl = 'src%2Flocales%2Ffr%2Ftranslation.json';

function UpdateTranslationModal({ open, setOpen, repoId, branch, openSnackbar}) {

  const handleClose = () => setOpen(false);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const fetchTranslationFile = async function () {
    const file = await getRepoFile(repoId, translationRepoFileUrl, branch);
    if (file.content) {
      const contentState = EditorState.createWithContent(ContentState.createFromText(decodeURIComponent(escape(atob(file.content)))));
      setEditorState(contentState);
    }
  };

  useEffect(() => { fetchTranslationFile(); }, [branch]);

  const saveTranslation = async () => {
    const contentToSave = convertToRaw(editorState.getCurrentContent()).blocks;
    const value = contentToSave.map(block => (block.text.trim()) || block.text).join('\n');
    try {
      await updateRepoFile(repoId, translationRepoFileUrl, value, branch);
      setOpen(false);
      openSnackbar('La requête a été soumise avec succès');
    }
    catch (e) {
      openSnackbar('Un problème est survenue lors de l envoi de la requête');
    }
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <CustomBox>
        <Typography gutterBottom component="div">
          Branche cible : {branch}
        </Typography>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setEditorState}
          toolbar={{
            options: ['history']
          }}
        />
        <CustomButton>
          <Button color="secondary" size="large" variant="contained" endIcon={<SaveIcon />}
            onClick={() => {saveTranslation();}}>Enregistrer</Button>
        </CustomButton>
      </CustomBox>
    </Modal>
  );
}

export default UpdateTranslationModal;