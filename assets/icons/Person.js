import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={18} height={24} {...props}>
      <G
        fill="none"
        stroke={props.color || "#2b7ec1"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M17 19v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <Path data-name="Vector" d="M13 5a4 4 0 11-4-4 4 4 0 014 4z" />
      </G>
    </Svg>
  )
}

export default SvgComponent
