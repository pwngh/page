import { useRef, useState, useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Provide a click-or-drag file picker with type and size validation.
 *
 * A batch is rejected as a whole on the first failing file, with the reason
 * shown beneath the drop zone; `onUpload` only receives batches that passed.
 *
 * @param {import('../../shared/types.js').FileUploadProps} props
 * @param {(files: FileList|File[]) => void} props.onUpload - Receives the accepted files; a single-element array unless `multiple` is set.
 * @param {string[]} [props.accept] - Allowed MIME types; trailing wildcards like 'image/*' are supported.
 * @param {number} [props.maxSize] - Per-file size limit in bytes.
 * @param {boolean} [props.multiple=false] - Accept more than one file per selection.
 */
export function FileUpload({
  onUpload,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  className,
  ...props
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const containerClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'p-8',
      'border-2',
      'border-dashed',
      'rounded-lg',
      'transition-colors',
      'duration-200',
      'cursor-pointer',

      // States
      {
        'border-blue-400 bg-blue-50': isDragging,
        'border-gray-300 hover:border-blue-400': !isDragging && !disabled,
        'border-gray-200 bg-gray-50 cursor-not-allowed': disabled,
      },

      className
    );
  }, [isDragging, disabled, className]);

  const validateFiles = (files) => {
    setError('');

    for (const file of files) {
      if (accept && !accept.some(type =>
        file.type.startsWith(type.replace('*', '')))) {
        setError(`File type not allowed: ${file.name}`);
        return false;
      }

      if (maxSize && file.size > maxSize) {
        setError(`File too large: ${file.name}`);
        return false;
      }
    }

    return true;
  };

  const handleFiles = (files) => {
    if (disabled) return;

    const fileList = multiple ? files : [files[0]];

    if (validateFiles(fileList)) {
      onUpload(fileList);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
    // Clear the input so picking the same file again still fires onChange.
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <div
        className={containerClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        {...props}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept?.join(',')}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
        />

        <svg
          className={cn(
            'w-12',
            'h-12',
            'mb-4',
            disabled ? 'text-gray-400' : 'text-gray-500'
          )}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20L28 8z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 8v12h12M20 27v-6m-3 3h6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="text-center">
          <p className={cn(
            'text-lg',
            disabled ? 'text-gray-400' : 'text-gray-700'
          )}>
            Drop files here or click to upload
          </p>
          {(accept || maxSize) && (
            <p className="mt-2 text-sm text-gray-500">
              {accept && `Allowed types: ${accept.join(', ')}`}
              {accept && maxSize && ' | '}
              {maxSize && `Max size: ${Math.round(maxSize / 1024 / 1024)}MB`}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
