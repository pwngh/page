import React, { useState, useEffect } from 'react';
import { ComponentRenderer } from '../../react/components/ComponentRenderer.jsx';
import { COMPONENT_TYPES } from '../../shared/constants.js';
import { withRemixMocks } from '../../../.storybook/mocks/remix';



const mockPageData = {
  id: 'page-1',
  projectId: 'project-1',
  slug: 'homepage',
  components: [
    {
      id: 'title-1',
      type: COMPONENT_TYPES.TITLE,
      content: 'Welcome to Our Website',
      props: { level: 1 }
    },
    {
      id: 'text-1',
      type: COMPONENT_TYPES.TEXT,
      content: 'This is a sample page showcasing our component renderer.'
    },
    {
      id: 'grid-1',
      type: COMPONENT_TYPES.GRID,
      props: { columns: 2, gap: 4 },
      components: [
        {
          id: 'image-1',
          type: COMPONENT_TYPES.IMAGE,
          props: { src: '/api/placeholder/400/300', alt: 'Placeholder' }
        },
        {
          id: 'image-2',
          type: COMPONENT_TYPES.IMAGE,
          props: { src: '/api/placeholder/400/300', alt: 'Placeholder' }
        }
      ]
    }
  ]
};

const uiShowcaseData = {
  "id": "ui-builder",
  "projectId": "ui-builder-project",
  "slug": "ui-builder",
  "meta": {
    "title": "UI Builder",
    "description": "Build UI layouts using our component system",
    "keywords": ["ui", "builder", "components", "editor"]
  },
  "components": [
    {
      "id": "header-section",
      "type": "section",
      "props": {
        "variant": "primary",
        "space": "lg"
      },
      "components": [
        {
          "id": "main-title",
          "type": "title",
          "content": "UI Builder",
          "props": {
            "level": 1,
            "size": "xl",
            "align": "center"
          }
        },
        {
          "id": "description",
          "type": "paragraph",
          "content": "Create UI layouts by configuring components and their properties",
          "props": {
            "lead": true,
            "align": "center"
          }
        }
      ]
    },
    {
      "id": "builder-form",
      "type": "form",
      "props": {
        "method": "post",
        "action": "/api/save-layout"
      },
      "components": [
        {
          "id": "main-grid",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 6,
            "responsive": {
              "sm": 1,
              "md": 1,
              "lg": 2
            }
          },
          "components": [
            {
              "id": "config-panel",
              "type": "section",
              "props": {
                "variant": "secondary",
                "space": "md"
              },
              "components": [
                {
                  "id": "config-title",
                  "type": "title",
                  "content": "Page Configuration",
                  "props": {
                    "level": 2,
                    "size": "lg"
                  }
                },
                {
                  "id": "basic-info",
                  "type": "stack",
                  "props": {
                    "direction": "vertical",
                    "spacing": "md"
                  },
                  "components": [
                    {
                      "id": "page-id",
                      "type": "input",
                      "props": {
                        "name": "pageId",
                        "label": "Page ID",
                        "type": "text",
                        "required": true,
                        "placeholder": "Enter unique page ID"
                      }
                    },
                    {
                      "id": "project-id",
                      "type": "input",
                      "props": {
                        "name": "projectId",
                        "label": "Project ID",
                        "type": "text",
                        "required": true,
                        "placeholder": "Enter project ID"
                      }
                    },
                    {
                      "id": "slug",
                      "type": "input",
                      "props": {
                        "name": "slug",
                        "label": "URL Slug",
                        "type": "text",
                        "placeholder": "url-friendly-slug"
                      }
                    }
                  ]
                },
                {
                  "id": "meta-info",
                  "type": "stack",
                  "props": {
                    "direction": "vertical",
                    "spacing": "md"
                  },
                  "components": [
                    {
                      "id": "meta-title",
                      "type": "title",
                      "content": "Meta Information",
                      "props": {
                        "level": 3,
                        "size": "md"
                      }
                    },
                    {
                      "id": "page-title",
                      "type": "input",
                      "props": {
                        "name": "meta.title",
                        "label": "Page Title",
                        "type": "text",
                        "required": true,
                        "placeholder": "Enter page title"
                      }
                    },
                    {
                      "id": "page-description",
                      "type": "textarea",
                      "props": {
                        "name": "meta.description",
                        "label": "Description",
                        "placeholder": "Enter page description"
                      }
                    },
                    {
                      "id": "page-keywords",
                      "type": "input",
                      "props": {
                        "name": "meta.keywords",
                        "label": "Keywords (comma-separated)",
                        "type": "text",
                        "placeholder": "keyword1, keyword2, keyword3"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "id": "components-panel",
              "type": "section",
              "props": {
                "variant": "secondary",
                "space": "md"
              },
              "components": [
                {
                  "id": "components-title",
                  "type": "title",
                  "content": "Components",
                  "props": {
                    "level": 2,
                    "size": "lg"
                  }
                },
                {
                  "id": "add-component",
                  "type": "stack",
                  "props": {
                    "direction": "vertical",
                    "spacing": "md"
                  },
                  "components": [
                    {
                      "id": "component-type",
                      "type": "select",
                      "props": {
                        "label": "Add Component",
                        "placeholder": "Select component type",
                        "data": [
                          {"value": "section", "label": "Section"},
                          {"value": "container", "label": "Container"},
                          {"value": "grid", "label": "Grid"},
                          {"value": "stack", "label": "Stack"},
                          {"value": "title", "label": "Title"},
                          {"value": "text", "label": "Text"},
                          {"value": "paragraph", "label": "Paragraph"},
                          {"value": "image", "label": "Image"},
                          {"value": "button", "label": "Button"},
                          {"value": "link", "label": "Link"},
                          {"value": "input", "label": "Input"},
                          {"value": "textarea", "label": "Textarea"},
                          {"value": "select", "label": "Select"},
                          {"value": "checkbox", "label": "Checkbox"},
                          {"value": "radio", "label": "Radio"},
                          {"value": "list", "label": "List"},
                          {"value": "divider", "label": "Divider"},
                          {"value": "aspectRatio", "label": "Aspect Ratio"}
                        ]
                      }
                    },
                    {
                      "id": "add-button",
                      "type": "button",
                      "content": "Add Component",
                      "props": {
                        "variant": "primary",
                        "size": "md"
                      }
                    }
                  ]
                },
                {
                  "id": "component-list",
                  "type": "list",
                  "props": {
                    "type": "none",
                    "dividers": true
                  },
                  "components": [
                    {
                      "id": "component-template",
                      "type": "stack",
                      "props": {
                        "direction": "vertical",
                        "spacing": "sm"
                      },
                      "components": [
                        {
                          "id": "component-header",
                          "type": "stack",
                          "props": {
                            "direction": "horizontal",
                            "spacing": "sm"
                          },
                          "components": [
                            {
                              "id": "component-name",
                              "type": "text",
                              "content": "Component Name",
                              "props": {
                                "weight": "bold"
                              }
                            },
                            {
                              "id": "component-actions",
                              "type": "stack",
                              "props": {
                                "direction": "horizontal",
                                "spacing": "xs"
                              },
                              "components": [
                                {
                                  "id": "edit-button",
                                  "type": "button",
                                  "content": "Edit",
                                  "props": {
                                    "variant": "secondary",
                                    "size": "sm"
                                  }
                                },
                                {
                                  "id": "delete-button",
                                  "type": "button",
                                  "content": "Delete",
                                  "props": {
                                    "variant": "ghost",
                                    "size": "sm"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "preview-section",
          "type": "section",
          "props": {
            "variant": "default",
            "space": "lg"
          },
          "components": [
            {
              "id": "preview-title",
              "type": "title",
              "content": "Preview",
              "props": {
                "level": 2,
                "size": "lg",
                "align": "center"
              }
            },
            {
              "id": "preview-container",
              "type": "container",
              "props": {
                "maxWidth": "xl",
                "padding": "lg"
              }
            }
          ]
        },
        {
          "id": "actions",
          "type": "stack",
          "props": {
            "direction": "horizontal",
            "spacing": "md",
            "fullWidth": true
          },
          "components": [
            {
              "id": "save-button",
              "type": "button",
              "content": "Save Layout",
              "props": {
                "type": "submit",
                "variant": "primary",
                "size": "lg"
              }
            },
            {
              "id": "export-button",
              "type": "button",
              "content": "Export JSON",
              "props": {
                "variant": "secondary",
                "size": "lg"
              }
            }
          ]
        }
      ]
    }
  ],
  "settings": {
    "theme": "light",
    "layout": "builder"
  },
  "createdAt": "2024-12-16T12:00:00Z",
  "updatedAt": "2024-12-16T12:00:00Z"
}

const webInquiryForm = {
  "id": "web-inquiry",
  "projectId": "project-1",
  "slug": "web-inquiry",
  "components": [
    {
      "id": "inquiry-title",
      "type": "title",
      "content": "Website Project Inquiry",
      "props": {
        "level": 1
      }
    },
    {
      "id": "inquiry-description",
      "type": "text",
      "content": "Tell us about your website project and requirements. We'll get back to you within 24 hours."
    },
    {
      "id": "inquiry-form",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 4
      },
      "components": [
        {
          "id": "contact-info",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "first-name",
              "type": "input",
              "props": {
                "name": "firstName",
                "label": "First Name",
                "placeholder": "John",
                "required": true
              }
            },
            {
              "id": "last-name",
              "type": "input",
              "props": {
                "name": "lastName",
                "label": "Last Name",
                "placeholder": "Doe",
                "required": true
              }
            }
          ]
        },
        {
          "id": "email",
          "type": "input",
          "props": {
            "name": "email",
            "type": "email",
            "label": "Email Address",
            "placeholder": "john@company.com",
            "required": true
          }
        },
        {
          "id": "phone",
          "type": "input",
          "props": {
            "name": "phone",
            "type": "tel",
            "label": "Phone Number",
            "placeholder": "(555) 123-4567"
          }
        },
        {
          "id": "company",
          "type": "input",
          "props": {
            "name": "company",
            "label": "Company Name",
            "placeholder": "Acme Inc."
          }
        },
        {
          "id": "project-type",
          "type": "select",
          "props": {
            "name": "projectType",
            "label": "Project Type",
            "required": true,
            "data": [
              {"value": "new", "label": "New Website"},
              {"value": "redesign", "label": "Website Redesign"},
              {"value": "ecommerce", "label": "E-commerce Website"},
              {"value": "maintenance", "label": "Website Maintenance"},
              {"value": "other", "label": "Other"}
            ]
          }
        },
        {
          "id": "budget",
          "type": "select",
          "props": {
            "name": "budget",
            "label": "Budget Range",
            "required": true,
            "data": [
              {"value": "5k-10k", "label": "$5,000 - $10,000"},
              {"value": "10k-25k", "label": "$10,000 - $25,000"},
              {"value": "25k-50k", "label": "$25,000 - $50,000"},
              {"value": "50k+", "label": "$50,000+"}
            ]
          }
        },
        {
          "id": "timeline",
          "type": "select",
          "props": {
            "name": "timeline",
            "label": "Desired Timeline",
            "required": true,
            "data": [
              {"value": "1-2", "label": "1-2 months"},
              {"value": "3-4", "label": "3-4 months"},
              {"value": "5-6", "label": "5-6 months"},
              {"value": "6+", "label": "6+ months"}
            ]
          }
        },
        {
          "id": "project-description",
          "type": "textarea",
          "props": {
            "name": "description",
            "label": "Project Description",
            "placeholder": "Please describe your project, goals, and any specific requirements...",
            "required": true
          }
        },
        {
          "id": "existing-website",
          "type": "input",
          "props": {
            "name": "website",
            "type": "url",
            "label": "Current Website URL (if applicable)",
            "placeholder": "https://www.yourwebsite.com"
          }
        },
        {
          "id": "referral",
          "type": "select",
          "props": {
            "name": "referralSource",
            "label": "How did you hear about us?",
            "data": [
              {"value": "search", "label": "Search Engine"},
              {"value": "social", "label": "Social Media"},
              {"value": "referral", "label": "Referral"},
              {"value": "other", "label": "Other"}
            ]
          }
        },
        {
          "id": "terms-checkbox",
          "type": "checkbox",
          "props": {
            "name": "terms",
            "label": "I agree to the privacy policy and terms of service",
            "required": true
          }
        },
        {
          "id": "submit-button",
          "type": "button",
          "content": "Submit Inquiry",
          "props": {
            "type": "submit",
            "variant": "primary"
          }
        }
      ]
    }
  ]
}

const achInformationForm = {
  "id": "ach-info",
  "projectId": "project-1",
  "slug": "ach-information",
  "components": [
    {
      "id": "ach-title",
      "type": "title",
      "content": "ACH Payment Information",
      "props": {
        "level": 1
      }
    },
    {
      "id": "ach-description",
      "type": "text",
      "content": "Please provide your bank account information for ACH payment processing. All information is encrypted and secure."
    },
    {
      "id": "ach-form",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 4
      },
      "components": [
        {
          "id": "account-type",
          "type": "select",
          "props": {
            "name": "accountType",
            "label": "Account Type",
            "required": true,
            "data": [
              {"value": "checking", "label": "Checking Account"},
              {"value": "savings", "label": "Savings Account"},
              {"value": "business", "label": "Business Account"}
            ]
          }
        },
        {
          "id": "account-holder",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "first-name",
              "type": "input",
              "props": {
                "name": "firstName",
                "label": "First Name on Account",
                "placeholder": "John",
                "required": true
              }
            },
            {
              "id": "last-name",
              "type": "input",
              "props": {
                "name": "lastName",
                "label": "Last Name on Account",
                "placeholder": "Doe",
                "required": true
              }
            }
          ]
        },
        {
          "id": "bank-name",
          "type": "input",
          "props": {
            "name": "bankName",
            "label": "Bank Name",
            "placeholder": "Enter your bank name",
            "required": true
          }
        },
        {
          "id": "routing-number",
          "type": "input",
          "props": {
            "name": "routingNumber",
            "label": "Routing Number",
            "placeholder": "9 digits",
            "required": true,
            "pattern": "[0-9]{9}",
            "maxLength": 9
          }
        },
        {
          "id": "account-number",
          "type": "input",
          "props": {
            "name": "accountNumber",
            "label": "Account Number",
            "placeholder": "Enter your account number",
            "required": true
          }
        },
        {
          "id": "confirm-account",
          "type": "input",
          "props": {
            "name": "confirmAccount",
            "label": "Confirm Account Number",
            "placeholder": "Re-enter your account number",
            "required": true
          }
        },
        {
          "id": "company-name",
          "type": "input",
          "props": {
            "name": "companyName",
            "label": "Company Name (if applicable)",
            "placeholder": "Business name for business accounts"
          }
        },
        {
          "id": "payment-type",
          "type": "select",
          "props": {
            "name": "paymentType",
            "label": "Payment Type",
            "required": true,
            "data": [
              {"value": "one-time", "label": "One-time Payment"},
              {"value": "recurring", "label": "Recurring Payment"}
            ]
          }
        },
        {
          "id": "authorization",
          "type": "checkbox",
          "props": {
            "name": "authorization",
            "label": "I authorize electronic debits to my account based on my instructions",
            "required": true
          }
        },
        {
          "id": "terms-checkbox",
          "type": "checkbox",
          "props": {
            "name": "terms",
            "label": "I agree to the ACH authorization terms and conditions",
            "required": true
          }
        },
        {
          "id": "submit-button",
          "type": "button",
          "content": "Submit ACH Information",
          "props": {
            "type": "submit",
            "variant": "primary"
          }
        }
      ]
    }
  ]
}

const creditCardInformationForm = {
  "id": "credit-card",
  "projectId": "project-1",
  "slug": "credit-card-information",
  "components": [
    {
      "id": "card-title",
      "type": "title",
      "content": "Credit Card Information",
      "props": {
        "level": 1
      }
    },
    {
      "id": "card-description",
      "type": "text",
      "content": "Please enter your credit card details. Your information is encrypted and secure."
    },
    {
      "id": "card-form",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 4
      },
      "components": [
        {
          "id": "card-holder",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "first-name",
              "type": "input",
              "props": {
                "name": "firstName",
                "label": "First Name on Card",
                "placeholder": "John",
                "required": true
              }
            },
            {
              "id": "last-name",
              "type": "input",
              "props": {
                "name": "lastName",
                "label": "Last Name on Card",
                "placeholder": "Doe",
                "required": true
              }
            }
          ]
        },
        {
          "id": "card-number",
          "type": "input",
          "props": {
            "name": "cardNumber",
            "label": "Card Number",
            "placeholder": "1234 5678 9012 3456",
            "required": true,
            "pattern": "[0-9]{16}",
            "maxLength": 16
          }
        },
        {
          "id": "card-details",
          "type": "grid",
          "props": {
            "columns": 3,
            "gap": 4
          },
          "components": [
            {
              "id": "expiry-month",
              "type": "select",
              "props": {
                "name": "expiryMonth",
                "label": "Expiry Month",
                "required": true,
                "data": [
                  {"value": "01", "label": "01 - January"},
                  {"value": "02", "label": "02 - February"},
                  {"value": "03", "label": "03 - March"},
                  {"value": "04", "label": "04 - April"},
                  {"value": "05", "label": "05 - May"},
                  {"value": "06", "label": "06 - June"},
                  {"value": "07", "label": "07 - July"},
                  {"value": "08", "label": "08 - August"},
                  {"value": "09", "label": "09 - September"},
                  {"value": "10", "label": "10 - October"},
                  {"value": "11", "label": "11 - November"},
                  {"value": "12", "label": "12 - December"}
                ]
              }
            },
            {
              "id": "expiry-year",
              "type": "select",
              "props": {
                "name": "expiryYear",
                "label": "Expiry Year",
                "required": true,
                "data": [
                  {"value": "2024", "label": "2024"},
                  {"value": "2025", "label": "2025"},
                  {"value": "2026", "label": "2026"},
                  {"value": "2027", "label": "2027"},
                  {"value": "2028", "label": "2028"},
                  {"value": "2029", "label": "2029"}
                ]
              }
            },
            {
              "id": "cvv",
              "type": "input",
              "props": {
                "name": "cvv",
                "label": "CVV",
                "placeholder": "123",
                "required": true,
                "pattern": "[0-9]{3,4}",
                "maxLength": 4
              }
            }
          ]
        },
        {
          "id": "card-type",
          "type": "select",
          "props": {
            "name": "cardType",
            "label": "Card Type",
            "required": true,
            "data": [
              {"value": "visa", "label": "Visa"},
              {"value": "mastercard", "label": "Mastercard"},
              {"value": "amex", "label": "American Express"},
              {"value": "discover", "label": "Discover"}
            ]
          }
        },
        {
          "id": "save-card",
          "type": "checkbox",
          "props": {
            "name": "saveCard",
            "label": "Save card for future payments"
          }
        },
        {
          "id": "terms-checkbox",
          "type": "checkbox",
          "props": {
            "name": "terms",
            "label": "I authorize charges to my card and agree to the terms of service",
            "required": true
          }
        },
        {
          "id": "submit-button",
          "type": "button",
          "content": "Submit Payment",
          "props": {
            "type": "submit",
            "variant": "primary"
          }
        }
      ]
    }
  ]
}

const billingAddressForm = {
  "id": "billing-address",
  "projectId": "project-1",
  "slug": "billing-address",
  "components": [
    {
      "id": "address-title",
      "type": "title",
      "content": "Billing Address",
      "props": {
        "level": 1
      }
    },
    {
      "id": "address-description",
      "type": "text",
      "content": "Please enter your billing address information."
    },
    {
      "id": "address-form",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 4
      },
      "components": [
        {
          "id": "name-fields",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "first-name",
              "type": "input",
              "props": {
                "name": "firstName",
                "label": "First Name",
                "placeholder": "John",
                "required": true
              }
            },
            {
              "id": "last-name",
              "type": "input",
              "props": {
                "name": "lastName",
                "label": "Last Name",
                "placeholder": "Doe",
                "required": true
              }
            }
          ]
        },
        {
          "id": "company",
          "type": "input",
          "props": {
            "name": "company",
            "label": "Company Name (Optional)",
            "placeholder": "Company Inc."
          }
        },
        {
          "id": "address-line1",
          "type": "input",
          "props": {
            "name": "addressLine1",
            "label": "Street Address",
            "placeholder": "123 Main St",
            "required": true
          }
        },
        {
          "id": "address-line2",
          "type": "input",
          "props": {
            "name": "addressLine2",
            "label": "Apartment, suite, etc. (Optional)",
            "placeholder": "Apt 4B"
          }
        },
        {
          "id": "location-fields",
          "type": "grid",
          "props": {
            "columns": 3,
            "gap": 4
          },
          "components": [
            {
              "id": "city",
              "type": "input",
              "props": {
                "name": "city",
                "label": "City",
                "placeholder": "New York",
                "required": true
              }
            },
            {
              "id": "state",
              "type": "select",
              "props": {
                "name": "state",
                "label": "State",
                "required": true,
                "data": [
                  {"value": "NY", "label": "New York"},
                  {"value": "CA", "label": "California"},
                  {"value": "TX", "label": "Texas"},
                  {"value": "FL", "label": "Florida"},
                  {"value": "IL", "label": "Illinois"}
                ]
              }
            },
            {
              "id": "zip",
              "type": "input",
              "props": {
                "name": "zipCode",
                "label": "ZIP Code",
                "placeholder": "10001",
                "required": true,
                "pattern": "[0-9]{5}",
                "maxLength": 5
              }
            }
          ]
        },
        {
          "id": "country",
          "type": "select",
          "props": {
            "name": "country",
            "label": "Country",
            "required": true,
            "data": [
              {"value": "US", "label": "United States"},
              {"value": "CA", "label": "Canada"},
              {"value": "GB", "label": "United Kingdom"},
              {"value": "AU", "label": "Australia"}
            ]
          }
        },
        {
          "id": "phone",
          "type": "input",
          "props": {
            "name": "phone",
            "type": "tel",
            "label": "Phone Number",
            "placeholder": "(555) 123-4567",
            "required": true
          }
        },
        {
          "id": "address-type",
          "type": "select",
          "props": {
            "name": "addressType",
            "label": "Address Type",
            "required": true,
            "data": [
              {"value": "residential", "label": "Residential"},
              {"value": "commercial", "label": "Commercial"}
            ]
          }
        },
        {
          "id": "save-address",
          "type": "checkbox",
          "props": {
            "name": "saveAddress",
            "label": "Save this address for future orders"
          }
        },
        {
          "id": "submit-button",
          "type": "button",
          "content": "Save Address",
          "props": {
            "type": "submit",
            "variant": "primary"
          }
        }
      ]
    }
  ]
}

const supportTicketForm = {
  "id": "support-ticket",
  "projectId": "project-1",
  "slug": "support-ticket",
  "components": [
    {
      "id": "ticket-title",
      "type": "title",
      "content": "Submit Support Ticket",
      "props": {
        "level": 1
      }
    },
    {
      "id": "ticket-description",
      "type": "text",
      "content": "Please provide details about your issue and we'll respond within 24 hours."
    },
    {
      "id": "ticket-form",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 4
      },
      "components": [
        {
          "id": "contact-info",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "first-name",
              "type": "input",
              "props": {
                "name": "firstName",
                "label": "First Name",
                "placeholder": "John",
                "required": true
              }
            },
            {
              "id": "last-name",
              "type": "input",
              "props": {
                "name": "lastName",
                "label": "Last Name",
                "placeholder": "Doe",
                "required": true
              }
            }
          ]
        },
        {
          "id": "email",
          "type": "input",
          "props": {
            "name": "email",
            "type": "email",
            "label": "Email Address",
            "placeholder": "john@example.com",
            "required": true
          }
        },
        {
          "id": "phone",
          "type": "input",
          "props": {
            "name": "phone",
            "type": "tel",
            "label": "Phone Number (Optional)",
            "placeholder": "(555) 123-4567"
          }
        },
        {
          "id": "issue-details",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "category",
              "type": "select",
              "props": {
                "name": "category",
                "label": "Issue Category",
                "required": true,
                "data": [
                  {"value": "technical", "label": "Technical Problem"},
                  {"value": "billing", "label": "Billing Issue"},
                  {"value": "account", "label": "Account Access"},
                  {"value": "product", "label": "Product Question"},
                  {"value": "feature", "label": "Feature Request"},
                  {"value": "other", "label": "Other"}
                ]
              }
            },
            {
              "id": "priority",
              "type": "select",
              "props": {
                "name": "priority",
                "label": "Priority Level",
                "required": true,
                "data": [
                  {"value": "low", "label": "Low - General Question"},
                  {"value": "medium", "label": "Medium - Minor Issue"},
                  {"value": "high", "label": "High - Serious Problem"},
                  {"value": "critical", "label": "Critical - System Down"}
                ]
              }
            }
          ]
        },
        {
          "id": "order-number",
          "type": "input",
          "props": {
            "name": "orderNumber",
            "label": "Order/Reference Number (if applicable)",
            "placeholder": "e.g., ORD-2024-123"
          }
        },
        {
          "id": "subject",
          "type": "input",
          "props": {
            "name": "subject",
            "label": "Subject",
            "placeholder": "Brief description of the issue",
            "required": true
          }
        },
        {
          "id": "description",
          "type": "textarea",
          "props": {
            "name": "description",
            "label": "Detailed Description",
            "placeholder": "Please provide as much detail as possible about your issue...",
            "required": true
          }
        },
        {
          "id": "steps",
          "type": "textarea",
          "props": {
            "name": "steps",
            "label": "Steps to Reproduce (if applicable)",
            "placeholder": "1.\n2.\n3."
          }
        },
        {
          "id": "browser-info",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 4
          },
          "components": [
            {
              "id": "browser",
              "type": "select",
              "props": {
                "name": "browser",
                "label": "Browser",
                "data": [
                  {"value": "chrome", "label": "Google Chrome"},
                  {"value": "firefox", "label": "Firefox"},
                  {"value": "safari", "label": "Safari"},
                  {"value": "edge", "label": "Microsoft Edge"},
                  {"value": "other", "label": "Other"}
                ]
              }
            },
            {
              "id": "operating-system",
              "type": "select",
              "props": {
                "name": "os",
                "label": "Operating System",
                "data": [
                  {"value": "windows", "label": "Windows"},
                  {"value": "mac", "label": "macOS"},
                  {"value": "linux", "label": "Linux"},
                  {"value": "ios", "label": "iOS"},
                  {"value": "android", "label": "Android"}
                ]
              }
            }
          ]
        },
        {
          "id": "notifications",
          "type": "checkbox",
          "props": {
            "name": "notifications",
            "label": "Email me updates about this ticket"
          }
        },
        {
          "id": "terms",
          "type": "checkbox",
          "props": {
            "name": "terms",
            "label": "I understand that response times may vary based on ticket priority and volume",
            "required": true
          }
        },
        {
          "id": "submit-button",
          "type": "button",
          "content": "Submit Ticket",
          "props": {
            "type": "submit",
            "variant": "primary"
          }
        }
      ]
    }
  ]
}

const productPage = {
  "id": "product-page",
  "projectId": "unifi-store",
  "slug": "product-details",
  "components": [
    {
      "id": "breadcrumb",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 2
      },
      "components": [
        {
          "id": "breadcrumb-text",
          "type": "text",
          "content": "Special Devices > Protect All-in-One Sensor > Protect Floodlight > AI Port",
          "props": {
            "variant": "secondary",
            "size": "sm"
          }
        }
      ]
    },
    {
      "id": "product-main",
      "type": "grid",
      "props": {
        "columns": 2,
        "gap": 8
      },
      "components": [
        {
          "id": "product-image-section",
          "type": "grid",
          "props": {
            "columns": 1,
            "gap": 4
          },
          "components": [
            {
              "id": "main-product-image",
              "type": "image",
              "props": {
                "src": "/api/placeholder/600/400",
                "alt": "AI Port Product Image"
              }
            }
          ]
        },
        {
          "id": "product-info",
          "type": "grid",
          "props": {
            "columns": 1,
            "gap": 4
          },
          "components": [
            {
              "id": "product-title",
              "type": "title",
              "content": "AI Port",
              "props": {
                "level": 1,
                "size": "xl"
              }
            },
            {
              "id": "product-subtitle",
              "type": "text",
              "content": "UP-AI-Port",
              "props": {
                "variant": "secondary"
              }
            },
            {
              "id": "product-price",
              "type": "title",
              "content": "$270.00",
              "props": {
                "level": 2,
                "size": "lg"
              }
            },
            {
              "id": "stock-status",
              "type": "text",
              "content": "Sold Out",
              "props": {
                "variant": "secondary"
              }
            },
            {
              "id": "product-description",
              "type": "text",
              "content": "AI appliance that enhances any UniFi or third-party camera with AI detection, classification, and recognition capabilities."
            },
            {
              "id": "key-features",
              "type": "grid",
              "props": {
                "columns": 1,
                "gap": 2
              },
              "components": [
                {
                  "id": "feature-1",
                  "type": "text",
                  "content": "Compatible with ONVIF third-party cameras"
                },
                {
                  "id": "feature-2",
                  "type": "text",
                  "content": "Advanced AI: face and license plate recognition"
                },
                {
                  "id": "feature-3",
                  "type": "text",
                  "content": "(1) PoE++/PoE+ power input"
                },
                {
                  "id": "feature-4",
                  "type": "text",
                  "content": "(1) PoE+/PoE power output"
                }
              ]
            },
            {
              "id": "availability-section",
              "type": "grid",
              "props": {
                "columns": 1,
                "gap": 2
              },
              "components": [
                {
                  "id": "login-text",
                  "type": "text",
                  "content": "Log in"
                },
                {
                  "id": "subscribe-text",
                  "type": "text",
                  "content": "To subscribe to back in stock emails.",
                  "props": {
                    "variant": "secondary",
                    "size": "sm"
                  }
                },
                {
                  "id": "subscribe-button",
                  "type": "button",
                  "content": "Sold Out",
                  "props": {
                    "variant": "secondary",
                    "disabled": true,
                    "fullWidth": true
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "product-tabs",
      "type": "grid",
      "props": {
        "columns": 1,
        "gap": 4
      },
      "components": [
        {
          "id": "tab-buttons",
          "type": "grid",
          "props": {
            "columns": 6,
            "gap": 2
          },
          "components": [
            {
              "id": "tab-product",
              "type": "button",
              "content": "Product",
              "props": {
                "variant": "ghost"
              }
            },
            {
              "id": "tab-specs",
              "type": "button",
              "content": "Technical Specification",
              "props": {
                "variant": "ghost"
              }
            },
            {
              "id": "tab-deployment",
              "type": "button",
              "content": "Deployment",
              "props": {
                "variant": "ghost"
              }
            },
            {
              "id": "tab-box",
              "type": "button",
              "content": "In The Box",
              "props": {
                "variant": "ghost"
              }
            },
            {
              "id": "tab-features",
              "type": "button",
              "content": "Build Features",
              "props": {
                "variant": "ghost"
              }
            },
            {
              "id": "tab-faq",
              "type": "button",
              "content": "FAQ",
              "props": {
                "variant": "ghost"
              }
            }
          ]
        },
        {
          "id": "technical-specs",
          "type": "grid",
          "props": {
            "columns": 1,
            "gap": 6
          },
          "components": [
            {
              "id": "mechanical-section",
              "type": "grid",
              "props": {
                "columns": 1,
                "gap": 4
              },
              "components": [
                {
                  "id": "mechanical-title",
                  "type": "title",
                  "content": "Mechanical",
                  "props": {
                    "level": 2,
                    "size": "lg"
                  }
                },
                {
                  "id": "dimensions-row",
                  "type": "grid",
                  "props": {
                    "columns": 2,
                    "gap": 4
                  },
                  "components": [
                    {
                      "id": "dimensions-label",
                      "type": "text",
                      "content": "Dimensions"
                    },
                    {
                      "id": "dimensions-value",
                      "type": "text",
                      "content": "Without mount: 150 x 64 x 38.4 mm (5.9 x 2.5 x 1.5\")\nWith mount: 152.7 x 69 x 47.8 mm (6 x 2.7 x 1.9\")"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

const newsletterSignupForm = {
  "id": "newsletterSignupForm",
  "projectId": "myProject",
  "type": "form",
  "props": {
    "action": "/newsletter/subscribe",
    "method": "post",
    "className": "space-y-4 w-full max-w-sm mx-auto"
  },
  "components": [
    {
      "id": "emailInput",
      "type": "input",
      "props": {
        "type": "email",
        "name": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "example@domain.com"
      }
    },
    {
      "id": "nameInput",
      "type": "input",
      "props": {
        "type": "text",
        "name": "fullName",
        "label": "Full Name",
        "required": true
      }
    },
    {
      "id": "privacyCheckbox",
      "type": "checkbox",
      "props": {
        "label": "I agree to the privacy policy",
        "required": true
      }
    },
    {
      "id": "submitButton",
      "type": "button",
      "content": "Sign Up",
      "props": {
        "type": "submit",
        "variant": "primary",
        "fullWidth": true
      }
    }
  ]
};

const clientOnboardingForm = {
  "id": "clientOnboardingForm",
  "projectId": "enterpriseProject",
  "type": "form",
  "props": {
    "action": "/onboarding/submit",
    "method": "post",
    "className": "space-y-6"
  },
  "components": [
    {
      "id": "form-grid",
      "type": "grid",
      "props": {
        "columns": 2,
        "gap": 4
      },
      "components": [
        {
          "id": "companyName",
          "type": "input",
          "props": {
            "name": "companyName",
            "label": "Company Name",
            "required": true,
            "className": "w-full"
          }
        },
        {
          "id": "contactName",
          "type": "input",
          "props": {
            "name": "contactName",
            "label": "Contact Person",
            "required": true,
            "className": "w-full"
          }
        },
        {
          "id": "contactEmail",
          "type": "input",
          "props": {
            "type": "email",
            "name": "contactEmail",
            "label": "Email Address",
            "required": true,
            "className": "w-full"
          }
        },
        {
          "id": "phoneNumber",
          "type": "input",
          "props": {
            "type": "tel",
            "name": "phoneNumber",
            "label": "Phone Number",
            "required": true,
            "className": "w-full"
          }
        }
      ]
    },
    {
      "id": "projectDescription",
      "type": "textarea",
      "props": {
        "label": "Project Description",
        "name": "projectDescription",
        "placeholder": "Tell us more about your project...",
        "required": false,
        "className": "h-32"
      }
    },
    {
      "id": "submitButton",
      "type": "button",
      "content": "Start Onboarding",
      "props": {
        "type": "submit",
        "variant": "primary"
      }
    }
  ]
};

const marketingFeedbackForm = {
  "id": "marketingFeedbackForm",
  "projectId": "marketingSite",
  "type": "form",
  "props": {
    "action": "/feedback/submit",
    "method": "post",
    "className": "space-y-4 bg-white p-6 rounded shadow-md"
  },
  "components": [
    {
      "id": "ratingQuestion",
      "type": "paragraph",
      "content": "How would you rate our new product launch?",
      "props": {
        "align": "left",
        "lead": true
      }
    },
    {
      "id": "ratingRadios",
      "type": "section",
      "props": {
        "variant": "default",
        "className": "flex gap-2"
      },
      "components": [
        {
          "id": "radio-1",
          "type": "radio",
          "props": {
            "name": "rating",
            "value": "excellent",
            "label": "Excellent"
          }
        },
        {
          "id": "radio-2",
          "type": "radio",
          "props": {
            "name": "rating",
            "value": "good",
            "label": "Good"
          }
        },
        {
          "id": "radio-3",
          "type": "radio",
          "props": {
            "name": "rating",
            "value": "average",
            "label": "Average"
          }
        },
        {
          "id": "radio-4",
          "type": "radio",
          "props": {
            "name": "rating",
            "value": "poor",
            "label": "Poor"
          }
        }
      ]
    },
    {
      "id": "feedbackTextarea",
      "type": "textarea",
      "props": {
        "label": "Additional Feedback",
        "name": "feedback",
        "placeholder": "Let us know your thoughts...",
        "className": "h-24"
      }
    },
    {
      "id": "submitButton",
      "type": "button",
      "content": "Send Feedback",
      "props": {
        "type": "submit",
        "variant": "primary"
      }
    }
  ]
};

const staffTimesheetForm = {
  "id": "staffTimesheetForm",
  "projectId": "internal",
  "type": "form",
  "props": {
    "action": "/staff/timesheet/submit",
    "method": "post",
    "className": "space-y-4 p-4 border rounded"
  },
  "components": [
    {
      "id": "employeeInfoGrid",
      "type": "grid",
      "props": {
        "columns": 2,
        "gap": 4
      },
      "components": [
        {
          "id": "inputEmployeeId",
          "type": "input",
          "props": {
            "name": "employeeId",
            "label": "Employee ID",
            "required": true
          }
        },
        {
          "id": "inputWeekEnding",
          "type": "input",
          "props": {
            "name": "weekEnding",
            "label": "Week Ending",
            "type": "date",
            "required": true
          }
        }
      ]
    },
    {
      "id": "hoursWorked",
      "type": "input",
      "props": {
        "name": "hours",
        "type": "number",
        "label": "Total Hours Worked",
        "required": true,
        "placeholder": "E.g., 40"
      }
    },
    {
      "id": "notes",
      "type": "textarea",
      "props": {
        "name": "notes",
        "label": "Notes / Tasks Accomplished",
        "className": "h-24"
      }
    },
    {
      "id": "submitBtn",
      "type": "button",
      "content": "Submit Timesheet",
      "props": {
        "type": "submit",
        "variant": "primary"
      }
    }
  ]
}

const phoneDropdownSection = {
  "id": "phoneDropdownSection",
  "projectId": "myProject",
  "type": "stack",
  "props": {
    "direction": "horizontal",
    "spacing": "4",
    "alignItems": "center"
  },
  "components": [
    {
      "id": "textOrCallLabel",
      "type": "text",
      "content": "Text or Call",
      "props": {
        "size": "lg",
        "weight": "bold",
        "className": "text-gray-700"
      }
    },
    {
      "id": "phoneNumberLink",
      "type": "link",
      "content": "123-456-7890",
      "props": {
        "href": "tel:1234567890",
        "variant": "primary",
        "className": "text-xl font-semibold",
        "underline": false
      }
    },
    {
      "id": "locationSelect",
      "type": "select",
      "props": {
        "label": "",
        "name": "location",
        "placeholder": "Select a location",
        "data": [
          { "value": "tx-dallas", "label": "TX - Dallas" },
          { "value": "tx-austin", "label": "TX - Austin" },
          { "value": "ca-san-diego", "label": "CA - San Diego" },
          { "value": "fl-miami", "label": "FL - Miami" }
        ],
        "className": "w-40"
      }
    }
  ]
}

const contactUsSection = {
  "id": "contactUsSection",
  "type": "section",
  "props": {
    "variant": "dark",        // or "primary" / "default" depending on your theme
    "space": "md",
    "className": "p-4 text-white"
  },
  "components": [
    {
      "id": "headerTitle",
      "type": "title",
      "content": "CONTACT US",
      "props": {
        "level": 2,
        "align": "center",
        "className": "mb-4 tracking-widest"
      }
    },
    {
      "id": "introContainer",
      "type": "stack",
      "props": {
        "direction": "vertical",
        "spacing": "2",
        "className": "mb-4"
      },
      "components": [
        {
          "id": "weCanHelpText",
          "type": "text",
          "content": "We can help!",
          "props": {
            "size": "md",
            "weight": "bold"
          }
        },
        {
          "id": "callOrTextLine",
          "type": "text",
          "content": "Text or Call 555-555-5555\nor send us a message using the form below",
          "props": {
            "size": "md",
            "className": "text-gray-100"
          }
        }
      ]
    },
    {
      "id": "contactForm",
      "type": "form",
      "props": {
        "action": "/contact/submit",
        "method": "post",
        "className": "bg-white p-4 rounded space-y-4 text-gray-800"
      },
      "components": [
        {
          "id": "nameGrid",
          "type": "grid",
          "props": {
            "columns": 2,
            "gap": 3
          },
          "components": [
            {
              "id": "firstNameInput",
              "type": "input",
              "props": {
                "name": "firstName",
                "label": "First name",
                "placeholder": "First name",
                "required": true
              }
            },
            {
              "id": "lastNameInput",
              "type": "input",
              "props": {
                "name": "lastName",
                "label": "Last name",
                "placeholder": "Last name",
                "required": true
              }
            }
          ]
        },
        {
          "id": "phoneNumberGrid",
          "type": "grid",
          "props": {
            "columns": 3,
            "gap": 2
          },
          "components": [
            {
              "id": "phoneArea",
              "type": "input",
              "props": {
                "name": "phoneArea",
                "label": "Phone Number",
                "placeholder": "###",
                "required": true
              }
            },
            {
              "id": "phonePrefix",
              "type": "input",
              "props": {
                "name": "phonePrefix",
                "label": " ",         // no visible label, or you can hide it via CSS
                "placeholder": "###",
                "required": true
              }
            },
            {
              "id": "phoneLine",
              "type": "input",
              "props": {
                "name": "phoneLine",
                "label": " ",         // no visible label
                "placeholder": "####",
                "required": true
              }
            }
          ]
        },
        {
          "id": "acceptsTextsCheckbox",
          "type": "checkbox",
          "props": {
            "label": "Accepts texts",
            "name": "acceptsTexts",
            "size": "md"
          }
        },
        {
          "id": "emailInput",
          "type": "input",
          "props": {
            "name": "email",
            "label": "Email",
            "type": "email",
            "placeholder": "name@example.com",
            "required": true
          }
        },
        {
          "id": "messageTextarea",
          "type": "textarea",
          "props": {
            "label": "How can we help?",
            "name": "message",
            "className": "h-24",
            "maxLength": 500
          }
        },
        {
          "id": "captchaPlaceholder",
          "type": "text",
          "content": "[ reCAPTCHA placeholder ]",
          "props": {
            "className": "text-center bg-gray-100 p-4 rounded"
          }
        },
        {
          "id": "submitButton",
          "type": "button",
          "content": "SEND",
          "props": {
            "type": "submit",
            "variant": "primary",
            "fullWidth": true,
            "className": "text-white bg-yellow-500 hover:bg-yellow-600"
          }
        }
      ]
    }
  ]
}

const languageDropdown = {
  "id": "languageDropdown",
  "type": "select",
  "props": {
    "name": "language",
    "label": "Select Language",
    "placeholder": "Select Language",
    "data": [
      { "value": "en",       "label": "English" },
      { "value": "es",       "label": "Español" },
      { "value": "zh-hans",  "label": "简体中文" },
      { "value": "zh-hant",  "label": "繁體中文" },
      { "value": "fr",       "label": "Français" },
      { "value": "de",       "label": "Deutsch" },
      { "value": "el",       "label": "Ελληνικά" },
      { "value": "hi",       "label": "हिंदी" },
      { "value": "it",       "label": "Italiano" },
      { "value": "ja",       "label": "日本語" },
      { "value": "ko",       "label": "한국어" },
      { "value": "lo",       "label": "ພາສາລາວ" },
      { "value": "pl",       "label": "Polski" },
      { "value": "pt",       "label": "Português" },
      { "value": "ru",       "label": "Русский" },
      { "value": "sk",       "label": "Slovenčina" },
      { "value": "sv",       "label": "Svenska" },
      { "value": "th",       "label": "ไทย" },
      { "value": "uk",       "label": "Українська" }
    ],
    "className": "w-48"
  }
}

const missionValuesPage = {
  "id": "missionValuesPage",
  "projectId": "myProject",
  "slug": "mission-values",
  "meta": {
    "title": "Mission & Values",
    "description": "Learn about our mission and core values."
  },
  "components": [
    {
      "id": "missionTitle",
      "type": "title",
      "content": "Mission",
      "props": {
        "level": 2,
        "className": "mb-2"
      }
    },
    {
      "id": "missionParagraph",
      "type": "paragraph",
      "content": "We strive to improve the quality of life for children and families through essential support programs, legal resources, and dedicated community outreach. By combining empathy with action, we ensure that parents and guardians have the tools needed to navigate family challenges, build stronger bonds, and thrive together.",
      "props": {
        "align": "left",
      }
    },
    {
      "id": "valuesTitle",
      "type": "title",
      "content": "Values",
      "props": {
        "level": 2,
        "className": "mt-6 mb-2"
      }
    },
    {
      "id": "valuesParagraph1",
      "type": "paragraph",
      "content": "We believe that every child, regardless of background, deserves a safe and nurturing environment. Our team is committed to offering compassionate guidance and practical solutions that honor each family’s unique experiences. We create supportive pathways to help break cycles of hardship so that children can flourish.",
      "props": {
        "align": "left",
      }
    },
    {
      "id": "valuesParagraph2",
      "type": "paragraph",
      "content": "Collaboration, respect, and integrity form the foundation of our work. By connecting diverse community partners, legal experts, and volunteers, we maximize our collective impact and reach. We continuously aim for innovative ways to deliver accessible services, ensuring families feel empowered and hopeful about their future.",
      "props": {
        "align": "left",
      }
    },
    {
      "id": "childrenImage",
      "type": "image",
      "props": {
        "src": "/images/children-group.jpg",
        "alt": "Group of smiling children",
        "className": "my-4"
      }
    },
    {
      "id": "finalParagraph",
      "type": "paragraph",
      "content": "Join us in championing the well-being of children everywhere. By partnering with families, community organizations, and generous supporters, we can nurture a world where every child has the opportunity to learn, grow, and succeed—together.",
      "props": {
        "align": "left",
      }
    }
  ]
}



const templates = {
  'Default Page': mockPageData,
  'UI Showcase': uiShowcaseData,
  'Web Inquiry Form': webInquiryForm,
  'ACH Information Form': achInformationForm,
  'Credit Card Form': creditCardInformationForm,
  'Billing Address Form': billingAddressForm,
  'Support Ticket Form': supportTicketForm,
  'Product Page': productPage,
  'Newsletter Signup Form': newsletterSignupForm,
  'Client On Boarding Form': clientOnboardingForm,
  'Marketing Feedback Form': marketingFeedbackForm,
  'Staff Timesheet Form': staffTimesheetForm,
  'Phone Dropdown Section': phoneDropdownSection,
  'Contact Us Section': contactUsSection,
  'Language Dropdown': languageDropdown,
  'Mission Values Page': missionValuesPage,
};

export default {
  title: 'Components/ComponentRenderer',
  decorators: [withRemixMocks({})],
  component: ComponentRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Component renderer with streaming support and loading states'
      }
    }
  }
};

export const Playground = {
  render: function PlaygroundStory() {
    const [selectedTemplate, setSelectedTemplate] = useState('Default Page');
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState(null);
    const [previewData, setPreviewData] = useState(templates['Default Page']);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
      const initialJson = JSON.stringify(templates[selectedTemplate], null, 2);
      setJsonInput(initialJson);
    }, [selectedTemplate]);

    const handleTemplateChange = (e) => {
      const newTemplate = e.target.value;
      setSelectedTemplate(newTemplate);
      const formattedJson = JSON.stringify(templates[newTemplate], null, 2);
      setJsonInput(formattedJson);
      setPreviewData(templates[newTemplate]);
      setJsonError(null);
    };

    const handleJsonChange = (e) => {
      const newValue = e.target.value;
      setJsonInput(newValue);

      try {
        const parsed = JSON.parse(newValue);
        setPreviewData(parsed);
        setJsonError(null);
      } catch (error) {
        setJsonError(error.message);
      }
    };

    const handleCopyClick = async () => {
      try {
        await navigator.clipboard.writeText(jsonInput);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">
                Select Template
              </label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {Object.keys(templates).map((templateName) => (
                  <option key={templateName} value={templateName}>
                    {templateName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  JSON Configuration
                </label>
                <button
                  onClick={handleCopyClick}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md 
                    ${copySuccess 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {copySuccess ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={jsonInput}
                  onChange={handleJsonChange}
                  className={`w-full h-[500px] font-mono text-sm p-4 rounded-md border ${
                    jsonError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } shadow-sm resize-none`}
                  style={{
                    lineHeight: '1.5',
                    tabSize: 2,
                    backgroundColor: '#fafafa'
                  }}
                  spellCheck="false"
                  placeholder="Enter JSON configuration..."
                />
                {jsonError && (
                  <div className="mt-2 text-sm text-red-600">
                    <span className="font-medium">Error:</span> {jsonError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Preview</h3>
            <div className="border rounded-md p-4 bg-gray-50 min-h-[500px] overflow-auto">
              <ComponentRenderer data={previewData} />
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded'
  }
};

export const Loading = {
  args: {
    data: {
      ...mockPageData,
      components: new Promise(() => {}) // Never resolves to show loading state
    }
  }
};

export const Empty = {
  args: {
    data: { components: [] }
  }
};

export const ComplexNested = {
  args: {
    data: {
      components: [
        {
          id: 'container-1',
          type: COMPONENT_TYPES.CONTAINER,
          components: [
            {
              id: 'form-1',
              type: COMPONENT_TYPES.FORM,
              components: [
                {
                  id: 'input-1',
                  type: COMPONENT_TYPES.INPUT,
                  props: { label: 'Name', placeholder: 'Enter your name' }
                },
                {
                  id: 'button-1',
                  type: COMPONENT_TYPES.BUTTON,
                  content: 'Submit',
                  props: { type: 'submit' }
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
