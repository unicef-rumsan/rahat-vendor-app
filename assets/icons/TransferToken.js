import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={22.001}
      height={20.032}
      {...props}
    >
      <Path
        d="M8.912 10.016H3L1.023 2.151A.662.662 0 011 2.011a1.007 1.007 0 011.46-.895l18.54 8.9-18.54 8.9A1.008 1.008 0 011 18.045a.66.66 0 01.033-.186L2.5 13.016"
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  )
}

export default SvgComponent
