import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      {...props}>
      <G
        fill="none"
        stroke={props.color || '#a7a7a7'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>
        <Path d="M1 8s3.5-7 9.625-7 9.625 7 9.625 7-3.5 7-9.625 7S1 8 1 8z" />
        <Path
          data-name="Vector"
          d="M13.25 8a2.625 2.625 0 11-2.625-2.625A2.625 2.625 0 0113.25 8z"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
