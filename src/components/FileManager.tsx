import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonInput,
  IonItem,
  IonLabel,
  IonList
} from "@ionic/react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FileManager: React.FC = () => {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileList, setFileList] = useState<string[]>([]);

  const folderName = "documents"; // New folder name

  // Fetch files from folder
  const fetchFiles = async () => {
    try {
      const res = await Filesystem.readdir({
        path: folderName,
        directory: Directory.Documents,
      });
      setFileList(res.files);
    } catch (err) {
      setFileList([]);
      console.error("Folder may not exist yet:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Write file
  const writeFile = async () => {
    if (!fileName) return alert("Enter a file name.");

    try {
      await Filesystem.writeFile({
        path: `${folderName}/${fileName}`,
        data: fileContent || "Default content",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true,
      });
      alert(`File "${fileName}" written!`);
      setFileName("");
      setFileContent("");
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("Failed to write file.");
    }
  };

  // Read file
  const readFile = async (name: string) => {
    try {
      const res = await Filesystem.readFile({
        path: `${folderName}/${name}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert(`Content of "${name}":\n${res.data}`);
    } catch (err) {
      alert("Cannot read file.");
      console.error(err);
    }
  };

  // Append to file
  const appendToFile = async (name: string) => {
    try {
      await Filesystem.appendFile({
        path: `${folderName}/${name}`,
        data: "\nAppended line",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert(`Content appended to "${name}"!`);
    } catch (err) {
      alert("Cannot append.");
      console.error(err);
    }
  };

  // Delete file
  const deleteFile = async (name: string) => {
    try {
      await Filesystem.deleteFile({
        path: `${folderName}/${name}`,
        directory: Directory.Documents,
      });
      alert(`File "${name}" deleted!`);
      fetchFiles();
    } catch (err) {
      alert("Cannot delete file.");
      console.error(err);
    }
  };

  // Create subfolder inside new folder
  const createFolder = async () => {
    try {
      await Filesystem.mkdir({
        path: `${folderName}/subfolder`,
        directory: Directory.Documents,
        recursive: true,
      });
      alert("Subfolder created!");
    } catch (err) {
      alert("Folder already exists or cannot be created.");
    }
  };

  // Delete subfolder
  const deleteFolder = async () => {
    try {
      await Filesystem.rmdir({
        path: `${folderName}/subfolder`,
        directory: Directory.Documents,
      });
      alert("Subfolder deleted!");
    } catch (err) {
      alert("Cannot delete folder or folder does not exist.");
      console.error(err);
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">File Name</IonLabel>
            <IonInput
              value={fileName}
              onIonChange={(e) => setFileName(e.detail.value!)}
              placeholder="Enter filename"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">File Content</IonLabel>
            <IonInput
              value={fileContent}
              onIonChange={(e) => setFileContent(e.detail.value!)}
              placeholder="Enter content"
            />
          </IonItem>
          <IonButton expand="block" onClick={writeFile}>
            Create / Write File
          </IonButton>
          <IonButton expand="block" onClick={createFolder}>
            Create Subfolder
          </IonButton>
          <IonButton expand="block" color="danger" onClick={deleteFolder}>
            Delete Subfolder
          </IonButton>
        </IonCol>

        <IonCol>
          <h3>Files in {folderName}:</h3>
          <IonList>
            {fileList.length === 0 && <p>No files yet</p>}
            {fileList.map((file) => (
              <IonItem key={file}>
                <IonLabel>{file}</IonLabel>
                <IonButton size="small" onClick={() => readFile(file)}>
                  Read
                </IonButton>
                <IonButton size="small" onClick={() => appendToFile(file)}>
                  Append
                </IonButton>
                <IonButton
                  size="small"
                  color="danger"
                  onClick={() => deleteFile(file)}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
          <IonButton expand="block" onClick={fetchFiles}>
            Refresh File List
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default FileManager;
