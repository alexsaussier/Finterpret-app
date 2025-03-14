"use client";
/*import {
UserGroupIcon,
HomeIcon,
DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'; 
*/
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Portfolio Analysis",
    href: "/dashboard" /* add icon: HomeIcon at the end after you import icons*/,
  },
  {
    name: "Holdings Analysis",
    href: "/dashboard/analysis",
    /* icon: DocumentDuplicateIcon, */
  },
  {
    name: "Market Insights",
    href: "/dashboard/market",
  },
  { 
    name: "Cash Flow", 
    href: "/dashboard/cashflow" /* icon: UserGroupIcon */ 
  }
  
];

export default function NavLinks({ setIsOpen }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        /*const LinkIcon = link.icon;*/
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3"
            )}
            onClick={() => setIsOpen(false)}
            style={{
              color: pathname === link.href ? "#05d8be" : "",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <p className="md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
