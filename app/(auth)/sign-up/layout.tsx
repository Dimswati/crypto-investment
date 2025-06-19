"use client"

import { SignUpFlowProvider } from "../../context/SignupFlowContext"
import StepTabs from "../components/StepTabs"

type Props = {
    children: React.ReactNode
}

const SignUpLayout = ({ children }: Props) => {

    return (
        <SignUpFlowProvider>
            <StepTabs/>
            {children}
        </SignUpFlowProvider>
    )
}

export default SignUpLayout