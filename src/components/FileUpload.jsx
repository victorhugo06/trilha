import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import axios from "axios";

const FileUpload = ({ userId, onFilesChange }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Carregar arquivos do backend para o usuário, se o userId estiver definido
    const fetchUserFiles = async () => {
      if (!userId) return; // Não faz a requisição se userId não estiver definido

      try {
        const response = await axios.get(`http://localhost:5000/api/uploads/${userId}`);
        setFiles(response.data.map(file => ({
          name: file.filename,
          path: file.filename
        })));
      } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
      }
    };

    fetchUserFiles();
  }, [userId]);

  const onDrop = useCallback((acceptedFiles) => {
    const existingFileNames = new Set(files.map(file => file.name));

    const newFiles = acceptedFiles.filter(file => !existingFileNames.has(file.name));

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
  }, [files, onFilesChange]);

  const removeFile = async (fileToRemove) => {
    try {
      await axios.delete(`http://localhost:5000/api/uploads/${fileToRemove.path}`);
      const newFiles = files.filter(file => file !== fileToRemove);
      setFiles(newFiles);
      onFilesChange(newFiles.filter(file => !file.path));
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf",
    multiple: true,
  });

  return (
    <div>
      <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg cursor-pointer mt-6">
        <div {...getRootProps()} className="p-6 text-center bg-gray-100 hover:bg-gray-200">
          <input {...getInputProps()} />
          <p className="text-gray-500">Arraste e solte arquivos aqui, ou clique para selecionar.</p>
        </div>
      </div>
      <div className="mt-4">
        {files.length > 0 && (
          <ul className="mt-4 list-disc">
            <h2>Anexos</h2>
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                {file.path ? (
                  <a href={`http://localhost:5000/uploads/${file.path}`} target="_blank" rel="noopener noreferrer">{file.name}</a>
                ) : (
                  <span>{file.name}</span>
                )}
                <button
                  onClick={() => removeFile(file)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  userId: PropTypes.string,
  onFilesChange: PropTypes.func.isRequired,
  initialFiles: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File)
  ]))
};

export default FileUpload;
