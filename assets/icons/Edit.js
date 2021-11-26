import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={17} height={16} {...props}>
      <G
        data-name="Icon/edit"
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M8.5 15H16" />
        <Path
          data-name="Vector"
          d="M12.25 1.508a1.79 1.79 0 012.5 0 1.733 1.733 0 01.383.563 1.7 1.7 0 010 1.328 1.733 1.733 0 01-.383.563L4.333 14.182 1 15l.833-3.271z"
        />
      </G>
    </Svg>
  )
}

export default SvgComponent
