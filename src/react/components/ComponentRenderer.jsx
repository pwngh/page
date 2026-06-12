import React, { Suspense, useEffect, useState } from 'react';
import { Await } from '@remix-run/react';
import { COMPONENT_TYPES } from '../../shared/constants.js';

import { Accordion } from './Accordion.jsx';
import { AspectRatio } from './AspectRatio.jsx';
import { Banner } from './Banner.jsx';
import { Button } from './Button.jsx';
import { Checkbox } from './Checkbox.jsx';
import { Container } from './Container.jsx';
import { Divider } from './Divider.jsx';
import { Form } from './Form.jsx';
import { Grid } from './Grid.jsx';
import { GridItem } from './GridItem.jsx';
import { Image } from './Image.jsx';
import { Input } from './Input.jsx';
import { Link } from './Link.jsx';
import { List } from './List.jsx';
import { MegaMenu } from './MegaMenu.jsx';
import { PageTransition } from './PageTransition.jsx';
import { Paragraph } from './Paragraph.jsx';
import { Radio } from './Radio.jsx';
import { Section } from './Section.jsx';
import { Select } from './Select.jsx';
import { Space } from './Space.jsx';
import { Stack } from './Stack.jsx';
import { Text } from './Text.jsx';
import { Textarea } from './Textarea.jsx';
import { Title } from './Title.jsx';

import { useComponent } from '../hooks/useComponent.js';

/**
 * Render one component record as its React counterpart, recursing into children.
 *
 * Subscribes to the component's live data via useComponent (seeded with the
 * record itself), so later updates re-render in place. Unknown types log a
 * warning and render nothing.
 *
 * @param {{ data: import('../../shared/types.js').ComponentBase }} props
 */
function SingleComponentRenderer({ data }) {
  const { component = data } = useComponent(data.id, {
    initialData: data,
    awaitStreaming: false
  });

  /** Render child records, each behind its own Suspense skeleton. */
  const renderChildren = (components = []) => {
    return components.map(child => (
      <Suspense key={child.id} fallback={<ComponentSkeleton type={child.type} />}>
        <SingleComponentRenderer data={child} />
      </Suspense>
    ));
  };

  switch (component.type) {
    case COMPONENT_TYPES.ACCORDION:
      return <Accordion {...component.props}/>;

    case COMPONENT_TYPES.ASPECT_RATIO:
      return (
        <AspectRatio {...component.props}>
          {component.components?.[0] && (
            <SingleComponentRenderer data={component.components[0]} />
          )}
        </AspectRatio>
      );

    case COMPONENT_TYPES.BANNER:
      return <Banner {...component.props}>{component.content}</Banner>;

    case COMPONENT_TYPES.BUTTON:
      return <Button {...component.props}>{component.content}</Button>;

    case COMPONENT_TYPES.CHECKBOX:
      return <Checkbox {...component.props} />;

    case COMPONENT_TYPES.CONTAINER:
      return (
        <Container {...component.props}>
          {renderChildren(component.components)}
        </Container>
      );

    case COMPONENT_TYPES.DIVIDER:
      return <Divider {...component.props} />;

    case COMPONENT_TYPES.FORM:
      return (
        <Form id={component.id} {...component.props}>
          {renderChildren(component.components)}
        </Form>
      );

    case COMPONENT_TYPES.GRID:
      return (
        <Grid {...component.props}>
          {component.components?.map(child => (
            <GridItem key={child.id} {...child.props?.gridItem}>
              <Suspense fallback={<ComponentSkeleton type={child.type} />}>
                <SingleComponentRenderer data={child} />
              </Suspense>
            </GridItem>
          ))}
        </Grid>
      );

    case COMPONENT_TYPES.IMAGE:
      return <Image {...component.props} />;

    case COMPONENT_TYPES.INPUT:
      return <Input {...component.props} />;

    case COMPONENT_TYPES.LINK:
      return <Link {...component.props}>{component.content}</Link>;

    case COMPONENT_TYPES.LIST:
      return <List {...component.props} />;

    case COMPONENT_TYPES.MEGA_MENU:
      return <MegaMenu {...component.props} />;

    case COMPONENT_TYPES.PARAGRAPH:
      return <Paragraph {...component.props}>{component.content}</Paragraph>;

    case COMPONENT_TYPES.RADIO:
      return <Radio {...component.props} />;

    case COMPONENT_TYPES.SECTION:
      return (
        <Section {...component.props}>
          {renderChildren(component.components)}
        </Section>
      );

    case COMPONENT_TYPES.SELECT:
      return <Select {...component.props} />;

    case COMPONENT_TYPES.SPACE:
      return <Space {...component.props} />;

    case COMPONENT_TYPES.STACK:
      return (
        <Stack {...component.props}>
          {renderChildren(component.components)}
        </Stack>
      );

    case COMPONENT_TYPES.TEXT:
      return <Text {...component.props}>{component.content}</Text>;

    case COMPONENT_TYPES.TEXTAREA:
      return <Textarea {...component.props} />;

    case COMPONENT_TYPES.TITLE:
      return <Title {...component.props}>{component.content}</Title>;

    default:
      console.warn(`Unknown component type: ${component.type}`);
      return null;
  }
}

/**
 * Render a type-appropriate pulse placeholder while a component streams in.
 *
 * @param {{ type: import('../../shared/types.js').ComponentType }} props
 */
function ComponentSkeleton({ type }) {
  const baseClasses = "animate-pulse rounded";

  switch (type) {
    case COMPONENT_TYPES.TITLE:
      return <div className={`${baseClasses} h-8 bg-gray-200 w-3/4`} />;

    case COMPONENT_TYPES.TEXT:
    case COMPONENT_TYPES.PARAGRAPH:
      return (
        <div className="space-y-2">
          <div className={`${baseClasses} h-4 bg-gray-200 w-full`} />
          <div className={`${baseClasses} h-4 bg-gray-200 w-5/6`} />
          <div className={`${baseClasses} h-4 bg-gray-200 w-4/6`} />
        </div>
      );

    case COMPONENT_TYPES.BUTTON:
      return <div className={`${baseClasses} h-10 w-32 bg-gray-200`} />;

    case COMPONENT_TYPES.IMAGE:
      return <div className={`${baseClasses} h-48 w-full bg-gray-200`} />;

    case COMPONENT_TYPES.FORM:
      return (
        <div className="space-y-4">
          <div className={`${baseClasses} h-10 w-full bg-gray-200`} />
          <div className={`${baseClasses} h-10 w-full bg-gray-200`} />
          <div className={`${baseClasses} h-10 w-32 bg-gray-200`} />
        </div>
      );

    case COMPONENT_TYPES.INPUT:
    case COMPONENT_TYPES.SELECT:
    case COMPONENT_TYPES.TEXTAREA:
      return <div className={`${baseClasses} h-10 w-full bg-gray-200`} />;

    case COMPONENT_TYPES.DIVIDER:
      return <div className="h-px w-full bg-gray-200" />;

    case COMPONENT_TYPES.CONTAINER:
    case COMPONENT_TYPES.SECTION:
      return (
        <div className="space-y-4">
          <div className={`${baseClasses} h-8 bg-gray-200 w-3/4`} />
          <div className={`${baseClasses} h-4 bg-gray-200 w-full`} />
          <div className={`${baseClasses} h-4 bg-gray-200 w-5/6`} />
        </div>
      );

    case COMPONENT_TYPES.GRID:
      return (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${baseClasses} h-24 bg-gray-200`} />
          ))}
        </div>
      );

    default:
      return <div className={`${baseClasses} h-4 w-full bg-gray-200`} />;
  }
}

/** Full-page placeholder: title, text, grid, and form skeletons. */
function PageSkeleton() {
  return (
    <div className="space-y-8">
      <ComponentSkeleton type={COMPONENT_TYPES.TITLE} />
      <ComponentSkeleton type={COMPONENT_TYPES.TEXT} />
      <ComponentSkeleton type={COMPONENT_TYPES.GRID} />
      <ComponentSkeleton type={COMPONENT_TYPES.FORM} />
    </div>
  );
}

/** How long a fallback stays invisible before its skeleton appears (ms). */
const SKELETON_DELAY_MS = 250;

/** Hold back a skeleton briefly so fast loads never flash a fallback. */
function DelayedSkeleton({ children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), SKELETON_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;
  return children;
}

/**
 * Render a page's component tree with streaming, skeleton, and transition support.
 *
 * `data.components` may be a plain array or a deferred promise from a Remix
 * loader; each top-level component then resolves and renders independently
 * inside its own Suspense boundary, with skeletons delayed to avoid flashes.
 * Renders nothing when `data` has no components.
 *
 * @param {Object} props
 * @param {import('../../shared/types.js').PageData} props.data - Page payload whose `components` drive rendering.
 */
export function ComponentRenderer({ data }) {
  if (!data?.components) {
    return null;
  }

  return (
    <PageTransition>
      <Suspense fallback={<DelayedSkeleton><PageSkeleton /></DelayedSkeleton>}>
        <Await resolve={data.components}>
          {(components) => (
            <>
              {components.map(component => (
                <Suspense
                  key={component.id}
                  fallback={<DelayedSkeleton><ComponentSkeleton type={component.type} /></DelayedSkeleton>}
                >
                  <SingleComponentRenderer data={component} />
                </Suspense>
              ))}
            </>
          )}
        </Await>
      </Suspense>
    </PageTransition>
  );
}
