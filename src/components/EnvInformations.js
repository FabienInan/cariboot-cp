/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';

import { getBranchForCommit, getRepoFile } from '../api/gitlab';
import { getLastDeployments } from '../api/scalingo';
import { getBackEndVersion } from '../api/version';
import { GreenCircle, OrangeCircle, RedCircle } from '../utils/styles';

const EnvInformationsPaper = styled(Paper)`
  margin: 4px;
  padding: 8px;
  width: 50%;
`;

const StatusContainer = styled.div`
margin-top : 4px;`;

function EnvInformations({repo, targetBranch, environment}) {

  const [backEndVersion, setBackEndVersion] = useState('');

  const [frontEndVersion, setFrontEndVersion] = useState('');

  const [history, setHistory] = useState('');

  const getBranchLastSuccessfulDeployments = async (deployments) => {
    const commit = deployments.find((deployment) => deployment.status === 'success')?.git_ref || '';
    const data = await getBranchForCommit(repo.projectId, commit);
    setFrontEndVersion(data.branch);
    getFEVersion(data.branch);
  };

  const getHistoryDeployments = async function () {
    const result = await getLastDeployments(repo.name, environment, targetBranch);
    setHistory(result);
    return result;
  };

  const getFEVersion = async function (branch) {
    const file = await getRepoFile(repo.projectId, 'package.json', branch);
    const regex = new RegExp('"@lica-tech/front-end-core": "(.*?)"', 'gi');
    if (file) {
      const version = atob(file.content).match(regex)[0].split(':')[1].replaceAll('"','').trim();
      if (environment === 'stg1') {
        setFrontEndVersion(branch + ' ' + version);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const resBE = await getBackEndVersion(repo.name, environment);
      setBackEndVersion(resBE.version);
      const res = await getHistoryDeployments();
      await getBranchLastSuccessfulDeployments(res);
    };
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async() => {
      await getHistoryDeployments();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <EnvInformationsPaper elevation={3} >
      <Typography variant="h6">
        {environment.toUpperCase()}
      </Typography>
      {frontEndVersion !== '' ? 
        <>
          <Typography>
          FE : {frontEndVersion}
          </Typography>
          <Typography>
          BE : {backEndVersion}
          </Typography>
          <Typography>
          Deploiements FE : 
            <StatusContainer>
              {history?.map?.((deployment) => {
                if (deployment.status === 'success') {
                  return (<GreenCircle key={deployment.id}></GreenCircle>);
                } else if (deployment.status === 'building') {
                  return (<OrangeCircle key={deployment.id}></OrangeCircle>);
                } else if (deployment.status === 'build-error') {
                  return (<RedCircle key={deployment.id}></RedCircle>);
                }
              }).slice(0,3)}
            </StatusContainer>
          </Typography>
        </>
        :<Typography>Pas d&apos;informations disponibles</Typography>}
    </EnvInformationsPaper>
  );
}

export default EnvInformations;