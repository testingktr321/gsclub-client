import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    const footerLinks = [
        { title: "Privacy Policy", href: "/" },
        { title: "Terms and Conditions", href: "/" },
        { title: "Return Policy", href: "/" },
        { title: "Shipping Policy", href: "/" },
        { title: "Contact", href: "/" },
    ];

    return (
        <section className="bg-black text-white py-5 w-11/12 mx-auto font-unbounded">
            <div className="flex flex-row items-center justify-between gap-6">
                <div>
                    <Link href={"/"}>
                        <Image
                            src="/images/logo_white.png"
                            width={200}
                            height={200}
                            alt="getsmoke_logo"
                            className="object-contain w-[160px] md:w-[200px]"
                        />
                    </Link>
                </div>
                <div className="mt-2 lg:mt-0 flex flex-col lg:flex-row items-end justify-center md:justify-end gap-2 xl:gap-10 text-[10px] md:text-sm">
                    {footerLinks.map(({ title, href }) => (
                        <Link key={title} href={href} className="hover:underline">
                            {title}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Footer;
