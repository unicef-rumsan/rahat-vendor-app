import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    width={29}
    height={23}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.5 0 0 12.048h3.955V23h7.909v-7.301h5.272V23h7.91V12.048H29L14.5 0Z"
      fill={props.color}
    />
  </Svg>
)

export default SvgComponent
