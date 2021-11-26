import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={22} height={20} {...props}>
      <G
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M1 1h6a4 4 0 014 4v14a3 3 0 00-3-3H1z" />
        <Path data-name="Vector" d="M21 1h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </G>
    </Svg>
  )
}

export default SvgComponent
