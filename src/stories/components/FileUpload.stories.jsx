import React from 'react';
import { fn } from '@storybook/test';
import { FileUpload } from '../../react/components/FileUpload.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

const onUpload = fn();

export default {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component: 'File upload component with drag & drop support, file validation, and error handling.'
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    onUpload: fn()
  }
};

export const WithFileTypes = {
  args: {
    accept: ['.pdf', '.docx', 'image/*'],
    onUpload: fn()
  }
};

export const WithSizeLimit = {
  args: {
    maxSize: 5 * 1024 * 1024, // 5MB
    onUpload: fn()
  }
};

export const MultipleFiles = {
  args: {
    multiple: true,
    onUpload: fn()
  }
};

export const States = {
  render: () => (
    <div className="space-y-4">
      <FileUpload
        onUpload={onUpload}
      />
      <FileUpload
        disabled
        onUpload={onUpload}
      />
    </div>
  )
};

export const WithError = () => {
  const handleUpload = (files) => {
    if (files[0].size > 1024 * 1024) {
      // Error will be shown for files larger than 1MB
      return;
    }
    onUpload(files);
  };

  return (
    <FileUpload
      maxSize={1024 * 1024}
      onUpload={handleUpload}
    />
  );
};
