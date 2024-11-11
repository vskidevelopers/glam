import React, { useState, useEffect, Fragment } from 'react';
import glamLogo from '../assets/navlogo.png'; // Replace with your actual logo path
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, useAuthenticationFunctions } from '@/utils/firebase';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

const navItems = [
    { name: 'Categories', href: '#categories' },
    { name: 'Shop', href: '#shop' },
    { name: 'About Us', href: '#about' },
    { name: 'Recipes', href: '#recipes' },
    { name: 'Contact', href: '#contact' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { logout, createClientUser } = useAuthenticationFunctions();

    const handleClientLogin = async () => {
        setLoading(true);
        try {
            const response = await createClientUser();
            if (response?.success) {
                setUser(response.user);
                navigate('/shop');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuthenticated(false);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setIsAuthenticated(!!currentUser);
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Disclosure as="nav" className="bg-jonquil-500/50 text-black shadow-md fixed w-full z-50">
            {({ open }) => (
                <>
                    <div className="container mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <img src={glamLogo} alt="Glam Your Kitchen Logo" className="w-full h-12 mr-2" />
                        </div>

                        <div className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-white hover:text-flame-500 transition duration-200 font-medium"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Shopping Cart Icon */}
                            <butto className="relative text-black hover:text-flame-500">
                                <ShoppingCartIcon className="w-6 h-6" />
                            </butto>

                            {/* Profile/Login Button */}
                            {isAuthenticated && user ? (
                                <Menu as="div" className="relative">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'}
                                                alt="User Avatar"
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
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none rounded-md">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="/profile"
                                                        className={classNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        Your Profile
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={classNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        Sign out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                // Dialog for Login
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-robin-egg-blue-400 text-black py-2 px-4 rounded-lg font-semibold hover:bg-robin-egg-blue/80 transition duration-200">
                                            {loading ? 'Logging in...' : 'Log In'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="text-center">
                                                Only Google users can create accounts
                                            </DialogTitle>
                                            <DialogDescription>
                                                <Button
                                                    className="w-full bg-red-500 hover:bg-red-600"
                                                    type="button"
                                                    onClick={handleClientLogin}
                                                >
                                                    {loading ? 'Logging in...' : 'Use your Google Account'}
                                                </Button>
                                                <p className="text-center mt-4">
                                                    If you are a hotel looking to manage bookings, please{' '}
                                                    <a
                                                        href="/login"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        click here
                                                    </a>{' '}
                                                    to sign in with your hotel account.
                                                </p>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Disclosure.Button className="text-black focus:outline-none">
                                {open ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </Disclosure.Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <Disclosure.Panel className="md:hidden bg-jonquil-400 text-black shadow-lg">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navItems.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className="block px-4 py-2 text-black hover:bg-flame-500 hover:text-white transition duration-200"
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="px-4 pb-3 text-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="block w-full bg-sky-500 text-black font-semibold rounded-lg py-2 hover:bg-sky-500/80 transition duration-200">
                                        {isAuthenticated ? 'Log Out' : loading ? 'Logging in...' : 'Log In'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-center">
                                            Only Google users can create accounts
                                        </DialogTitle>
                                        <DialogDescription>
                                            <Button
                                                className="w-full bg-red-500 hover:bg-red-600"
                                                type="button"
                                                onClick={handleClientLogin}
                                            >
                                                {loading ? 'Logging in...' : 'Use your Google Account'}
                                            </Button>
                                            <p className="text-center mt-4">
                                                If you are a hotel looking to manage bookings, please{' '}
                                                <a href="/login" className="text-blue-500 hover:underline">
                                                    click here
                                                </a>{' '}
                                                to sign in with your hotel account.
                                            </p>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

export default Navbar;
