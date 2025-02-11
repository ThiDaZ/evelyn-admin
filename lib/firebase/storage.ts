import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL, UploadResult, StorageReference } from "firebase/storage";

// Upload file to Firebase Storage using document ID as file name
export const uploadFile = async (
  file: File,
  documentId: string,
  folder: string = ""
): Promise<string> => {
  try {
    // Use the documentId as the file name
    const fileName = `${documentId}.${file.name.split(".").pop()}`;

    // Create a reference to the Firebase storage location
    const storageRef: StorageReference = ref(storage, `${folder}${fileName}`);

    // Upload the file
    const res: UploadResult = await uploadBytes(storageRef, file);

    // Return the full path to the file in Firebase storage
    return res.metadata.fullPath;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("File upload failed: " + error.message);
    } else {
      throw new Error("File upload failed");
    }
  }
};

// Get file URL from Firebase Storage using the path
export const getFile = async (path: string): Promise<string> => {
  try {
    const fileRef = ref(storage, path);
    const url = await getDownloadURL(fileRef);
    return url;  // Return the file's download URL
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to get file: " + error.message);
    } else {
      throw new Error("Failed to get file");
    }
  }
};
