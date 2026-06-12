import React, { useState } from 'react';
import { Modal } from '../../react/components/Modal.jsx';
import { Button } from '../../react/components/Button.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: 'A modal/dialog component with backdrop, animations, and accessibility features.'
      }
    }
  }
};

const DefaultExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <p>This is a basic modal with a title and content.</p>
      </Modal>
    </>
  );
};

export const Default = {
  decorators: [withRemixMocks({})],
  render: () => <DefaultExample />
};

const SizesExample = () => {
  const [size, setSize] = useState(null);
  return (
    <div className="space-x-4">
      {['sm', 'md', 'lg', 'xl', 'full'].map((modalSize) => (
        <Button key={modalSize} onClick={() => setSize(modalSize)}>
          {modalSize.toUpperCase()}
        </Button>
      ))}
      <Modal
        isOpen={!!size}
        onClose={() => setSize(null)}
        title={`${size?.toUpperCase()} Modal`}
        size={size}
      >
        <p>This is a modal with {size} size.</p>
      </Modal>
    </div>
  );
};

export const Sizes = {
  render: () => <SizesExample />
};

const WithoutTitleExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <p>Modal without a title bar</p>
        </div>
      </Modal>
    </>
  );
};

export const WithoutTitle = {
  render: () => <WithoutTitleExample />
};

const WithFormExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Contact Form"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={4} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsOpen(false)}>Submit</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export const WithForm = {
  render: () => <WithFormExample />
};

const CloseOptionsExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Close Options"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <p>This modal can only be closed using the X button.</p>
      </Modal>
    </>
  );
};

export const CloseOptions = {
  render: () => <CloseOptionsExample />
};
