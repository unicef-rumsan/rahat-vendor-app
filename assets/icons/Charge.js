import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    width={30}
    height={30}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Path fill="url(#a)" d="M0 0h30v30H0z" />
    <Defs>
      <Pattern
        id="a"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#b" transform="scale(.01563)" />
      </Pattern>
      <Image
        id="b"
        width={64}
        height={64}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
)

export default SvgComponent
