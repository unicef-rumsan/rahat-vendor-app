import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={22} {...props}>
      <Path
        d="M7.5 4.5v3h-3v-3zM9 3H3v6h6zm-1.5 9.5v3h-3v-3zM9 11H3v6h6zm6.5-6.5v3h-3v-3zM17 3h-6v6h6zm-6 8h1.5v1.5H11zm1.5 1.5H14V14h-1.5zM14 11h1.5v1.5H14zm-3 3h1.5v1.5H11zm1.5 1.5H14V17h-1.5zM14 14h1.5v1.5H14zm1.5-1.5H17V14h-1.5zm0 3H17V17h-1.5zM19 5a1 1 0 01-1-1V2h-2a1 1 0 010-2h3a1 1 0 011 1v3a1 1 0 01-1 1zm1 14v-3a1 1 0 00-2 0v2h-2a1 1 0 000 2h3a1 1 0 001-1zM1 20h3a1 1 0 100-2H2v-2a1 1 0 00-2 0v3a1 1 0 001 1zM0 1v3a1 1 0 102 0V2h2a1 1 0 100-2H1a1 1 0 00-1 1z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
