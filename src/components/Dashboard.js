import React, { useEffect, useState } from 'react';


import styled from '@emotion/styled';
import HubIcon from '@mui/icons-material/Hub';
import PatternIcon from '@mui/icons-material/Pattern';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Button } from '@mui/material';

import { getJobList } from '../api/gitlab';
import reposList from '../data/repositories.json';
import { coreProjectId } from '../utils/constants';
import { OrangeCircle } from '../utils/styles';

import NewPackageModal from './modals/NewPackageModal';
import ProjectCard from './ProjectCard';
import TopAppBar from './TopAppBar';

const FullRowContainer = styled.div`
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin: 16px;
    gap: 16px;
`;

const Container = styled.div`
    margin-top: 64px;
    margin-right: 72px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const CustomButton = styled(Button)`
    margin: 0 16px;
`;

const SmallOrangeIndicatorPackage = styled(OrangeCircle)`
  width: 16px;
  height: 16px;
  position: relative;
  top: -8px;
  right: 42px;
`;

function Dashboard () {

  const [openCreateNewPackageModal, setOpenCreateNewPackageModal] = useState(false);

  const openNewPackageModal = () => setOpenCreateNewPackageModal(true);

  const openPanelMyDid = () => window.open('https://panel.mydid.eu', '_blank');

  const openDecentrustTemplate = () => window.open('https://decentrust.org/univers/', '_blank');

  const [jobPackageBuildActive, setJobPackageBuildActive] = useState('');

  const updateBuildPackageStatus = async() => {
    const res = await getJobList(coreProjectId);
    setJobPackageBuildActive(res[0].stage === 'cariboot' && res[0].name === 'build-package-job' 
    && (res[0].status === 'created' || res[0].status === 'running' )? res[0] : '');
  };

  useEffect(() => {
    const interval = setInterval(async() => {
      updateBuildPackageStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSuccessCreatePackage = () => {
    updateBuildPackageStatus();
  };

  return (
    <>
      <TopAppBar></TopAppBar>
      <Container>
        <FullRowContainer>
          <CustomButton color="secondary" size="large" variant="contained" endIcon={<HubIcon />} onClick={openNewPackageModal} >
          Publier un package
          </CustomButton>          
          {jobPackageBuildActive !== '' && <>
            <SmallOrangeIndicatorPackage></SmallOrangeIndicatorPackage>
          </>}
          <CustomButton color="secondary" size="large" variant="contained" endIcon={<TravelExploreIcon />} onClick={openPanelMyDid}>
          Gérer les univers de badges
          </CustomButton>
          <CustomButton color="secondary" size="large" variant="contained" endIcon={<PatternIcon />} onClick={openDecentrustTemplate}>
          Créer un template d&apos;univers
          </CustomButton>
          <NewPackageModal open={openCreateNewPackageModal} setOpen={setOpenCreateNewPackageModal} handleSuccess={handleSuccessCreatePackage}></NewPackageModal>
        </FullRowContainer>
        {
          Object.entries(reposList.repositories).reverse().map((entry) => {
            return <ProjectCard key={entry[0]} repo={{...entry[1], projectId: entry[0]}} />;
          })
        }
      </Container>
    </>
  );
}

export default Dashboard;