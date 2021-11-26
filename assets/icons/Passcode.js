import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={24.222}
      {...props}
    >
      <G
        fill="none"
        stroke="#6b6c72"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M3.222 11h15.556A2.222 2.222 0 0121 13.222V21a2.222 2.222 0 01-2.222 2.222H3.222A2.222 2.222 0 011 21v-7.778A2.222 2.222 0 013.222 11z" />
        <Path
          data-name="Vector"
          d="M5.444 11V6.556a5.556 5.556 0 0111.111 0V11"
        />
      </G>
    </Svg>
  )
}

export default SvgComponent
