import React from 'react';
import { Input } from '../../react/components/Input.jsx';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'An accessible input field component with support for labels, validation states, and specialized input types for addresses, payments, and banking information.'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text', 'email', 'password', 'number', 'tel', 'url', 'search',
        'address-street', 'address-city', 'address-state', 'address-county',
        'card-number', 'card-expiration', 'card-cvv',
        'bank-account', 'bank-routing',
        'signature', 'dollar'
      ]
    },
    disabled: {
      control: 'boolean'
    },
    readOnly: {
      control: 'boolean'
    },
    required: {
      control: 'boolean'
    }
  }
};

// Basic Examples
export const Default = {
  args: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text'
  }
};

export const WithValidation = {
  args: {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    error: 'Please enter a valid email address',
    placeholder: 'you@example.com'
  }
};

export const WithHelper = {
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    helper: 'Password must be at least 8 characters long',
    placeholder: '••••••••'
  }
};

// Input States
export const States = {
  render: () => (
    <div className="space-y-4">
      <Input
        name="default"
        label="Default"
        placeholder="Default input"
      />
      <Input
        name="disabled"
        label="Disabled"
        placeholder="Disabled input"
        disabled
      />
      <Input
        name="readonly"
        label="Read Only"
        placeholder="Read only input"
        readOnly
        value="Read only value"
      />
      <Input
        name="error"
        label="Error State"
        placeholder="Error input"
        error="This field has an error"
        value="Invalid value"
      />
    </div>
  )
};

// Address Fields
export const AddressFields = {
  render: () => (
    <div className="space-y-4">
      <Input
        name="street"
        label="Street Address"
        type="address-street"
        placeholder="123 Main St"
      />
      <Input
        name="city"
        label="City"
        type="address-city"
        placeholder="San Francisco"
      />
      <Input
        name="state"
        label="State"
        type="address-state"
        placeholder="CA"
      />
      <Input
        name="county"
        label="County"
        type="address-county"
        placeholder="San Francisco County"
      />
    </div>
  )
};

// Payment Fields
export const PaymentFields = {
  render: () => (
    <div className="space-y-4">
      <Input
        name="cardNumber"
        label="Card Number"
        type="card-number"
        placeholder="1234 5678 9012 3456"
      />
      <Input
        name="cardExpiration"
        label="Expiration Date"
        type="card-expiration"
        placeholder="MM/YY"
      />
      <Input
        name="cardCvv"
        label="CVV"
        type="card-cvv"
        placeholder="123"
      />
    </div>
  )
};

// Banking Fields
export const BankingFields = {
  render: () => (
    <div className="space-y-4">
      <Input
        name="accountNumber"
        label="Account Number"
        type="bank-account"
        placeholder="Enter account number"
      />
      <Input
        name="routingNumber"
        label="Routing Number"
        type="bank-routing"
        placeholder="Enter routing number"
      />
    </div>
  )
};

// Special Types
export const SpecialTypes = {
  render: () => (
    <div className="space-y-4">
      <Input
        name="signature"
        label="Signature"
        type="signature"
        placeholder="Type your full name"
      />
      <Input
        name="amount"
        label="Amount"
        type="dollar"
        placeholder="0.00"
      />
      <Input
        name="search"
        label="Search"
        type="search"
        placeholder="Search..."
      />
    </div>
  )
};

// Form Example
export const CompleteForm = {
  render: () => (
    <form className="space-y-6 max-w-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <Input
          name="fullName"
          label="Full Name"
          type="text"
          required
          placeholder="John Doe"
        />
        <Input
          name="email"
          label="Email"
          type="email"
          required
          placeholder="john@example.com"
        />
        <Input
          name="phone"
          label="Phone"
          type="tel"
          placeholder="(555) 555-5555"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Billing Address</h3>
        <Input
          name="billingStreet"
          label="Street Address"
          type="address-street"
          required
          placeholder="123 Main St"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="billingCity"
            label="City"
            type="address-city"
            required
            placeholder="City"
          />
          <Input
            name="billingState"
            label="State"
            type="address-state"
            required
            placeholder="ST"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Information</h3>
        <Input
          name="paymentCard"
          label="Card Number"
          type="card-number"
          required
          placeholder="1234 5678 9012 3456"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="paymentExpiration"
            label="Expiration"
            type="card-expiration"
            required
            placeholder="MM/YY"
          />
          <Input
            name="paymentCvv"
            label="CVV"
            type="card-cvv"
            required
            placeholder="123"
          />
        </div>
      </div>
    </form>
  )
};
