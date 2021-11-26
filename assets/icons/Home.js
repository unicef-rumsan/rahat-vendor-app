import * as React from "react"
import Svg, { G, Path, Text, TSpan } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} {...props}>
      <G fill={props.color}>
        <Path d="M14.5 0L0 12.048h3.955V23h7.909v-7.3h5.273V23h7.909V12.048H29z" />
        <Text
          data-name="Home"
          transform="translate(0 25)"
          fontSize={10}
          fontFamily="Poppins-Regular, Poppins"
        >
          <TSpan x={0} y={11}>
            {"Home"}
          </TSpan>
        </Text>
      </G>
    </Svg>
  )
}

export default SvgComponent
