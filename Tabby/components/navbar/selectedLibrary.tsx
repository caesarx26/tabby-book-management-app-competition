import React from 'react';
import { Svg, Path } from 'react-native-svg';

const SelectedLibrary = ({ width = 40, height = 40 }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
  >
    <Path
      d="M7.25 29.75H15.75C17.8567 29.75 18.91 29.75 19.6667 30.2556C19.9943 30.4745 20.2755 30.7557 20.4944 31.0833C21 31.84 21 32.8933 21 35V13C21 10.1716 21 8.75736 20.1213 7.87868C19.2426 7 17.8284 7 15 7H7.25C6.30719 7 5.83579 7 5.54289 7.29289C5.25 7.58579 5.25 8.05719 5.25 9V27.75C5.25 28.6928 5.25 29.1642 5.54289 29.4571C5.83579 29.75 6.30719 29.75 7.25 29.75Z"
      stroke="#D7E3F8"
      strokeWidth="2"
    />
    <Path
      d="M34.75 29.75H26.25C24.1433 29.75 23.09 29.75 22.3333 30.2556C22.0057 30.4745 21.7245 30.7557 21.5056 31.0833C21 31.84 21 32.8933 21 35V13C21 10.1716 21 8.75736 21.8787 7.87868C22.7574 7 24.1716 7 27 7H34.75C35.6928 7 36.1642 7 36.4571 7.29289C36.75 7.58579 36.75 8.05719 36.75 9V27.75C36.75 28.6928 36.75 29.1642 36.4571 29.4571C36.1642 29.75 35.6928 29.75 34.75 29.75Z"
      stroke="#D7E3F8"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default SelectedLibrary;