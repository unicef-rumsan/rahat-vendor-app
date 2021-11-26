import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={24}
      {...props}
    >
      <G
        fill="none"
        stroke="#2b7ec1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M14.754 7.877c0 5.349-6.877 9.933-6.877 9.933S1 13.225 1 7.877a6.877 6.877 0 0113.754 0z" />
        <Path
          data-name="Vector"
          d="M10.169 7.877a2.292 2.292 0 11-2.293-2.292 2.292 2.292 0 012.293 2.292z"
        />
      </G>
    </Svg>
  )
}

export default SvgComponent
