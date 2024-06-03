import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/azureway.png";

import styles from "./Layout.module.css";

import { useLogin } from "../../authConfig";

import { LoginButton } from "../../components/LoginButton";

const Layout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>GPT + Enterprise data | AzureWay</h3>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li className={styles.headerNavLeftMargin}>
                                AzureWay <a href="https://azureway.cloud" target={"_blank"} title="AzureWay by Karol Pieciukiewicz">
                                    <img
                                        src={github}
                                        alt="Azureway logo"
                                        width="80px"
                                        height="80px"
                                        className={styles.githubLogo}
                                    />
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}>Azure OpenAI + AI Search</h4>
                    {useLogin && <LoginButton />}
                </div>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;
