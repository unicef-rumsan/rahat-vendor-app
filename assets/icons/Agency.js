import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={19.333}
      height={22}
      {...props}
    >
      <G
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M11.833 1H3.167a2.262 2.262 0 00-1.532.586A1.925 1.925 0 001 3v16a1.925 1.925 0 00.635 1.414A2.262 2.262 0 003.167 21h13a2.262 2.262 0 001.532-.586A1.925 1.925 0 0018.333 19V7z" />
        <Path
          data-name="Vector"
          d="M11.833 1v6h6.5M14 12H5.333M14 16H5.333M7.5 8H5.333"
        />
      </G>
    </Svg>
  )
}

export default SvgComponent
