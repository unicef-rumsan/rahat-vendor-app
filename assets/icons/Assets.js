import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    width={25}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M21 5.444H3.222A2.222 2.222 0 0 0 1 7.667v11.11C1 20.006 1.995 21 3.222 21H21a2.222 2.222 0 0 0 2.222-2.222V7.667A2.222 2.222 0 0 0 21 5.444Z"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.556 21V3.222A2.222 2.222 0 0 0 14.333 1H9.89a2.222 2.222 0 0 0-2.222 2.222V21"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
