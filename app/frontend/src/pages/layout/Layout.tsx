import { Outlet, NavLink, Link } from "react-router-dom";

import github from "../../assets/azureway.png";

import styles from "./Layout.module.css";

import { useLogin } from "../../authConfig";

import { LoginButton } from "../../components/LoginButton";

const Layout = () => {
    return (
        <meta name="author" content="Karol Pieciukiewicz" />
        <meta name="keywords" content="Retrieval Augmented Generation, RAG, Azure OpenAI, ChatGPT, Chat, RAG Free demo, own files, RAG chat, own data, upload files, index files" />
        <meta name="description" content="Retrieval Augmented Generation based on the Azure OpenAI with possibilty to index own documents. Free access." />

        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <a href="https://azureway.cloud" target={"_blank"} className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>RAG with your data | AzureWay</h3>
                    </a>
                    <h4 className={styles.headerRightText}>AzureWay</h4>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li className={styles.headerNavLeftMargin}>
                                 <a href="https://azureway.cloud" target={"_blank"} title="AzureWay by Karol Pieciukiewicz">
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
