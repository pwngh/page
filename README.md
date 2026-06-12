# @pwngh/page

> Progressive page building system for Remix applications with real-time streaming.

### Overview

This package provides a comprehensive system for building dynamic, streaming-enabled pages in Remix applications. It handles progressive loading, component management, and server-side actions with a focus on performance and developer experience.

### Installation

This package is not published to the public npm registry. Install it directly from GitHub:

```bash
npm install https://github.com/pwn-interests/page.git
```

Or clone and build from source:

```bash
git clone https://github.com/pwn-interests/page.git
cd page
npm install
npm run build
```

### Features

- 🚀 Progressive streaming with Remix defer()
- 🎨 Tailwind-styled components
- 📦 Server-side component management
- 🔄 Real-time data updates
- 📝 Form handling with file uploads
- 🛡️ Built-in security features
- ♿ Accessible by default

### Usage

#### Server-Side Setup (Node Layer)

```javascript
// ~/utils/page.server.js
import { createPageApi } from '@pwngh/page/node';

export const api = await createPageApi({
  credentials: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  database: process.env.DB_NAME,
  projectId: process.env.PROJECT_ID,
  options: {
    connectionLimit: 20,
    queueLimit: 0,
    enableKeepAlive: true,
    timezone: 'Z',
    dateStrings: true
  }
});

// ~/routes/pages.$pageId.jsx
import { api } from '~/utils/page.server';

export const loader = async ({ params }) => {
  return api.loader.loadPage(params.pageId);
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const type = formData.get('type');

  if (type === 'component') {
    return api.actions.handleComponentAction(request, params);
  }
  return api.actions.handlePageAction(request, params);
};
```

#### Client-Side Implementation (React Layer)

```javascript
import { Suspense } from 'react';
import { Await, useLoaderData } from '@remix-run/react';
import { ComponentRenderer } from '@pwngh/page/react';

export default function PageRoute() {
  const { page } = useLoaderData();
  
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Await resolve={page}>
        {(pageData) => (
          <ComponentRenderer data={pageData} />
        )}
      </Await>
    </Suspense>
  );
}
```

### Available Components

#### Base Components
```javascript
import {
  Text,
  Title,
  Paragraph,
  Button,
  List,
  Image,
  Link
} from '@pwngh/page/react';

// Example usage
<Title 
  level={1}
  size="xl"
  align="center"
>
  Welcome to our page
</Title>
```

#### Layout Components
```javascript
import {
  Container,
  Grid,
  Section
} from '@pwngh/page/react';

// Example usage
<Section background="bg-gray-50">
  <Container maxWidth="lg">
    <Grid columns={3} gap={6}>
      {/* Grid items */}
    </Grid>
  </Container>
</Section>
```

#### Form Components
```javascript
import { Form, Input } from '@pwngh/page/react';

// Example usage
<Form
  id="contact"
  action="form-submit"
>
  <Input
    name="email"
    type="email"
    label="Email Address"
    required
  />
  <Button type="submit">
    Submit
  </Button>
</Form>
```

### Component Data Structure

Components follow a consistent structure:

```json
{
  "id": "page-1",
  "projectId": "project-1",
  "slug": "homepage",
  "components": [
    {
      "id": "title-1",
      "type": "title",
      "content": "Welcome to Our Website",
      "props": {
        "level": 1
      }
    },
    {
      "id": "text-1",
      "type": "text",
      "content": "This is a sample page showcasing our component renderer."
    },
    {
      "id": "grid-1",
      "type": "grid",
      "props": {
        "columns": 2,
        "gap": 4
      },
      "components": [
        {
          "id": "image-1",
          "type": "image",
          "props": {
            "src": "/api/placeholder/400/300",
            "alt": "Placeholder"
          }
        },
        {
          "id": "image-2",
          "type": "image",
          "props": {
            "src": "/api/placeholder/400/300",
            "alt": "Placeholder"
          }
        }
      ]
    }
  ]
}
```

### Hooks

The package provides hooks for component and page management:

```javascript
import { 
  usePage,
  useComponent,
  useComponents
} from '@pwngh/page/react';

// Example usage
function PageContent() {
  const { page, updatePage, isLoading } = usePage({ 
      awaitStreaming: true 
    });

  // Use page data...
}
```

### Error Handling

The package implements comprehensive error handling:

```javascript
try {
  const response = await api.updateComponent(componentId, data);
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    // Handle validation errors
  }
}
```

### Requirements

- Remix ^2.0.0
- React ^18.0.0
- Node.js ^18.0.0

### TypeScript Support

While the package uses JSDoc for type definitions, it provides full TypeScript support through declaration files.

### License

MIT — see [LICENSE](./LICENSE).
