import React, { useEffect, useState, useCallback } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";

const navLinks = [
	{
		icon: "bi-compass",
		route: "/",
		label: "Explore",
	},
	{
		icon: "bi-tag",
		route: "/offers",
		label: "Offers",
	},
	{
		icon: "bi-person-fill",
		route: "/profile",
		label: "Profile",
	},
]

const getIcon = (theme) => {
	switch (theme) {
		case 'light':
			return <i className="bi bi-brightness-high-fill"></i>;
		case 'dark':
			return <i className="bi bi-moon-stars-fill"></i>;
		case 'auto':
			return <i className="bi bi-circle-half"></i>;
		default:
			return null;
	}
};

const CustomNavbar = () => {

	const location = useLocation();

	const pathMatchRoute = (route) => route === location.pathname;

	/**Local store implementation */
	const getStoredTheme = useCallback(() => localStorage.getItem('theme'), []);
	const setStoredTheme = useCallback((theme) => localStorage.setItem('theme', theme), []);

	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme();
		if (storedTheme) {
			return storedTheme;
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	/** Initial states */
	const [selectedTheme, setSelectedTheme] = useState(getPreferredTheme);
	const [activeNav, setActiveNav] = useState("/"); //screens/component

	const setTheme = useCallback((theme) => {
		const rootElement = document.documentElement; //html
		if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			rootElement.setAttribute('data-bs-theme', 'dark');
		} else {
			rootElement.setAttribute('data-bs-theme', theme);
		}
	}, []);


	/**Function to handle the theme change */
	const handleThemeChange = (theme) => {
		setStoredTheme(theme);
		setTheme(theme);
		setSelectedTheme(theme);
	};

	const onThemeChange = () => {
		const storedTheme = getStoredTheme();
		if (storedTheme !== 'light' && storedTheme !== 'dark') {
			setTheme(getPreferredTheme());
		}
	};

	useEffect(() => {
		setTheme(getPreferredTheme());

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		mediaQuery.addEventListener('change', onThemeChange);

		// Cleanup event listener when component unmounts
		return () => {
			mediaQuery.removeEventListener('change', onThemeChange);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/** Function is called on nav change */
	const onNavChange = (key) => {
		setActiveNav(key)
	}

	return (
		<footer className="fixed-bottom bg-success-subtle py-10 ">
			<Container>
				<div className="d-flex flex-nowrap  align-items-center  justify-content-center gap-30 ">
					<Nav className="justify-content-center gap-30" activeKey={activeNav} onSelect={(selectedKey) => onNavChange(selectedKey)}>
						{navLinks.map((navItem) => (
							<Nav.Item key={navItem.label}>
								<NavLink to={navItem.route} className={`fw-bold text-center d-lg-flex align-items-center ${pathMatchRoute(navItem.route) ? 'text-success' : "text-dark"}`}><i className={`bi me-0 fs-24 me-lg-5 d-block d-lg-inline ${navItem.icon}`}></i>{navItem.label}</NavLink>
							</Nav.Item>
						))}
					</Nav>
					<Dropdown>
						<Dropdown.Toggle variant=" " size="sm" aria-label="Theme toggler" className="fw-bold d-flex align-items-center border-0 justify-content-center p-0 gap-5 text-dark">
							{getIcon(selectedTheme)}<span className="d-none d-lg-block">{selectedTheme === 'auto' ? 'Auto' : `${selectedTheme.charAt(0).toUpperCase()}${selectedTheme.slice(1)}`}</span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item
								active={selectedTheme === 'light' ? 'active' : ''}
								onClick={() => handleThemeChange('light')}
							>
								{getIcon('light')} Light
							</Dropdown.Item>
							<Dropdown.Item
								active={selectedTheme === 'dark' ? 'active' : ''}
								onClick={() => handleThemeChange('dark')}
							>
								{getIcon('dark')} Dark
							</Dropdown.Item>
							<Dropdown.Item
								active={selectedTheme === 'auto' ? 'active' : ''}
								onClick={() => handleThemeChange('auto')}
							>
								{getIcon('auto')} Auto
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</Container>
		</footer >
	);
};

export default CustomNavbar;
