
export const getBackEndVersion = async (projectName, environment) => {
  return await fetch(`https://${projectName}-${environment}-be.osc-fr1.scalingo.io/api/version/`).then(response => response.json());
};
