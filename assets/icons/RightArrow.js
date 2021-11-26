import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={15.74}
      height={12.001}
      {...props}
    >
      <Path
        d="M0 4.5a.5.5 0 01.144-.354A.486.486 0 01.491 4h11.573L8.976.855a.507.507 0 010-.708.485.485 0 01.695 0l3.925 4a.5.5 0 01.107.162.509.509 0 010 .383.5.5 0 01-.107.162l-3.925 4a.485.485 0 01-.695 0 .507.507 0 010-.708L12.064 5H.491a.486.486 0 01-.347-.146A.5.5 0 010 4.5z"
        fill={props.color || '#fff'}
      />
    </Svg>
  )
}

export default SvgComponent
