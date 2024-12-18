import React from 'react';
import { Svg, Path } from 'react-native-svg';

const notSelectedLibrary = ({ width = 40, height = 40 }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
  >
    <Path
      d="M35 21V32.75C35 34.6356 35 35.5784 34.4142 36.1642C33.8284 36.75 32.8856 36.75 31 36.75H11.375C10.0944 36.75 9.45413 36.75 8.94325 36.5577C8.1347 36.2534 7.4966 35.6153 7.19228 34.8068C7 34.2959 7 33.6556 7 32.375V32.375C7 31.0944 7 30.4541 7.19228 29.9432C7.4966 29.1347 8.1347 28.4966 8.94325 28.1923C9.45413 28 10.0944 28 11.375 28H31C32.8856 28 33.8284 28 34.4142 27.4142C35 26.8284 35 25.8856 35 24V9.25C35 7.36438 35 6.42157 34.4142 5.83579C33.8284 5.25 32.8856 5.25 31 5.25H11C9.11438 5.25 8.17157 5.25 7.58579 5.83579C7 6.42157 7 7.36438 7 9.25V32.375"
      stroke="#939FB2"
      strokeWidth="2"
    />
    <Path
      d="M15.75 14L26.25 14"
      stroke="#939FB2"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default notSelectedLibrary;