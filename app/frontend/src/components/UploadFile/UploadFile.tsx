import React, { useState, ChangeEvent } from "react";
import { Callout, Label, Text } from "@fluentui/react";
import { Button } from "@fluentui/react-components";
import { Add24Regular, Delete24Regular } from "@fluentui/react-icons";
import { useMsal } from "@azure/msal-react";

import { SimpleAPIResponse, uploadFileApi, deleteUploadedFileApi, listUploadedFilesApi, configApi } from "../../api";
import { useLogin, getToken } from "../../authConfig";
import styles from "./UploadFile.module.css";

interface Props {
    className?: string;
    disabled?: boolean;
}

export const UploadFile: React.FC<Props> = ({ className, disabled }: Props) => {
    // State variables to manage the component behavior
    const [isCalloutVisible, setIsCalloutVisible] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deletionStatus, setDeletionStatus] = useState<{ [filename: string]: "pending" | "error" | "success" }>({});
    const [uploadedFile, setUploadedFile] = useState<SimpleAPIResponse>();
    const [uploadedFileError, setUploadedFileError] = useState<string>();
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [showGroupError, setShowGroupError] = useState<boolean>(true);

    if (!useLogin) {
        throw new Error("The UploadFile component requires useLogin to be true");
    }

    const client = useMsal().instance;

    // Handler for the "Manage file uploads" button
    const handleButtonClick = async () => {
        setIsCalloutVisible(!isCalloutVisible); // Toggle the Callout visibility

        // Update uploaded files by calling the API
        try {
            const idToken = await getToken(client);
            if (!idToken) {
                throw new Error("No authentication token available");
            }
            configApi(idToken).then(config => {
                setShowGroupError(!config.hasGroupAccess);
            });

            listUploadedFiles(idToken);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const listUploadedFiles = async (idToken: string) => {
        listUploadedFilesApi(idToken).then(files => {
            setIsLoading(false);
            setDeletionStatus({});
            setUploadedFiles(files);
        });
    };

    const handleRemoveFile = async (filename: string) => {
        setDeletionStatus({ ...deletionStatus, [filename]: "pending" });

        try {
            const idToken = await getToken(client);
            if (!idToken) {
                throw new Error("No authentication token available");
            }

            await deleteUploadedFileApi(filename, idToken);
            setDeletionStatus({ ...deletionStatus, [filename]: "success" });
            listUploadedFiles(idToken);
        } catch (error) {
            setDeletionStatus({ ...deletionStatus, [filename]: "error" });
            console.error(error);
        }
    };

    // Handler for the form submission (file upload)
    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setIsUploading(true); // Start the loading state
        const file: File = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const idToken = await getToken(client);
            if (!idToken) {
                throw new Error("No authentication token available");
            }
            const response: SimpleAPIResponse = await uploadFileApi(formData, idToken);
            setUploadedFile(response);
            setIsUploading(false);
            setUploadedFileError(undefined);
            listUploadedFiles(idToken);
        } catch (error) {
            console.error(error);
            setIsUploading(false);
            setUploadedFileError(`Error uploading file - please try again or contact admin.`);
        }
    };

    return showGroupError ? (
        <div className={`${styles.container} ${className ?? ""}`}>
            <div>
                <Button id="calloutButton" icon={<Add24Regular />} onClick={handleButtonClick}>
                    Manage file uploads
                </Button>
                {isCalloutVisible && (
                    <Callout
                        role="dialog"
                        gapSpace={0}
                        className={styles.callout}
                        target="#calloutButton"
                        onDismiss={() => setIsCalloutVisible(false)}
                        setInitialFocus
                    >
                        <h3>You do not have access to upload own files.</h3>
                        <h4>
                            Contact Karol Pieciukiewicz in <a href="https://www.linkedin.com/in/karol-pieciukiewicz/">LinkedIn portal</a> for granting access.
                        </h4>
                        <h4>Please remmember to create account in first place, then I can grant you access.</h4>
                        <h4>To keep your files available only for you, adjust security filters in Developer settings</h4>
                    </Callout>
                )}
            </div>
        </div>
    ) : (
        <div className={`${styles.container} ${className ?? ""}`}>
            <div>
                <Button id="calloutButton" icon={<Add24Regular />} disabled={disabled} onClick={handleButtonClick}>
                    Manage file uploads
                </Button>

                {isCalloutVisible && (
                    <Callout
                        role="dialog"
                        gapSpace={0}
                        className={styles.callout}
                        target="#calloutButton"
                        onDismiss={() => setIsCalloutVisible(false)}
                        setInitialFocus
                    >
                        <form encType="multipart/form-data">
                            <div>
                                <Label>Upload file:</Label>
                                <input
                                    accept=".txt, .md, .json, .png, .jpg, .jpeg, .bmp, .heic, .tiff, .pdf, .docx, .xlsx, .pptx, .html"
                                    className={styles.chooseFiles}
                                    type="file"
                                    onChange={handleUploadFile}
                                />
                            </div>
                        </form>

                        {/* Show a loading message while files are being uploaded */}
                        {isUploading && <Text>{"Uploading files..."}</Text>}
                        {!isUploading && uploadedFileError && <Text>{uploadedFileError}</Text>}
                        {!isUploading && uploadedFile && <Text>{uploadedFile.message}</Text>}

                        {/* Display the list of already uploaded */}
                        <h3>Previously uploaded files:</h3>

                        {isLoading && <Text>Loading...</Text>}
                        {!isLoading && uploadedFiles.length === 0 && <Text>No files uploaded yet</Text>}
                        {uploadedFiles.map((filename, index) => {
                            return (
                                <div key={index} className={styles.list}>
                                    <div className={styles.item}>{filename}</div>
                                    {/* Button to remove a file from the list */}
                                    <Button
                                        icon={<Delete24Regular />}
                                        onClick={() => handleRemoveFile(filename)}
                                        disabled={deletionStatus[filename] === "pending" || deletionStatus[filename] === "success"}
                                    >
                                        {!deletionStatus[filename] && "Delete file"}
                                        {deletionStatus[filename] == "pending" && "Deleting file..."}
                                        {deletionStatus[filename] == "error" && "Error deleting."}
                                        {deletionStatus[filename] == "success" && "File deleted"}
                                    </Button>
                                </div>
                            );
                        })}
                    </Callout>
                )}
            </div>
        </div>
    );
};
