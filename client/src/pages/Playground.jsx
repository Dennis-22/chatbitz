import { useLocation } from "react-router-dom"
import { _Connect } from "../utils/types"

export default function Playground(){
    // const location = useLocation()
    const connectType = useLocation().state.connectType
    console.log(connectType)
    return <h1>Play</h1>
}