import Image from "next/image"
import Link from "next/link"

import { ChevronDown, Menu } from "lucide-react"

import kexchange from "../../public/kexchange.svg"
import kexchangeLogo from "../../public/kexchange-logo.svg"
import ThemeSwitcher from "./ThemeSwitcher"
import Account from "./Account"

type Props = {}

const Header = (props: Props) => {
    return (
        <header className='h-16 bg-black text-neutral-300'>
            <div className='w-full h-full flex justify-between items-center lg:px-0 px-4 max-w-screen-lg mx-auto'>
                <div className="flex items-center gap-x-8">
                    <div>
                        <Image src={kexchange} width={140} className="aspect-auto sm:inline-block hidden" alt="kexchange logo" />
                        <Image src={kexchangeLogo} width={24} alt="kexchange" className="sm:hidden inline-block" />
                    </div>
                    {/* TRENDING PAYMENTS */}
                    <div className="text-sm md:inline-flex w-fit gap-x-4 items-center hidden">
                        <div className="flex gap-x-1 items-center">
                            <span>Trending Payments</span>
                            <ChevronDown size={18} />
                        </div>
                        <div>
                            <Link href={"/support"}>Support</Link>
                        </div>
                        <div>Terms of Service</div>
                    </div>
                </div>
                {/* MENU */}
                <div className="flex gap-x-4 items-center">
                    <ThemeSwitcher />
                    <Account />
                    <div className="block md:hidden"><Menu /></div>
                </div>
            </div>
        </header>
    )
}

export default Header