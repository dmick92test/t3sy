import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { AppShell, Avatar, Burger, Button, Group, Header, MediaQuery, Menu, Navbar, Text, ThemeIcon, UnstyledButton, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { IconBriefcase, IconChevronDown, IconHeart, IconLogout, IconMessage, IconSettings, IconStar, IconSwitchHorizontal } from "@tabler/icons-react"
import { type PropsWithChildren, } from "react";

import Link from "next/link";

export const AppShellLayout = (props: PropsWithChildren) => {
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const { user, isSignedIn } = useUser();

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    {/* Grow section will take all available space that is not taken by first and last sections */}
                    <Navbar.Section grow>
                        <UnstyledButton
                            sx={(theme) => ({
                                display: 'block',
                                width: '100%',
                                padding: theme.spacing.xs,
                                borderRadius: theme.radius.sm,
                                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                                '&:hover': {
                                    backgroundColor:
                                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                },
                            })}
                            component={Link}
                            href="/jobs"
                        >
                            <Group>
                                <ThemeIcon color='blue' variant="light">
                                    <IconBriefcase size="1rem" />
                                </ThemeIcon>

                                <Text size="sm">Jobs</Text>
                            </Group>
                        </UnstyledButton>
                    </Navbar.Section>


                    {/* Last section with normal height (depends on section content) */}


                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Navbar.Section>
                            <Button component={SignOutButton}>Sign Out</Button>
                        </Navbar.Section>
                    </MediaQuery>
                </Navbar>
            }
            // footer={
            //   <Footer height={60} p="md">
            //     Application footer
            //   </Footer>
            // }
            header={
                <Header height={{ base: 50, md: 70 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        <Text variant="gradient" fz="xl" fw={700} component={Link} href="/">Shiftyourself</Text>
                        {isSignedIn &&
                            <>
                                <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
                                    <Menu
                                        width={260}
                                        position="bottom-end"
                                        transitionProps={{ transition: 'pop-top-right' }}
                                        withinPortal
                                    >
                                        <Menu.Target>
                                            <UnstyledButton>
                                                <Group spacing={7}>
                                                    <Avatar src={user?.profileImageUrl} alt={user?.fullName || "Profile Image"} radius="xl" size={25} />
                                                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                                        {user?.fullName}
                                                    </Text>
                                                    <IconChevronDown size={16} stroke={1.5} />
                                                </Group>
                                            </UnstyledButton>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item component={Link} href={user.username!}>Profile</Menu.Item>
                                            <Menu.Item
                                                icon={<IconHeart size="0.9rem" color={theme.colors.red[6]} stroke={1.5} />}
                                            >
                                                Liked posts
                                            </Menu.Item>
                                            <Menu.Item
                                                icon={<IconStar size="0.9rem" color={theme.colors.yellow[6]} stroke={1.5} />}
                                            >
                                                Saved posts
                                            </Menu.Item>
                                            <Menu.Item
                                                icon={<IconMessage size="0.9rem" color={theme.colors.blue[6]} stroke={1.5} />}
                                            >
                                                Your comments
                                            </Menu.Item>

                                            <Menu.Label>Settings</Menu.Label>
                                            <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
                                                Account settings
                                            </Menu.Item>
                                            <Menu.Item icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}>
                                                Change account
                                            </Menu.Item>
                                            {/* <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />} onClick={() => { signOut(); }}>Sign Out</Menu.Item> */}
                                            <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />}><SignOutButton>Sign Out</SignOutButton></Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </MediaQuery>

                                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                    <Burger
                                        opened={opened}
                                        onClick={toggle}
                                        size="sm"
                                        color={theme.colors.gray[6]}
                                        mr="xl"
                                    />
                                </MediaQuery>
                            </>
                        }
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={toggle}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        {!isSignedIn && <Button component={SignInButton}>Sign In</Button>}
                    </div>
                </Header>
            }
        >
            {props.children}
        </AppShell>
    )
}