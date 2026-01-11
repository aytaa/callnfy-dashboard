import {useState, useEffect, useRef} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {
    Home,
    Phone as PhoneIcon,
    Calendar,
    Users,
    Bot,
    Hash,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    LogOut,
    User,
    Settings,
} from 'lucide-react';
import clsx from 'clsx';
import SearchModal from './SearchModal';
import {logout} from '../slices/authSlice';
import {useGetMeQuery} from '../slices/apiSlice/authApiSlice';
import {useGetBusinessesQuery} from '../slices/apiSlice/businessApiSlice';


function Sidebar({isOpen, onClose}) {

    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {data: userData, isLoading: isLoadingUser, error: userError} = useGetMeQuery(undefined, {
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });
    const {data: businessData, isLoading: isLoadingBusiness} = useGetBusinessesQuery();

    // Get user email and name from API data, with localStorage fallback
    const getUserFromStorage = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr && userStr !== 'undefined' && userStr !== 'null') {
                return JSON.parse(userStr);
            }
            return {email: '', name: ''};
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return {email: '', name: ''};
        }
    };

    const localUser = getUserFromStorage();
    const apiUser = userData;
    const business = businessData?.[0];

    // Prefer API data over localStorage
    const userEmail = apiUser?.email || localUser.email || 'User';
    const userName = apiUser?.name || localUser.name || 'User';
    const businessName = business?.name || 'Business';
    const businessInitial = businessName.charAt(0).toUpperCase();
    const userInitial = userName.charAt(0).toUpperCase();

    // Save collapse state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setEmailDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Global keyboard shortcut for Command+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchModalOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const menuSections = [
        {
            title: 'MAIN',
            items: [
                {icon: Home, label: 'Overview', path: '/overview'},
                {icon: PhoneIcon, label: 'Calls', path: '/calls'},
                {icon: Calendar, label: 'Appointments', path: '/appointments'},
                {icon: Users, label: 'Customers', path: '/customers'},
                {icon: Bot, label: 'AI Assistant', path: '/ai-assistant'},
                {icon: Hash, label: 'Phone Numbers', path: '/phone-numbers'},
            ],
        },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setEmailDropdownOpen(false);
    };

    const handleDropdownItemClick = (action) => {
        setEmailDropdownOpen(false);
        if (action === 'settings') {
            navigate('/settings');
        } else if (action === 'account') {
            navigate('/settings/profile');
        } else if (action === 'logout') {
            handleLogout();
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleUpgrade = () => {
        // Navigate to select plan page instead of directly creating checkout
        navigate('/select-plan');
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={clsx(
                    'fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#111114] border-r border-gray-200 dark:border-zinc-800 transition-all duration-300 ease-in-out',
                    'flex flex-col',
                    isCollapsed ? 'w-16' : 'w-60',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Top Section */}
                <div className={clsx('p-4 space-y-3', isCollapsed && 'px-2')}>
                    {/* Logo + Collapse Button */}
                    <div className="flex items-center justify-between mb-2">
                        {isCollapsed ? (
                            <div className="w-full flex justify-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white"
                                      style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>C</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg font-bold text-gray-900 dark:text-white"
                                      style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={toggleCollapse}
                                        className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                                        title="Collapse sidebar"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-white"/>
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors lg:hidden"
                                    >
                                        <X className="w-4 h-4 text-gray-700 dark:text-white"/>
                                    </button>
                                </div>
                            </>
                        )}
                        {isCollapsed && (
                            <button
                                onClick={toggleCollapse}
                                className="hidden lg:block absolute right-2 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                                title="Expand sidebar"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-700 dark:text-white"/>
                            </button>
                        )}
                    </div>

                    {/* Email/Organization Section with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setEmailDropdownOpen(!emailDropdownOpen)}
                            className={clsx(
                                'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors',
                                isCollapsed && 'justify-center px-0'
                            )}
                            title={isCollapsed ? businessName : ''}
                        >
                            {/* Avatar Circle */}
                            <div
                                className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#262626] flex items-center justify-center flex-shrink-0">
                                {isLoadingBusiness ? (
                                    <div className="w-3 h-3 border border-gray-400 dark:border-white/30 border-t-gray-700 dark:border-t-white rounded-full animate-spin"/>
                                ) : (
                                    <span className="text-gray-900 dark:text-white text-xs font-semibold">{businessInitial}</span>
                                )}
                            </div>
                            {!isCollapsed && (
                                <>
                                    {/* Business Name */}
                                    <span className="text-sm text-gray-900 dark:text-white truncate flex-1 text-left">
                                        {isLoadingBusiness ? 'Loading...' : businessName}
                                    </span>
                                    {/* Chevron */}
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-700 dark:text-white flex-shrink-0"/>
                                </>
                            )}
                        </button>

                        {/* Email Dropdown Menu */}
                        {emailDropdownOpen && (
                            <div
                                className={clsx(
                                    'absolute top-full mt-2 bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-lg shadow-lg py-2 z-50',
                                    isCollapsed ? 'left-16' : 'left-0 right-0'
                                )}
                                style={isCollapsed ? {minWidth: '200px'} : {}}
                            >
                                <button
                                    onClick={() => handleDropdownItemClick('account')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                                >
                                    <User className="w-4 h-4"/>
                                    <span>Account Settings</span>
                                </button>
                                <button
                                    onClick={() => handleDropdownItemClick('settings')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                                >
                                    <Settings className="w-4 h-4"/>
                                    <span>Settings</span>
                                </button>
                                <div className="my-1 border-t border-gray-200 dark:border-[#303030]"/>
                                <button
                                    onClick={() => handleDropdownItemClick('logout')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                                >
                                    <LogOut className="w-4 h-4"/>
                                    <span>Sign out</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    {!isCollapsed && (
                        <button
                            onClick={() => setSearchModalOpen(true)}
                            className="w-full h-9 flex items-center justify-between px-3 rounded-lg border border-gray-200 dark:border-[#303030] bg-transparent hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-500 dark:text-white"/>
                                <span className="text-sm text-gray-500 dark:text-white">Search</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-white font-medium">⌘K</span>
                        </button>
                    )}

                    {isCollapsed && (
                        <button
                            onClick={() => setSearchModalOpen(true)}
                            className="w-full h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#303030] bg-transparent hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                            title="Search (⌘K)"
                        >
                            <Search className="w-4 h-4 text-gray-500 dark:text-white"/>
                        </button>
                    )}

                </div>

                {/* Navigation */}
                <nav className={clsx('flex-1 overflow-y-auto px-3 py-2', isCollapsed && 'px-2')}>
                    {/* Menu Sections */}
                    {menuSections.map((section) => (
                        <div key={section.title} className="mb-6 first:mt-0 mt-6">
                            {!isCollapsed && (
                                <h3 className="px-3 mb-2 text-[11px] font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    {section.title}
                                </h3>
                            )}
                            <ul className="space-y-0.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.path}>
                                            <NavLink
                                                to={item.path}
                                                onClick={onClose}
                                                className={({isActive}) =>
                                                    clsx(
                                                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                                                        isCollapsed && 'justify-center px-0',
                                                        isActive
                                                            ? 'bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white'
                                                            : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#262626]'
                                                    )
                                                }
                                                title={isCollapsed ? item.label : ''}
                                            >
                                                <Icon className="w-4 h-4 text-gray-700 dark:text-white" strokeWidth={1.5}/>
                                                {!isCollapsed && <span>{item.label}</span>}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className={clsx('p-3 space-y-2', isCollapsed && 'px-2')}>
                    {/* Plan Badge and Trial Status */}
                    {!isCollapsed && (() => {
                        const user = userData;
                        const subscriptionStatus = user?.subscriptionStatus;
                        const trialEndsAt = user?.trialEndsAt;

                        // Calculate days remaining if on trial
                        let daysRemaining = null;
                        if (subscriptionStatus === 'trialing' && trialEndsAt) {
                            const now = new Date();
                            const endDate = new Date(trialEndsAt);
                            const diffTime = endDate - now;
                            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        }

                        return (
                            <div className="px-3 py-2">
                                <div className="flex items-center justify-between mb-2">
                                    {subscriptionStatus === 'trialing' && daysRemaining !== null ? (
                                        <>
                                            <span
                                                className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-xs font-medium rounded border border-gray-200 dark:border-[#303030]">
                                                TRIAL
                                            </span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expires today'}
                                            </span>
                                        </>
                                    ) : subscriptionStatus === 'active' ? (
                                        <>
                                            <span
                                                className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-xs font-medium rounded">
                                                {user?.planName?.toUpperCase() || 'STARTER'}
                                            </span>
                                            {user?.usageMinutes !== undefined && user?.planMinutes !== undefined && (
                                                <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                    {user.usageMinutes} / {user.planMinutes} min
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded">
                                                FREE
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Start trial</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Upgrade Button */}
                    {!isCollapsed && (() => {
                        const user = userData;
                        const subscriptionStatus = user?.subscriptionStatus;

                        // Only show upgrade button if on trial or no subscription
                        const showUpgrade = subscriptionStatus !== 'active';

                        if (!showUpgrade) return null;

                        return (
                            <button
                                onClick={handleUpgrade}
                                className="w-full px-3 py-2 text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-[#303030] hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors">
                                Upgrade
                            </button>
                        );
                    })()}
                </div>
            </aside>

            {/* Search Modal */}
            <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)}/>
        </>
    );
}

export default Sidebar;
