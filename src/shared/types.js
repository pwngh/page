/**
 * Database Types
 */

/**
 * @typedef {Object} MySQLCredentials
 * @property {string} host - Database host
 * @property {number} port - Database port
 * @property {string} user - Database username
 * @property {string} password - Database password
 * @property {string} database - Database name
 */

/**
 * @typedef {Object} DBConfig
 * @property {MySQLCredentials} credentials - Database credentials
 * @property {string} database - Database name
 * @property {string} projectId - Project identifier; scopes every query to one project
 * @property {import('mysql2').ConnectionOptions} [options] - Pool option overrides merged over the package defaults
 */

/**
 * Component Types
 */

/**
 * @typedef {'accordion'|'aspect_ratio'|'banner'|'button'|'checkbox'|'container'|'divider'|'form'|'grid'|'image'|'input'|'link'|'list'|'mega_menu'|'paragraph'|'radio'|'section'|'select'|'space'|'stack'|'text'|'textarea'|'title'} ComponentType
 */

/**
 * @typedef {Object} ComponentBase
 * @property {string} id - Component identifier, unique within its page (`<type>-<n>` for generated components)
 * @property {ComponentType} type - Component type
 * @property {string} [pageId] - Owning page identifier
 * @property {string} [content] - Component content
 * @property {Object.<string, *>} [props] - Component properties
 * @property {number} [order] - Render order within the page
 * @property {Date} [createdAt] - Creation timestamp
 * @property {Date} [updatedAt] - Last update timestamp
 */

/**
 * Page Types
 */

/**
* @typedef {Object} PageMeta
* @property {string} title - Page title
* @property {string} description - Page description
* @property {string[]} [keywords] - SEO keywords
* @property {string} [canonical] - Canonical URL
* @property {string} [author] - Page author
* @property {'article'|'website'|'profile'} [type] - Open Graph type
* @property {string} [image] - Social sharing image URL
* @property {string} [locale] - Page locale (e.g. 'en-US')
* @property {boolean} [noindex] - Whether to exclude from search indexing
* @property {boolean} [nofollow] - Whether to prevent link following
* @property {string} [viewport] - Viewport settings
* @property {string} [charset] - Character encoding
* @property {Object} [openGraph] - Open Graph metadata
* @property {{
*   card?: 'summary'|'summary_large_image'|'app'|'player',
*   site?: string,
*   creator?: string,
*   title?: string,
*   description?: string
* }} [twitter] - Twitter card metadata
* @property {string} [siteName] - Site name for social sharing
* @property {string} [themeColor] - Theme color for browsers
* @property {string} [robots] - Robots meta directives
*/

/**
 * @typedef {Object} PageData
 * @property {string} id - Page identifier
 * @property {string} projectId - Project identifier
 * @property {string} [slug] - URL-friendly identifier
 * @property {PageMeta} meta - Page metadata
 * @property {ComponentBase[]} components - Page components
 * @property {Object} [settings] - Page settings
 * @property {Date} [createdAt] - Creation timestamp
 */

/**
 * Component Props Types
 */

/**
 * @typedef {Object} AccordionItem
 * @property {string} id - Unique identifier for the accordion item
 * @property {string} label - Label text shown in the header
 * @property {React.ReactNode} content - Content to be displayed when expanded
 */

/**
 * @typedef {Object} AccordionProps
 * @property {AccordionItem[]} items - Array of accordion items to display
 * @property {string} [bgColor='bg-white'] - Background color class
 * @property {string} [textColor='text-gray-800'] - Text color class
 * @property {string} [hoverColor='bg-gray-50'] - Hover background color class
 * @property {string} [activeColor='bg-gray-100'] - Active/selected color class
 * @property {boolean} [multiple=false] - Allow multiple items to be open simultaneously
 */

/**
 * @typedef {Object} AccordionItemProps
 * @property {AccordionItem} item - Accordion item data
 * @property {boolean} isOpen - Whether this item is expanded
 * @property {(id: string) => void} onClick - Click handler for toggling item
 * @property {string} [bgColor='bg-white'] - Background color class
 * @property {string} [textColor='text-gray-800'] - Text color class
 * @property {string} [hoverColor='bg-gray-50'] - Hover background color class
 * @property {string} [activeColor='bg-gray-100'] - Active/selected color class
 */

/**
 * @typedef {Object} AspectRatioProps
 * @property {number} [ratio=1] - Aspect ratio (width / height)
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Content to be rendered inside the aspect ratio container
 */

/**
 * @typedef {Object} BannerProps
 * @property {React.ReactNode} children - Content to be displayed in the banner
 * @property {'info' | 'success' | 'warning' | 'error'} [variant='info'] - Visual style variant of the banner
 * @property {'top' | 'bottom'} [position='top'] - Position of the banner on the screen
 * @property {boolean} [dismissible=true] - Whether the banner can be dismissed
 * @property {() => void} [onDismiss] - Callback function when banner is dismissed
 * @property {boolean} [showIcon=false] - Whether to show the default icon for the variant
 * @property {string} [className] - Additional CSS classes to apply to the banner
 */

/**
 * @typedef {Object} ButtonProps
 * @property {'primary'|'secondary'|'outline'|'ghost'} [variant='primary'] - Visual variant
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant
 * @property {boolean} [fullWidth=false] - Whether button spans full width
 * @property {boolean} [disabled=false] - Disabled state
 * @property {boolean} [loading=false] - Loading state
 * @property {'button'|'submit'|'reset'} [type='button'] - Button type attribute
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Button content
 * @property {() => void} [onClick] - Click handler
 */

/**
 * @typedef {Object} CheckboxProps
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant
 * @property {boolean} [disabled=false] - Disabled state
 * @property {boolean} [checked=false] - Checked state
 * @property {boolean} [indeterminate=false] - Indeterminate state
 * @property {string} [className] - Additional CSS classes
 * @property {string} [label] - Checkbox label
 * @property {(checked: boolean) => void} [onChange] - Change handler
 */

/**
 * @typedef {Object} ContainerProps
 * @property {'sm'|'md'|'lg'|'xl'|'full'} [maxWidth='lg'] - Maximum width constraint
 * @property {boolean} [center=true] - Center horizontally
 * @property {string} [padding] - Custom padding override
 * @property {'none'|'sm'|'md'|'lg'} [space='none'] - Vertical spacing
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Container content
 */

/**
 * @typedef {Object} DividerProps
 * @property {'horizontal'|'vertical'} [orientation='horizontal'] - Divider orientation
 * @property {'solid'|'dashed'|'dotted'} [variant='solid'] - Line style variant
 * @property {'thin'|'medium'|'thick'} [weight='thin'] - Line thickness
 * @property {React.ReactNode} [label] - Optional center label
 * @property {'start'|'center'|'end'} [labelPosition='center'] - Label position
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} FileUploadProps
 * @property {(files: FileList) => void} onUpload - Handler for uploaded files
 * @property {string[]} [accept] - Allowed file types
 * @property {boolean} [multiple=false] - Allow multiple file selection
 * @property {number} [maxSize] - Maximum file size in bytes
 * @property {boolean} [disabled=false] - Disabled state
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} FormProps
 * @property {React.ReactNode} children - Form child components
 * @property {string} [className] - Additional CSS classes
 * @property {string} [action] - Form action URL
 * @property {'get' | 'post' | 'put' | 'patch' | 'delete'} [method='post'] - HTTP method
 * @property {boolean} [replace] - Replace current history entry
 * @property {boolean} [preventScrollReset] - Prevent scroll reset on submission
 * @property {boolean} [relative] - Use relative routing
 * @property {Object} [formData] - External form data for controlled mode
 * @property {(data: Object) => void} [onChange] - Change handler for form state
 * @property {'controlled' | 'uncontrolled'} [mode='uncontrolled'] - Form state management mode
 */

/**
 * @typedef {Object} GridProps
 * @property {1|2|3|4|6|12} [columns=1] - Number of grid columns
 * @property {Object} [responsive] - Responsive column counts
 * @property {1|2|3|4} [responsive.sm] - Small breakpoint columns
 * @property {1|2|3|4|6} [responsive.md] - Medium breakpoint columns
 * @property {1|2|3|4|6|12} [responsive.lg] - Large breakpoint columns
 * @property {number} [gap=4] - Grid gap size
 * @property {'row'|'col'|'dense'} [flow='row'] - Grid auto flow
 * @property {boolean} [stretch=true] - Stretch items to fill height
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Grid items
 */

/**
 * @typedef {Object} GridItemProps
 * @property {1|2|3|4|6|12} [span] - Column span
 * @property {Object} [responsive] - Responsive spans
 * @property {1|2|3|4} [responsive.sm] - Small breakpoint span
 * @property {1|2|3|4|6} [responsive.md] - Medium breakpoint span
 * @property {1|2|3|4|6|12} [responsive.lg] - Large breakpoint span
 * @property {number} [start] - Grid column start
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Item content
 */

/**
 * @typedef {Object} IconProps
 * @property {string} name - Icon identifier name
 * @property {string} [size='24'] - Width/height in pixels
 * @property {string} [color='currentColor'] - Icon color
 * @property {string} [className] - Additional CSS classes
 * @property {React.CSSProperties} [style] - Inline styles
 * @property {() => void} [onClick] - Click event handler
 * @property {string} [title] - Tooltip text
 * @property {'none' | 'spin' | 'pulse'} [animation] - Animation type
 */

/**
 * @typedef {Object} ImageProps
 * @property {string} src - Image source URL
 * @property {string} alt - Alternative text description
 * @property {number} [width] - Image width in pixels
 * @property {number} [height] - Image height in pixels
 * @property {'contain'|'cover'|'fill'|'none'} [fit='cover'] - Object fit mode
 * @property {boolean} [rounded=false] - Apply rounded corners
 * @property {boolean} [lazy=true] - Use lazy loading
 * @property {boolean} [priority=false] - Priority loading for LCP
 * @property {string} [className] - Additional CSS classes
 * @property {(event) => void} [onLoad] - Load success callback
 * @property {(event) => void} [onError] - Load error callback
 */

/**
 * @typedef {Object} InputProps
 * @property {string} name - Input field name
 * @property {string} [label] - Input label text
 * @property {'text'|'email'|'password'|'number'|'tel'|'url'|'search'|
 *            'address-street'|'address-city'|'address-state'|'address-county'|
 *            'card-number'|'card-expiration'|'card-cvv'|
 *            'bank-account'|'bank-routing'|'signature'|'dollar'} [type='text'] - Input type
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [required] - Required field flag
 * @property {boolean} [disabled] - Disabled state
 * @property {boolean} [readOnly] - Read-only state
 * @property {string} [error] - Error message
 * @property {string} [helper] - Helper text
 * @property {string} [className] - Additional CSS classes
 * @property {('controlled'|'uncontrolled')} [mode='uncontrolled'] - Input mode
 * @property {function} [onChange] - Change handler receiving synthetic event with value and error
 * @property {string} [value] - Input value (required if mode is 'controlled')
 */

/**
 * @typedef {Object} LinkProps
 * @property {string} href - Link destination URL
 * @property {boolean} [external=false] - External link flag
 * @property {'primary'|'secondary'|'subtle'} [variant='primary'] - Visual variant
 * @property {boolean} [underline=false] - Show underline
 * @property {boolean} [disabled=false] - Disabled state
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Link content
 * @property {() => void} [onClick] - Click handler
 */

/**
 * @typedef {Object} ListProps
 * @property {'ordered'|'unordered'|'none'} [type='unordered'] - List style type
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant
 * @property {boolean} [dividers=false] - Show dividers between items
 * @property {string} [marker] - Custom marker for unordered lists
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - List items
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} id - Unique identifier for the menu item
 * @property {string} label - Display text for the menu item
 * @property {string} [href] - Link destination
 * @property {MenuItem[]} [children] - Nested menu items
 */

/**
 * @typedef {Object} MegaMenuProps
 * @property {MenuItem[]} items - Array of top-level menu items
 * @property {string} [bgColor='bg-white'] - Background color for the menu
 * @property {string} [textColor='text-gray-800'] - Text color for menu items
 * @property {string} [hoverColor='bg-gray-50'] - Background color for hover states
 * @property {string} [selectedColor='text-blue-600'] - Text color for selected items
 * @property {string} [activeColor='bg-gray-100'] - Background color for active items
 * @property {function} [onSelect] - Callback when menu item is selected
 */

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls modal visibility
 * @property {() => void} onClose - Called when modal should close
 * @property {React.ReactNode} children - Modal content
 * @property {string} [title] - Modal title
 * @property {string} [size='md'] - Modal size (sm, md, lg, xl, full)
 * @property {boolean} [closeOnOverlayClick=true] - Close modal when clicking overlay
 * @property {boolean} [closeOnEsc=true] - Close modal when pressing Escape
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} PageTransitionProps
 * @property {React.ReactNode} children - The content to be wrapped with transition
 * @property {string} [transitionName='page'] - Custom transition name for view transition
 * @property {Object} [style] - Additional styles for the transition wrapper
 */

/**
 * @typedef {Object} ParagraphProps
 * @property {'left'|'center'|'right'|'justify'} [align='left'] - Text alignment
 * @property {boolean} [lead=false] - Use larger lead paragraph style
 * @property {'normal'|'relaxed'|'loose'} [lineHeight='normal'] - Line height variant
 * @property {'primary'|'secondary'} [variant] - Color variant
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Paragraph content
 */

/**
 * @typedef {Object} RadioProps
 * @property {string} [id] - Unique identifier for the radio input
 * @property {string} [name] - Name attribute for the radio input
 * @property {string} [value] - Value attribute for the radio input
 * @property {boolean} [checked=false] - Checked state of the radio input
 * @property {boolean} [disabled=false] - Disabled state of the radio input
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant
 * @property {string} [label] - Label text for the radio input
 * @property {string} [className] - Additional CSS classes
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} [onChange] - Change event handler
 */

/**
 * @typedef {Object} RatingProps
 * @property {number} value - Current rating value (0-5)
 * @property {(value: number) => void} onChange - Rating change handler
 * @property {boolean} [readonly=false] - Readonly state
 * @property {boolean} [disabled=false] - Disabled state
 * @property {string} [size='md'] - Star size (sm, md, lg)
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} SectionProps
 * @property {'default'|'primary'|'secondary'|'dark'} [variant='default'] - Background variant
 * @property {'none'|'sm'|'md'|'lg'} [space='md'] - Vertical padding
 * @property {boolean} [divider=false] - Show bottom border divider
 * @property {string} [padding] - Custom padding override
 * @property {boolean} [constrainWidth=true] - Constrain content width
 * @property {'sm'|'md'|'lg'|'xl'|'full'} [maxWidth='lg'] - Content max width when constrained
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Section content
 */

/**
 * @typedef {Object} SelectProps
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant
 * @property {boolean} [fullWidth=false] - Whether select spans full width
 * @property {boolean} [disabled=false] - Disabled state
 * @property {boolean} [loading=false] - Loading state
 * @property {string} [className] - Additional CSS classes
 * @property {string} placeholder - Placeholder text
 * @property {string} label - Label text
 * @property {string} description - Description text
 * @property {Array<{ value: string, label: string }>} data - Select options data
 * @property {string} [value] - Selected value
 * @property {(value: string) => void} [onChange] - Change handler
 */

/**
 * @typedef {Object} SpaceProps
 * @property {1|2|3|4|5|6|8|10|12|16} [h] - Horizontal spacing value using Tailwind's spacing scale
 * @property {1|2|3|4|5|6|8|10|12|16} [w] - Vertical spacing value using Tailwind's spacing scale
 * @property {React.ReactNode|React.ReactNode[]} children - Child elements to be spaced
 */

/**
 * @typedef {Object} StackProps
 * @property {'vertical'|'horizontal'} [direction='vertical'] - Stack direction
 * @property {'xs'|'sm'|'md'|'lg'|'xl'} [spacing='md'] - Spacing between items
 * @property {boolean} [wrap=false] - Whether items should wrap to next line
 * @property {boolean} [fullWidth=false] - Whether stack should take full width
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Stack content
 */

/**
 * @typedef {Object} Step
 * @property {string} label - Step label
 * @property {string} [description] - Optional step description
 * @property {React.ReactNode} [icon] - Custom step icon
 * @property {boolean} [optional] - Whether step is optional
 */

/**
 * @typedef {Object} StepperProps
 * @property {Step[]} steps - Array of step configurations
 * @property {number} activeStep - Current active step (0-based)
 * @property {(step: number) => void} onChange - Step change handler
 * @property {boolean} [linear=true] - Only allow linear progression
 * @property {string} [orientation='horizontal'] - Layout orientation
 * @property {boolean} [disabled=false] - Disabled state
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} TextProps
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant for the text
 * @property {'normal'|'medium'|'bold'} [weight='normal'] - Font weight
 * @property {'primary'|'secondary'|'success'|'error'} [variant] - Color variant
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Text content
 */

/**
 * @typedef {Object} TextareaProps
 * @property {'sm'|'md'|'lg'} [size='md'] - Size variant for the textarea
 * @property {boolean} [disabled=false] - Whether the textarea is disabled
 * @property {boolean} [invalid=false] - Whether the textarea has an invalid state
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [label] - Label for the textarea
 * @property {string} [value] - Value of the textarea
 * @property {function} [onChange] - Change event handler
 */

/**
 * @typedef {Object} TitleProps
 * @property {1|2|3|4|5|6} [level=1] - Heading level (h1-h6)
 * @property {'sm'|'md'|'lg'|'xl'} [size] - Size override
 * @property {'left'|'center'|'right'} [align='left'] - Text alignment
 * @property {'primary'|'secondary'} [variant] - Color variant
 * @property {boolean} [serif=false] - Use serif font
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Title content
 */

/**
 * @typedef {Object} ToggleProps
 * @property {boolean} checked - Toggle state
 * @property {(checked: boolean) => void} onChange - Change handler
 * @property {string} [label] - Label text
 * @property {boolean} [disabled=false] - Disabled state
 * @property {string} [size='md'] - Toggle size (sm, md, lg)
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {'top'|'right'|'bottom'|'left'} TooltipPlacement
 */

/**
 * @typedef {Object} TooltipProps
 * @property {React.ReactNode} content - Content to display in tooltip
 * @property {React.ReactNode} children - Element that triggers tooltip
 * @property {TooltipPlacement} [placement='top'] - Tooltip placement
 * @property {number} [delay=0] - Delay before showing tooltip (ms)
 * @property {boolean} [disabled=false] - Disable tooltip
 * @property {string} [className] - Additional CSS classes for tooltip
 */

/**
 * Query Types
 */

/**
 * @typedef {Object} QueryOptions
 * @property {Object} [sort] - Sort specification
 * @property {number} [limit] - Maximum number of results
 * @property {number} [skip] - Number of results to skip
 */

// Export empty object since types are just for documentation
export default {};
