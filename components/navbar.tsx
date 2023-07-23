"use client"
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { AiOutlineMenu, AiOutlineLink } from "react-icons/ai";
import { HiX } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth"
import { usePathname } from "next/navigation";


/*
 * TODO::
 *
 */

const navigation = [
  { name: "Home", href: "/"},
  { name: "Analytics", href: "" },
  { name: "Your Profile", href: "/profile"},
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const path = usePathname()

  const [userAvatarURL, setUserAvatarURL] = useState("https://raw.githubusercontent.com/edilson258/files/main/1309537.png")
  const [_, setSession] = useState<Session | null>(null);
  const { data } = useSession();

  useEffect(() => {
    setSession(() => data);
    if(data && data.user?.image) {
      setUserAvatarURL(data.user.image)
    }
  }, [data])
 
  return (
    <Disclosure as="nav" className="z-50 shadow bg-white/30 sticky top-0 backdrop-blur-sm">
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <HiX className="block h-6 w-6 text-slate-700" aria-hidden="true" />
                  ) : (
                    <AiOutlineMenu
                      className="block h-6 w-6 text-slate-700"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <AiOutlineLink className="h-8 w-auto text-slate-700" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          path === item.href ? "bg-slate-700 text-white"
                            : "text-slate-700 hover:bg-slate-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                        aria-current={path === item.href ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="border border-2 border-slate-700 flex justify-center items-center h-8 w-8 flex rounded-full bg-white text-sm focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-auto rounded-full"
                        src={userAvatarURL}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={classNames(
                              active ? "bg-slate-100" : "",
                              "block px-4 py-2 text-sm text-slate-700",
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-slate-100" : "",
                              "block px-4 py-2 text-sm text-slate-700",
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => signOut()}
                            className={classNames(
                              active ? "bg-slate-100" : "",
                              "block px-4 py-2 text-sm text-slate-700",
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    path === item.href ? "bg-slate-700 text-white"
                      : "hover:bg-slate-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-slate-700 font-medium",
                  )}
                  aria-current={path === item.href ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
