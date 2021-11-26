import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} {...props}>
      <G
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M21 11A10 10 0 1111 1a10 10 0 0110 10z" />
        <Path data-name="Vector" d="M11 7v8M7 11h8" />
      </G>
    </Svg>
  )
}

export default SvgComponent
