import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const blink = keyframes(`
from, to {
  opacity: 0;
  background-color: orange;
}
50% {
  opacity: 1;
}
`);

export const GreenCircle = styled.div`
height: 25px;
width: 25px;
background-color: green;
border-radius: 50%;
display: inline-block;
margin: 2px;
`;

export const OrangeCircle = styled.div`
height: 25px;
width: 25px;
border-radius: 50%;
display: inline-block;
margin: 2px;
animation: 1s ${blink} ease infinite;
`;

export const RedCircle = styled.div`
height: 25px;
width: 25px;
background-color: red;
border-radius: 50%;
display: inline-block;
margin: 2px;
`;
