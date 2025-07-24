"use client"

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { twMerge } from 'tailwind-merge'

type Props = {}

const ThemeSwitcher = (props: Props) => {

    const [isMounted, setIsMounted] = useState(false)
    const { resolvedTheme, theme, setTheme } = useTheme()

    useEffect(() => setIsMounted(true), [])

    if (!isMounted) return

    return (
        <div className='h-6 inline-flex gap-x-[2px] px-[2px] py-[2px] rounded-full bg-neutral-700 text-neutral-200'>
            <button onClick={() => setTheme("light")} className={twMerge('flex p-[2px] rounded-full text-neutral-100', (resolvedTheme == "light" || theme == "light") && "text-neutral-700 bg-neutral-100")}><Sun size={16}/></button>
            <button onClick={() => setTheme("dark")} className={twMerge('flex p-[2px] rounded-full text-neutral-100', (resolvedTheme == "dark" || theme == "dark") && "text-neutral-100 bg-neutral-900")}><Moon size={16}/></button>
        </div>
    )
}

export default ThemeSwitcher