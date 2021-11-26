import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={24}
      {...props}
    >
      <Path
        d="M17.999 13.728v2.559a1.709 1.709 0 01-1.863 1.706 16.937 16.937 0 01-7.377-2.619 16.651 16.651 0 01-5.129-5.118A16.861 16.861 0 011.006 2.86 1.708 1.708 0 012.707 1h2.564a1.708 1.708 0 011.71 1.467 10.936 10.936 0 00.6 2.4 1.7 1.7 0 01-.385 1.8L6.109 7.748a13.663 13.663 0 005.129 5.118l1.086-1.083a1.712 1.712 0 011.8-.384 10.993 10.993 0 002.4.6 1.707 1.707 0 011.475 1.729z"
        fill="none"
        stroke="#2b7ec1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  )
}

export default SvgComponent
