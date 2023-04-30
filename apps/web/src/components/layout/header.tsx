import { Anchor, Avatar, Burger, createStyles, Divider, Group, Header, Menu, Paper, Stack, Switch, Text, Transition, UnstyledButton, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconHelp, IconLogout, IconTicket, IconUser, IconChartInfographic, IconHeartHandshake, IconSun, IconMoonStars } from "@tabler/icons";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
    },

    links: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("xs")]: {
            display: "none",
        },
    },

    dropdown: {
        position: "absolute",
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: "hidden",

        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan("sm")]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
    },
}));

const CustomHeader = () => {
    const { user, logout, isEmployer, isEmployee } = useAuth();
    const initials = user.name.split(" ")[0].substring(0, 1) + user.name.split(" ")[1].substring(0, 1);

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    const location = useLocation();

    const { classes, cx } = useStyles();

    const [opened, { toggle, close }] = useDisclosure(false);

    const employerLinks = [
        {
            label: "Dashboard",
            link: "/dashboard",
        },
        {
            label: "Schedule",
            link: "/schedule",
        },
        {
            label: "Positions",
            link: "/position",
        },
        {
            label: "Employees",
            link: "/employee",
        },
        {
            label: "Applications",
            link: "/application",
        },
        {
            label: "Find People",
            link: "/findpeople",
        },
    ];

    const employeeLinks = [
        {
            label: "Dashboard",
            link: "/dashboard",
        },
        {
            label: "Find Shifts",
            link: "/findshift",
        },
        {
            label: "Shift Manager",
            link: "/shift",
        },
        {
            label: "Available Positions",
            link: "/jobfair",
        },
    ];

    const links = isEmployer() ? employerLinks : isEmployee() ? employeeLinks : [];

    const [active, setActive] = useState(location.pathname);

    const menu = links.map((link, idx) => (
        <Link
            key={link.label}
            to={link.link}
            className={cx(classes.link, { [classes.linkActive]: active === link.link })}
            onClick={() => {
                //TODO fix breakage when navigating to cart
                setActive(link.link);
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <Header height={HEADER_HEIGHT} px="md">
            <Group position="apart" sx={{ height: "100%" }}>
                <Text>Logo</Text>
                <Group className={classes.links}>{menu}</Group>
                <Group className={classes.links}>
                    <Switch
                        checked={colorScheme === "dark"}
                        onChange={() => toggleColorScheme()}
                        size="sm"
                        onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
                        offLabel={<IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />}
                    />
                    <Menu width={200} position="bottom-end">
                        <Menu.Target>
                            <UnstyledButton>
                                <Group spacing={7}>
                                    <Avatar src={user.image} alt={user.name} radius="xl" size={30}>
                                        {initials}
                                    </Avatar>
                                    <Stack spacing={0}>
                                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                            {user.name}
                                        </Text>
                                        <Text color="dimmed" weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                            {user.account}
                                        </Text>
                                    </Stack>
                                    <IconChevronDown size={12} stroke={1.5} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item component={Link} to="/profile" icon={<IconUser size={14} stroke={1.5} />}>
                                <Text>Profile</Text>
                            </Menu.Item>
                            {isEmployer() && (
                                <>
                                    <Menu.Item component={Link} to="/reports" icon={<IconChartInfographic size={14} stroke={1.5} />} disabled>
                                        <Text>Reports</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        component={Anchor}
                                        href="https://booking.shiftyourself.ca/#/customer/training?Name=David%20Williams&Email=david@c3-solutions.ca"
                                        target="_blank"
                                        icon={<IconHeartHandshake size={14} stroke={1.5} />}
                                    >
                                        <Text style={{ textDecoration: "none" }}>Book Training</Text>
                                    </Menu.Item>
                                </>
                            )}

                            <Menu.Label>Support</Menu.Label>
                            <Menu.Item icon={<IconTicket size={14} stroke={1.5} />} disabled>
                                Submit Ticket
                            </Menu.Item>
                            <Menu.Item icon={<IconHelp size={14} stroke={1.5} />} disabled>
                                Help
                            </Menu.Item>

                            <Menu.Label>
                                <Divider />
                            </Menu.Label>
                            <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} onClick={logout}>
                                Sign Out
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {menu}
                            <Link
                                to="/profile"
                                className={cx(classes.link, { [classes.linkActive]: active === "/profile" })}
                                onClick={() => {
                                    setActive("/profile");
                                }}
                            >
                                Profile
                            </Link>
                            {isEmployer() && (
                                <>
                                    <Link
                                        to="/reports"
                                        className={cx(classes.link, { [classes.linkActive]: active === "/reports" })}
                                        onClick={() => {
                                            setActive("/reports");
                                        }}
                                    >
                                        Reports
                                    </Link>
                                    <Anchor href="https://booking.shiftyourself.ca/#/customer/training?Name=David%20Williams&Email=david@c3-solutions.ca" target="_blank" className={cx(classes.link)}>
                                        Book Training
                                    </Anchor>
                                </>
                            )}
                        </Paper>
                    )}
                </Transition>
            </Group>
        </Header>
    );
};

export default CustomHeader;
