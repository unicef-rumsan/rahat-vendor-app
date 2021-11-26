import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={5.207}
      height={13.803}
      {...props}
    >
      <Path
        d="M.707 9.096l4-4.194-4-4.195"
        fill="none"
        stroke="#a7a7a7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SvgComponent
