/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import HubIcon from '@mui/icons-material/Hub';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Modal, Select, Typography} from '@mui/material';

import { getBranchList, getPackagesCoreList, postTriggerPublishPackage } from '../../api/gitlab';

const CustomBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 48px;
  width: 320px;
  display: flex;
  flex-direction: column;
`;

const CustomFormControl = styled(FormControl)`
  margin-bottom: 32px;
`;

function NewPackageModal({ open, setOpen, handleSuccess }) {

  const [branchs, setBranchs] = useState([]);

  const [isAlpha, setIsAlpha] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [packageType, setPackageType] = useState('patch');

  const [lastCoreVersion, setLastCoreVersion] = useState('');

  const [targetBranch, setTargetBranch] = useState('');

  const fetchBranchs = async function () {
    const branchsList = await getBranchList('33984506');
    setBranchs(branchsList);
  };

  useEffect(() => {
    fetchBranchs();
  }, []);

  const handleChangeTargetBranch = (event) => setTargetBranch(event.target.value);

  const handleClose = () => setOpen(false);

  const handleChangeIsAlpha = (event) => setIsAlpha(event.target.checked);

  const handleChangePackageType = (event) => setPackageType(event.target.value);

  const createPackage = async (targetBranch) => {
    try {
      await postTriggerPublishPackage(isAlpha, packageType, targetBranch);
      handleSuccess();
      setOpen(false);
    }
    catch (e) {
      console.error('Un problème est survenue lors de l envoi de la requête');
    }
  };

  const fetchLastVersionNumber = async function () {
    const res = await getPackagesCoreList();
    setLastCoreVersion(res[0].version);
  };

  useEffect(() => {
    fetchLastVersionNumber();
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <CustomBox>
        <Typography>
          Dernière version publiée : {lastCoreVersion}
        </Typography>
        <CustomFormControl fullWidth>
          <FormControlLabel control={<Checkbox checked={isAlpha} />} label="Alpha" onChange={handleChangeIsAlpha}/>
        </CustomFormControl>
        <CustomFormControl fullWidth>
          <InputLabel id="branch-label">Branche cible</InputLabel>
          <Select
            labelId="branch-label"
            label="Branch cible"
            onChange={handleChangeTargetBranch}
          >
            {branchs?.map?.(branch => <MenuItem key={branch.name} value={branch.name}>{branch.name}</MenuItem>)}
          </Select>
        </CustomFormControl>
        <CustomFormControl fullWidth>
          <InputLabel id="package-type-label">Package type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Package Type"
            onChange={handleChangePackageType}
          >
            <MenuItem value={'patch'}>Patch</MenuItem>
            <MenuItem value={'minor'}>Minor</MenuItem>
            <MenuItem value={'major'}>Major</MenuItem>
          </Select>
        </CustomFormControl>
        <Button color="secondary" size="large" variant="contained" endIcon={<HubIcon />}
          onClick={() => createPackage(targetBranch)}>Créer</Button>
      </CustomBox>
    </Modal>
  );
}

export default NewPackageModal;