import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={10.411}
      height={16.822}
      {...props}
    >
      <Path
        d="M9 15.411l-8-7 8-7"
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
