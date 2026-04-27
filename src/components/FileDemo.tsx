import React, { useState } from "react";
import { 
  IonButton, 
  IonCol, 
  IonGrid, 
  IonRow, 
  IonItem, 
  IonLabel, 
  IonInput 
} from "@ionic/react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FileTransfer } from "@capacitor/file-transfer";

const FileDemo: React.FC = () => {
  const [extensionFilter, setExtensionFilter] = useState(""); // e.g., ".txt"
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);

  const [copyTarget, setCopyTarget] = useState("");   // Target path for copy
  const [moveTarget, setMoveTarget] = useState("");   // Target path for move

  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadPath, setDownloadPath] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);

  // -----------------------------
  // File operations
  // -----------------------------
  const writeFile = async () => {
    await Filesystem.writeFile({
      path: "myfolder/test.txt",
      data: "Hello Ionic React!",
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
      recursive: true,
    });
    alert("File written!");
  };

  const readFile = async () => {
    try {
      const result = await Filesystem.readFile({
        path: "myfolder/test.txt",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert("File content: " + result.data);
    } catch {
      alert("File does not exist.");
    }
  };

  const appendFile = async () => {
    try {
      await Filesystem.appendFile({
        path: "myfolder/test.txt",
        data: "\nNew line added!",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert("Text appended!");
    } catch {
      alert("Cannot append. File missing.");
    }
  };

  const checkFile = async () => {
    try {
      await Filesystem.stat({
        path: "myfolder/test.txt",
        directory: Directory.Documents,
      });
      alert("File exists!");
    } catch {
      alert("File does NOT exist.");
    }
  };

  const createFolder = async () => {
    try {
      await Filesystem.mkdir({
        path: "myfolder/subfolder",
        directory: Directory.Documents,
        recursive: true,
      });
      alert("Folder created!");
    } catch {
      alert("Folder already exists or cannot be created.");
    }
  };

  const deleteFolder = async () => {
    try {
      await Filesystem.rmdir({
        path: "myfolder/subfolder",
        directory: Directory.Documents,
      });
      alert("Folder deleted!");
    } catch {
      alert("Cannot delete folder or folder does not exist.");
    }
  };

  const listFiles = async () => {
    try {
      const res = await Filesystem.readdir({
        path: "myfolder",
        directory: Directory.Documents,
      });
      alert("Files: " + JSON.stringify(res.files));
    } catch {
      alert("Folder does not exist.");
    }
  };

  const deleteFile = async () => {
    try {
      await Filesystem.deleteFile({
        path: "myfolder/test.txt",
        directory: Directory.Documents,
      });
      alert("File deleted!");
    } catch {
      alert("Cannot delete. File missing.");
    }
  };

  const filterFilesByExtension = async () => {
    try {
      const res = await Filesystem.readdir({
        path: "myfolder",
        directory: Directory.Documents,
      });

      const filtered = res.files
        .map(f => f.name)
        .filter(name => name.endsWith(extensionFilter));

      setFilteredFiles(filtered);
    } catch {
      alert("Folder does not exist.");
      setFilteredFiles([]);
    }
  };

  const copyFile = async () => {
    try {
      await Filesystem.copy({
        from: "myfolder/test.txt",
        to: copyTarget,
        directory: Directory.Documents,
      });
      alert("File copied!");
    } catch (e) {
      alert("Failed to copy file: " + e);
    }
  };

  const moveFile = async () => {
    try {
      await Filesystem.copy({
        from: "myfolder/test.txt",
        to: moveTarget,
        directory: Directory.Documents,
      });
      await Filesystem.deleteFile({
        path: "myfolder/test.txt",
        directory: Directory.Documents,
      });
      alert("File moved!");
    } catch (e) {
      alert("Failed to move file: " + e);
    }
  };

  // -----------------------------
  // Download external file
  // -----------------------------
const downloadExternalFile = async () => {
  if (!downloadUrl || !downloadPath) {
    alert("Enter download URL and save path.");
    return;
  }

  try {
    // Listen to download progress
    FileTransfer.addListener("progress", (progress) => {
      const percent = Math.round((progress.bytes / progress.contentLength) * 100);
      setDownloadProgress(percent);
    });

    const result = await FileTransfer.downloadFile({
      url: downloadUrl,
      path: downloadPath, // full relative path like "myfolder/file.pdf"
      progress: true,
    });

    alert("Download complete! Saved at: " + result.path);
    setDownloadProgress(100);
  } catch (err) {
    alert("Download failed: " + JSON.stringify(err));
    setDownloadProgress(0);
  }
};


  return (
    <IonGrid>
      {/* File Operations */}
      <IonRow>
        <IonCol>
          <IonButton onClick={writeFile}>Write File</IonButton>
          <IonButton onClick={readFile}>Read File</IonButton>
          <IonButton onClick={appendFile}>Append File</IonButton>
          <IonButton onClick={checkFile}>Check File</IonButton>
          <IonButton onClick={createFolder}>Create Folder</IonButton>
        </IonCol>

        <IonCol>
          <IonButton onClick={listFiles}>List Files</IonButton>
          <IonButton color="danger" onClick={deleteFile}>Delete File</IonButton>
          <IonButton color="danger" onClick={deleteFolder}>Delete Folder</IonButton>
        </IonCol>
      </IonRow>

      {/* Filter Files */}
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">Filter by Extension</IonLabel>
            <IonInput
              value={extensionFilter}
              placeholder="Enter extension e.g. .txt"
              onIonChange={e => setExtensionFilter(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="full" onClick={filterFilesByExtension}>Filter Files</IonButton>
          {filteredFiles.length > 0 ? (
            <div style={{ marginTop: "10px" }}>
              <strong>Filtered Files:</strong>
              <ul>
                {filteredFiles.map(file => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </div>
          ) : (
            extensionFilter && <p>No files found with this extension.</p>
          )}
        </IonCol>
      </IonRow>

      {/* Copy / Move Files */}
      <IonRow>
        <IonCol>
          <IonItem>
          
            <IonInput
              placeholder="Enter path" labelPlacement="floating"
              value={copyTarget}
              onIonChange={e => setCopyTarget(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="full" onClick={copyFile}>Copy File</IonButton>
        </IonCol>

        <IonCol>
          <IonItem>
           
            <IonInput
              placeholder="Enter path" labelPlacement="floating"
              value={moveTarget}
              onIonChange={e => setMoveTarget(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="full" onClick={moveFile}>Move File</IonButton>
        </IonCol>
      </IonRow>

      {/* Download External File */}
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="floating">Download URL</IonLabel>
            <IonInput
              placeholder="https://example.com/file.pdf"
              value={downloadUrl}
              onIonChange={(e) => setDownloadUrl(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Save As (e.g., myfolder/file.pdf)</IonLabel>
            <IonInput
              placeholder="myfolder/file.pdf"
              value={downloadPath}
              onIonChange={(e) => setDownloadPath(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="full" onClick={downloadExternalFile}>
            Download File
          </IonButton>
          {downloadProgress > 0 && (
            <p style={{ marginTop: "10px" }}>
              Download Progress: <strong>{downloadProgress}%</strong>
            </p>
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default FileDemo;
