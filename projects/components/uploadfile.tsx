import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadFile(props) {
  const form = useRef(null);
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      console.log("Uploading");
      form.current.submit();
    }
  }, [acceptedFiles]);

  const files = acceptedFiles.map((file) => (
    // @ts-expect-error
    <li key={file.path}>
      {
        // @ts-expect-error
        file.path
      }{" "}
      - {file.size} bytes
    </li>
  ));

  return (
    <form ref={form} method="post" encType="multipart/form-data">
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
        {...getRootProps()}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>Upload a file</span>

              <input name="file" {...getInputProps()} />
            </label>
          </div>
        </div>
      </div>

      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </form>
  );
}
