/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Modal, Stack, Tab, Tabs, Typography } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';

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

const ColorItem = styled.div`
  margin-top: 8px;
  display: flex;
`;

const ColorTypography = styled(Typography)`
  padding-top: 16px;
  width: 120px;
`;

const TabPanelContainer = styled.div`
  display: flex;
  gap: 32px;
`;

const ThemeColorListContainer = styled.div`
  flex-direction: column;
`;

const themesList = ['commonPalette', 'intervenerTheme', 'participantTheme'];

const themesVariant = {
  commonPalette: ['commonPrimary', 'commonSecondary'],
  intervenerTheme: ['primary', 'secondary'],
  participantTheme: ['primary', 'secondary'],
};

const colorsName = [ 'main', 'light', 'dark', 'accent', 'extralight', 'ultralight', 'contrastText'];

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 16px;
`;

function UpdateThemesModal({ open, setOpen, repoId, branch, openSnackbar}) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => setValue(newValue);

  const handleClose = () => {
    setOpen(false);
    setValue(0);
  };

  const [themesFileObject, setThemesFileObject] = useState({});

  const [themesObject, setThemesObject] = useState({});

  const getColorPaletteAsString = (colors) => {
    return `{
      main: '${colors?.main || '#FFFFFF'}',
      light: '${colors?.light || '#FFFFFF'}',
      dark: '${colors?.dark || '#FFFFFF'}',
      accent: '${colors?.accent || '#FFFFFF'}',
      extralight: '${colors?.extralight || '#FFFFFF'}',
      ultralight: '${colors?.ultralight || '#FFFFFF'}',
      contrastText: '${colors?.contrastText || '#FFFFFF'}',
    }`;
  };

  const saveThemes = () => {
    themesList.map( async (theme) => {
      const regexPrimary = theme === themesList[0] ? /commonPrimary: \{[^}]*\}/gi : /primary: \{[^}]*\}/gi;
      const regexSecondary = theme === themesList[0] ? /commonSecondary: \{[^}]*\}/gi : /secondary: \{[^}]*\}/gi;
      let updatedColors = atob(themesFileObject[theme].content).replace(regexPrimary, `${themesVariant[theme][0]}: ${getColorPaletteAsString(themesObject[theme][themesVariant[theme][0]])}`);
      updatedColors = updatedColors.replace(regexSecondary, `${themesVariant[theme][1]}: ${getColorPaletteAsString(themesObject[theme][themesVariant[theme][1]])}`);
      try {
        if( updatedColors !== atob(themesFileObject[theme].content))
        {
          await updateRepoFile(repoId, `src%2Fthemes%2F${theme}.js`, updatedColors, branch);
          openSnackbar('La requête a été soumise avec succès');
        }
      }
      catch (e) {
        openSnackbar('Un problème est survenue lors de l envoi de la requête');
      }
    });
  };

  useEffect(() => {
    const themes = {};
    async function fetchThemesFile() {
      const res = await Promise.all(themesList.map(async (theme) => {
        themes[theme] = {[themesVariant[theme][0]]: {}, [themesVariant[theme][1]]: {}};
        const file = await getRepoFile(repoId, `src%2Fthemes%2F${theme}.js`, branch);
        colorsName.map(colorName => {
          const regex = new RegExp(`\\b(${colorName}): '#(?:[a-f\\d]{3}){1,2}\\b`, 'gi');
          const colorValues = atob(file.content).match(regex)?.map?.(item => item.replace(/'/g, '').replace(/\s/g, '').split(':'));
          themes[theme][themesVariant[theme][0]][colorName] = colorValues?.[0]?.[1];
          themes[theme][themesVariant[theme][1]][colorName] = colorValues?.[1]?.[1];
        });
        return file;
      }));
      setThemesObject(themes);
      setThemesFileObject({[res[0].file_name.split('.')[0]] :res[0], [res[1].file_name.split('.')[0]] :res[1], [res[2].file_name.split('.')[0]] :res[2]});
    }
    fetchThemesFile();
  }, [branch]);

  return (
    <Modal open={open} onClose={handleClose}>
      <CustomBox>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Thème commun" />
          <Tab label="Thème intervenant" />
          <Tab label="Thème participant" />
        </Tabs>
        <TabPanel value={value} key={value} index={value}>
          <TabPanelContainer>
            {
              themesVariant[themesList[value]].map(themeVariant => 
                (<ThemeColorList key={themeVariant} title={themeVariant} themeIndex={value} themeVariant={themeVariant} themesObject={themesObject} setThemesObject={setThemesObject}></ThemeColorList>))
            }
          </TabPanelContainer>
        </TabPanel>
        <ButtonsContainer>
          <Button color="secondary" size="large" variant="contained" endIcon={< CloseIcon/>}
            onClick={handleClose}>Fermer
          </Button>
          <Button color="secondary" size="large" variant="contained" endIcon={<SaveIcon />}
            onClick={saveThemes}>Enregistrer
          </Button>
        </ButtonsContainer>
      </CustomBox>
    </Modal>
  );
}

function ThemeColorList(props) {
  const {themesObject, themeIndex, themeVariant, title, setThemesObject } = props;

  const handleChange = (colorName) => (color) => {
    setThemesObject({...themesObject, [themesList[themeIndex]] : {
      ...themesObject[themesList[themeIndex]],
      [themeVariant]: {
        ...themesObject[themesList[themeIndex]][themeVariant],
        [colorName]: color
      }
    }
    });
  };
  return (
    <ThemeColorListContainer>
      <Typography variant="h6">{title}</Typography>
      <Stack spacing={0}>
        {colorsName.map((colorName) => (
          <ColorItem key={colorName}>      
            <ColorTypography>{colorName}</ColorTypography>
            <MuiColorInput format="hex" value={themesObject[themesList[themeIndex]]?.[themeVariant]?.[colorName] || '#FFFFFF'} onChange={handleChange(colorName)} />
          </ColorItem>   
        ))}    
      </Stack>
    </ThemeColorListContainer>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


export default UpdateThemesModal;