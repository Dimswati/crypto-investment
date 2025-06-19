import React from 'react'

type Props = {
    code: string
}

const VerifyEmailTemplate = ({ code }: Props) => {
    return (
        <div>Your email verification code is: {code}</div>
    )
}

export default VerifyEmailTemplate