import reposList from '../data/repositories.json';
import { coreProjectId } from '../utils/constants';

import { postApi, putApi } from './utils';

const privateToken = process.env.REACT_APP_GITLAB_PRIVATE_TOKEN;

const refYamlScriptCore = 'develop';

const branchListUrl = (projectId) => `https://gitlab.com/api/v4/projects/${projectId}/repository/branches?private_token=${privateToken}&per_page=100`;

const packagesCoreListUrl = `https://gitlab.com/api/v4/projects/${coreProjectId}/packages?private_token=${privateToken}&sort=desc`;

const jobListUrl = (projectId) => `https://gitlab.com/api/v4/projects/${projectId}/jobs?private_token=${privateToken}&sort=desc`;

const repoFileUrl = (projectId, filePath, branch) => `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${filePath}?ref=${branch}&private_token=${privateToken}`;

const getBranchList = (projectId) => {
  return fetch(branchListUrl(projectId)).then(response => response.json());
};

const getJobList = (projectId) => {
  return fetch(jobListUrl(projectId)).then(response => response.json());
};

const getPackagesCoreList = () => {
  return fetch(packagesCoreListUrl).then(response => response.json());
};

const getRepoFile = (projectId, filePath, branch) => {
  return fetch(repoFileUrl(projectId, filePath, branch)).then(response => response.json());
};

const getBranchForCommit = async (projectId, commit ) => {
  const body = {
    projectId,
    commit,
  };
  const response = await (await postApi(`${process.env.REACT_APP_API_URL}/gitlab/branchForCommit`, JSON.stringify(body))).json();
  return response;
};

const updateRepoFile = async (projectId, filePath, fileContent, branch) => {
  const body = {
    projectId, 
    filePath,
    content: fileContent,
    branch
  };
  const response = await putApi(`${process.env.REACT_APP_API_URL}/gitlab/updateFile`, JSON.stringify(body));
  return response;
};

const uploadAssets = async (projectId, branch, files, isNew ) => {
  const action = isNew ? 'create' : 'update';
  const body = {
    projectId,
    branch,
    actions: []
  };
  files.forEach( file => {
    const actionItem = {
      action,
      encoding: 'base64',
      file_path: file.name.includes('svg')? `public/images/social_networks/${file.name}` : `public/images/${file.name}`,
      content: file.path.split('base64,')[1]
    };
    body.actions.push(actionItem);
  });
  const response = await postApi(`${process.env.REACT_APP_API_URL}/gitlab/updateFiles`, JSON.stringify(body));
  return response;
};
  
const createNewBranch = async (projectId, branch ) => {
  const body = {
    projectId,
    branch,
    ref: 'main'
  };
  const response = await postApi(`${process.env.REACT_APP_API_URL}/gitlab/createBranch`, JSON.stringify(body));
  return response;
};

const postTriggerUpdateCore = (repoName, branch) => {
  const body = {
    'token' : reposList?.repositories[coreProjectId].triggerToken,
    'ref': refYamlScriptCore,
    projectId: coreProjectId,
    variables: {
      PROJECT: repoName,
      BRANCH: branch,
      TARGET_JOB: 'spread-job'
    }
  };
  return postApi(`${process.env.REACT_APP_API_URL}/gitlab/triggerJob`, JSON.stringify(body));
};

const postTriggerPublishPackage = (isAlpha, packageType, branch ) => {
  const body = {
    'token' : reposList?.repositories[coreProjectId].triggerToken,
    'ref': refYamlScriptCore,
    projectId: coreProjectId,
    variables: {
      IS_ALPHA: isAlpha.toString(),
      PACKAGE_TYPE: packageType,
      BRANCH: branch,
      TARGET_JOB: 'build-package-job'
    }
  };
  return postApi(`${process.env.REACT_APP_API_URL}/gitlab/triggerJob`, JSON.stringify(body));
};

export {getBranchForCommit, getBranchList, getJobList, getPackagesCoreList, getRepoFile, postTriggerUpdateCore, createNewBranch, postTriggerPublishPackage, uploadAssets, updateRepoFile};
