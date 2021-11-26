import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20.4} height={22} {...props}>
      <G
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M1 14s1.15-1 4.6-1 5.75 2 9.2 2 4.6-1 4.6-1V2s-1.15 1-4.6 1-5.75-2-9.2-2S1 2 1 2z" />
        <Path data-name="Vector" d="M1 21v-7" />
      </G>
    </Svg>
  )
}

export default SvgComponent
