import React, { Children, isValidElement, cloneElement, ReactNode } from 'react';
import { Translate } from './Translate';

// Elements that should strictly contain text and not be wrapped in spans, 
// or where translation might break functionality (like scripts/code blocks)
const SKIPPED_ELEMENTS = new Set([
    'script', 'style', 'code', 'pre', 'textarea',
    'input', 'select', 'option', 'svg', 'path', 'defs',
    'linearGradient', 'stop', 'circle', 'rect', 'iframe'
]);

// A set to identify our own Translate component to avoid double wrapping if possible
// (Though safely handled by structure check usually)

export const AutoTranslate = ({ children }: { children: ReactNode }) => {

    const processNode = (node: ReactNode): ReactNode => {
        // 1. Handle Text Strings
        if (typeof node === 'string') {
            // Ignore empty whitespace, mostly layout spacing
            if (!node.trim()) return node;

            // Wrap valid text in Translate component
            return <Translate text={node} />;
        }

        // 2. Pass numbers as is
        if (typeof node === 'number') {
            return node;
        }

        // 3. Handle React Elements
        if (isValidElement(node)) {
            const type = node.type;

            // Get the tag name if it's a standard HTML element
            const typeName = typeof type === 'string' ? type.toLowerCase() : '';

            // Skip structural/technical elements
            if (SKIPPED_ELEMENTS.has(typeName)) {
                return node;
            }

            // If the component has children, recursively process them
            if (node.props.children) {
                const processedChildren = Children.map(node.props.children, processNode);

                // Clone element with new processed children
                return cloneElement(node, { ...node.props, children: processedChildren } as any);
            }

            return node;
        }

        // 4. Handle Arrays/Fragments
        if (Array.isArray(node)) {
            return Children.map(node, processNode);
        }

        // 5. Catch-all (null, boolean, etc.)
        return node;
    };

    return <>{processNode(children)}</>;
};
